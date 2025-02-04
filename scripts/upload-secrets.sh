#!/bin/bash

ENV_FILE=""
ENV_NAME=""

# Set environment file based on argument
if [ "$1" == "production" ]; then
 ENV_FILE="./.env.production"
 ENV_NAME="production"
elif [ "$1" == "development" ]; then
 ENV_FILE="./.env.development" 
 ENV_NAME="development"
else
 echo "Unknown environment: $1. Use 'development' or 'production'."
 exit 1
fi

echo "Using $ENV_NAME environment file: $ENV_FILE"

SECRETS=(
   "GCP_PROJECT_ID" 
   "GCP_REGION" 
   "GCP_PROJECT_NUMBER" 
   "GCP_SERVICE_ACCOUNT" 
   "GCP_WORKLOAD_IDENTITY_PROVIDER" 
   "GCP_WORKLOAD_IDENTITY_POOL"
   "GCP_ARTIFACT_REPO_NAME"
)

# Get list of all existing secrets
EXISTING_SECRETS=$(gcloud secrets list --format="value(name)")

# Create/update secrets from ENV file
while IFS='=' read -r key value; do
   if [[ -z "$key" ]] || [[ $key == \#* ]]; then
       continue
   fi
   if [[ " ${SECRETS[@]} " =~ " ${key} " ]]; then
       value=$(echo $value | tr -d '"' | tr -d "'" | tr -d ' ')
       if gcloud secrets describe "$key" >/dev/null 2>&1; then
           printf "%s" "$value" | gcloud secrets versions add "$key" --data-file=-
           echo "Updated secret: $key"
       else
           printf "%s" "$value" | gcloud secrets create "$key" --replication-policy="automatic" --data-file=-
           echo "Created secret: $key"
       fi
   fi
done < "$ENV_FILE"

# Delete secrets not in SECRETS array
for secret in $EXISTING_SECRETS; do
   if [[ ! " ${SECRETS[@]} " =~ " $secret " ]]; then
       gcloud secrets delete "$secret" --quiet
       echo "Deleted secret: $secret"
   fi
done