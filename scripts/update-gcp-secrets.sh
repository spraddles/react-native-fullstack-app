#!/bin/bash

SECRETS=(
   "EXPO_PUBLIC_SUPABASE_ID"
   "EXPO_PUBLIC_SUPABASE_URL"
   "EXPO_PUBLIC_SUPABASE_ANON_KEY"
)

ENV_FILE=""

# Set environment file based on argument
if [ "$1" = "production" ]; then
  ENV_FILE="./.env.production" 
elif [ "$1" = "test" ]; then
  ENV_FILE="./.env.test" 
else
  echo "Error: Environment must be one of: test, production"
  exit 1
fi

echo "Using $1 environment file: $ENV_FILE"

# First, load the GCP_PROJECT_ID from the environment file
GCP_PROJECT_ID=""
while IFS='=' read -r key value; do
  if [ "$key" = "GCP_PROJECT_ID" ]; then
    # Remove quotes and spaces
    GCP_PROJECT_ID=$(echo "$value" | tr -d '"' | tr -d "'" | tr -d ' ')
    break
  fi
done < "$ENV_FILE"

# Check if GCP_PROJECT_ID was found
if [ -z "$GCP_PROJECT_ID" ]; then
  echo "Error: GCP_PROJECT_ID not found in $ENV_FILE"
  exit 1
fi

echo "Setting GCP project to: $GCP_PROJECT_ID"
# Set the active GCP project
gcloud config set project "$GCP_PROJECT_ID"

# Get list of all existing secrets
EXISTING_SECRETS=$(gcloud secrets list --format="value(name)")

# Create/update secrets from ENV file without environment suffix
while IFS='=' read -r key value; do
   if [ -z "$key" ] || [ "$(echo "$key" | cut -c1)" = "#" ]; then
       continue
   fi
   
   # Check if key is in SECRETS array
   found=0
   for secret in "${SECRETS[@]}"; do
       if [ "$key" = "$secret" ]; then
           found=1
           break
       fi
   done
   
   if [ $found -eq 1 ]; then
       # Use the original secret name without suffix
       SECRET_NAME="$key"
       
       # Remove quotes and spaces
       value=$(echo "$value" | tr -d '"' | tr -d "'" | tr -d ' ')
       
       # Check if secret exists
       if gcloud secrets describe "$SECRET_NAME" >/dev/null 2>&1; then
           printf "%s" "$value" | gcloud secrets versions add "$SECRET_NAME" --data-file=-
           echo "Updated secret: $SECRET_NAME"
       else
           printf "%s" "$value" | gcloud secrets create "$SECRET_NAME" --replication-policy="automatic" --data-file=-
           echo "Created secret: $SECRET_NAME"
       fi
   fi
done < "$ENV_FILE"

# Delete secrets not in SECRETS array
for secret in $EXISTING_SECRETS; do
   # Flag to track if secret should be deleted
   should_delete=1
   
   # Check if secret is in expected list
   for base_secret in "${SECRETS[@]}"; do
     if [ "$secret" = "$base_secret" ]; then
       should_delete=0
       break
     fi
   done
   
   # Delete if not found in expected list
   if [ $should_delete -eq 1 ]; then
     gcloud secrets delete "$secret" --quiet
     echo "Deleted secret: $secret"
   fi
done