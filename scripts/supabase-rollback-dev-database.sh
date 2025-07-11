#!/usr/bin/env bash
###############################################################################
# Supabase remote-database rollback helper
#
#  • Requires: psql, python3, .env.dev with SUPABASE_DB_PASSWORD and
#              EXPO_PUBLIC_SUPABASE_ID
#
# Options
#   --down-file=FILE.sql   Explicit rollback SQL to run            (safe)
#   --auto                 Auto-generate DROP statements*          (dev only!)
#   --force                Skip “are you sure?” prompt             (CI)
#   --keep-file            Don’t delete the local migration file   (default = delete)
#
# Examples
#   ./supabase-rollback-remote.sh --down-file supabase/migrations/20250711_down.sql
#   ./supabase-rollback-remote.sh --auto --force       # quick dev rollback
###############################################################################
set -euo pipefail

################################################################################
# 0. Parse flags
################################################################################
DOWN_FILE=""
AUTO=false
FORCE=false
KEEP_FILE=false

for arg in "$@"; do
  case "$arg" in
    --down-file=*) DOWN_FILE="${arg#*=}" ;;
    --auto)        AUTO=true ;;
    --force)       FORCE=true ;;
    --keep-file)   KEEP_FILE=true ;;
    *)
      echo "❌ Unknown flag: $arg"
      echo "Usage: $0 [--down-file=FILE.sql] [--auto] [--force] [--keep-file]"
      exit 1
      ;;
  esac
done

if [[ -z $DOWN_FILE && $AUTO == false ]]; then
  echo "❌ No rollback SQL specified. Use --down-file=… or --auto."
  exit 1
fi

################################################################################
# 1. Load environment
################################################################################
set -a
[[ -f ".env.dev" ]] && source .env.dev \
  || { echo "❌ .env.dev not found"; exit 1; }
set +a

: "${SUPABASE_DB_PASSWORD:?Missing SUPABASE_DB_PASSWORD}"
: "${EXPO_PUBLIC_SUPABASE_ID:?Missing EXPO_PUBLIC_SUPABASE_ID}"

################################################################################
# 2. Helpers
################################################################################
die() { echo "❌ $1" >&2; exit 1; }
psql_conn() {
  # Transaction-pooler port 6543 + explicit TLS
  echo "postgres://postgres.${EXPO_PUBLIC_SUPABASE_ID}:\
${ENCODED_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
}

ENCODED_PASSWORD=$(python3 - <<'PY'
import os, urllib.parse, sys
print(urllib.parse.quote(os.environ["SUPABASE_DB_PASSWORD"], safe=''))
PY
)

################################################################################
# 3. Get last migration version & file
################################################################################
echo "⏪  Fetching latest remote migration…"
LAST_MIGRATION=$(psql "$(psql_conn)" -Atc \
  "SELECT version FROM supabase_migrations.schema_migrations \
   ORDER BY version DESC LIMIT 1") || die "Cannot query migrations"
[[ -n $LAST_MIGRATION ]] || die "No migrations found on remote"

shopt -s nullglob
MIGRATION_FILES=(supabase/migrations/${LAST_MIGRATION}_*.sql)
(( ${#MIGRATION_FILES[@]} )) \
  || die "Can't find local file for migration ${LAST_MIGRATION}"
UP_MIGRATION_FILE="${MIGRATION_FILES[0]}"

echo "🔎  Last migration: ${LAST_MIGRATION}"
echo "📄  Up-file:        ${UP_MIGRATION_FILE}"

################################################################################
# 4. Build ROLLBACK_SQL
################################################################################
if [[ -n $DOWN_FILE ]]; then
  [[ -f $DOWN_FILE ]] \
    || die "--down-file specified but file not found: ${DOWN_FILE}"
  echo "📄  Using down-migration file: ${DOWN_FILE}"
  ROLLBACK_SQL=$(<"$DOWN_FILE")

elif [[ $AUTO == true ]]; then
  echo "⚡  Auto-generating DROP statements (CREATE TABLE / INDEX only)…"
  ROLLBACK_SQL="-- auto-generated rollback for ${LAST_MIGRATION}\n"
  while read -r line; do
    # Drop tables
    if [[ $line =~ ^[[:space:]]*CREATE[[:space:]]+TABLE[[:space:]]+([^\(]+) ]]; then
      tbl=$(echo "${BASH_REMATCH[1]}" | tr -d '"')
      ROLLBACK_SQL+="DROP TABLE IF EXISTS ${tbl} CASCADE;\n"
    fi
    # Drop indexes
    if [[ $line =~ ^[[:space:]]*CREATE[[:space:]]+INDEX[[:space:]]+([^\ ]+) ]]; then
      idx=$(echo "${BASH_REMATCH[1]}" | tr -d '"')
      ROLLBACK_SQL+="DROP INDEX IF EXISTS ${idx} CASCADE;\n"
    fi
  done <"$UP_MIGRATION_FILE"
  [[ -n $ROLLBACK_SQL ]] || die "Nothing auto-generated; aborting."
fi

################################################################################
# 5. Confirmation (unless --force)
################################################################################
if [[ $FORCE == false ]]; then
  echo -e "\nGenerated rollback SQL:\n--------------------------------"
  echo -e "${ROLLBACK_SQL}"
  echo    "--------------------------------"
  read -p $'\n❓ Execute this on the REMOTE database? (y/N) ' -r
  [[ $REPLY =~ ^[Yy]$ ]] || die "Cancelled"
fi

################################################################################
# 6. Execute rollback
################################################################################
echo "🏃  Executing inside single transaction…"
psql "$(psql_conn)" -v ON_ERROR_STOP=1 <<SQL
BEGIN;
${ROLLBACK_SQL}

-- Remove migration record
DELETE FROM supabase_migrations.schema_migrations
  WHERE version = '${LAST_MIGRATION}';
COMMIT;
SQL
echo "✅  Remote rollback complete."

################################################################################
# 7. Delete local migration file(s) unless --keep-file
################################################################################
if [[ $KEEP_FILE == false ]]; then
  echo "🗑  Deleting local migration file(s)…"
  rm -v -- "${MIGRATION_FILES[@]}"
  echo "🗑  Local file(s) removed."
else
  echo "📂  --keep-file set: local migration file(s) left untouched."
fi
