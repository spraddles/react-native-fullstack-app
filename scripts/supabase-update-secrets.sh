#!/usr/bin/env sh
# update-secrets.sh — sync local .env → Supabase secrets
set -eu

###############################################################################
# 1. CONFIG                                                                   
###############################################################################
MANAGED_SECRETS="
EXPO_PUBLIC_SUPABASE_ID
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_PASSWORD
SUPABASE_SECRET_NAME
SUPABASE_ACCESS_TOKEN
"

PROTECTED="
DB_PASSWORD DB_VAULT_KEY_ID SUPABASE_DB_URL
SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY
"

COLOR_RED=31 COLOR_YEL=33 COLOR_BLU=34 COLOR_GRN=32
log()      { printf '\033[%sm• %s\033[0m\n'  "$COLOR_BLU" "$*"; }
warn()     { printf '\033[%sm⚠ %s\033[0m\n'  "$COLOR_YEL" "$*"; }
error()    { printf '\033[%sm✘ %s\033[0m\n'  "$COLOR_RED" "$*"; exit 1; }
success()  { printf '\033[%sm✓ %s\033[0m\n'  "$COLOR_GRN" "$*"; }
require()  { command -v "$1" >/dev/null 2>&1 || error "$1 is required"; }
strip()    { case $1 in SUPABASE_*) printf '%s' "${1#SUPABASE_}";; *) printf '%s' "$1";; esac; }
contains() { case " $2 " in *" $1 "*) return 0;; esac; return 1; }

###############################################################################
# 2. PRE-FLIGHT                                                               
###############################################################################
require supabase

ENV_NAME=${1:-dev}
ENV_FILE=".env.$ENV_NAME"
[ -f "$ENV_FILE" ] || error "Env file $ENV_FILE not found"

log "Sourcing $ENV_FILE"
set -a; . "$ENV_FILE"; set +a
: "${EXPO_PUBLIC_SUPABASE_ID?Missing EXPO_PUBLIC_SUPABASE_ID in $ENV_FILE}"

###############################################################################
# 3. LOCAL KEYS                                                               
###############################################################################
LOCAL_KEYS=$(printf '%s\n' $MANAGED_SECRETS | sed '/^$/d')
[ -n "$LOCAL_KEYS" ] || error "MANAGED_SECRETS is empty"
log "Managing secrets: $(echo $LOCAL_KEYS | paste -sd, -)"

###############################################################################
# 4. REMOTE KEYS (JSON → fallback table)                                      
###############################################################################
log "Fetching remote secret list …"
REMOTE_KEYS=$(
  supabase secrets list --project-ref "$EXPO_PUBLIC_SUPABASE_ID" -o json 2>/dev/null |
  grep -o '"[Nn]ame"[[:space:]]*:[[:space:]]*"[^"]*"' |
  sed 's/"[Nn]ame"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' |
  tr '\n' ' '
)

# Fallback for very old CLI versions (table output only)
if [ -z "$REMOTE_KEYS" ]; then
  REMOTE_KEYS=$(
    supabase secrets list --project-ref "$EXPO_PUBLIC_SUPABASE_ID" 2>/dev/null |
    tail -n +3 | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $1)} $1~/^[A-Za-z_][A-Za-z0-9_]{2,99}$/ {print $1}' |
    tr '\n' ' '
  )
fi
log "Found $(echo $REMOTE_KEYS | wc -w | tr -d ' ') remote secrets"

###############################################################################
# 5. UPSERT                                                                   
###############################################################################
UPSERTED=0 SKIPPED=0 PUSHED=""
log "Upserting …"

for ORIG in $LOCAL_KEYS; do
  TARGET=$(strip "$ORIG")
  VALUE=$(eval "printf '%s' \"\${$ORIG:-}\"" 2>/dev/null || true)

  if [ -z "$VALUE" ]; then
    warn "$ORIG empty → skip"
    SKIPPED=$((SKIPPED+1)); continue
  fi

  ACTION=$(contains "$TARGET" "$REMOTE_KEYS" && echo "Updating" || echo "Creating")
  log "$ACTION $TARGET"
  if supabase --yes secrets set "$TARGET=$VALUE" \
        --project-ref "$EXPO_PUBLIC_SUPABASE_ID" >/dev/null 2>&1; then
    success "$TARGET synced"
    UPSERTED=$((UPSERTED+1)); PUSHED="$PUSHED $TARGET"
  else
    warn "Failed to upsert $TARGET"
  fi
done
PUSHED=${PUSHED# }

###############################################################################
# 6. DELETE UNMANAGED                                                         
###############################################################################
REMOVED=0
log "Cleaning unmanaged secrets …"

for R in $REMOTE_KEYS; do
  contains "$R" "$PUSHED"    && continue
  contains "$R" "$PROTECTED" && { warn "Protected → keep $R"; continue; }

  log "Deleting $R"
  if supabase --yes secrets unset "$R" \
        --project-ref "$EXPO_PUBLIC_SUPABASE_ID" 2>/dev/null; then
    success "$R removed"; REMOVED=$((REMOVED+1))
  else
    warn "Could not delete $R"
  fi
done

###############################################################################
# 7. SUMMARY                                                                  
###############################################################################
success "Secret sync ($ENV_NAME) complete"
log "Summary: $UPSERTED upserted, $SKIPPED skipped, $REMOVED removed"
