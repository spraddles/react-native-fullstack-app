#!/bin/bash

ENV_FILE=""
ENV_NAME=""

# set environment file based on argument
if [ "$1" == "production" ]; then
  ENV_FILE="./.env.production"
  ENV_NAME="production"
  echo "Using production environment file: $ENV_FILE"

elif [ "$1" == "development" ]; then
  ENV_FILE="./.env.development"
  ENV_NAME="development"
  echo "Using development environment file: $ENV_FILE"

else
  echo "Unknown environment: $1. Please use 'development' or 'production'."
  exit 1
fi

SECRETS=(
    "GCP_PROJECT_ID" 
    "GCP_REGION" 
    "GCP_PROJECT_NUMBER" 
    "GCP_SERVICE_ACCOUNT" 
    "GCP_WORKLOAD_IDENTITY_PROVIDER" 
    "GCP_WORKLOAD_IDENTITY_POOL_PROVIDER"
    "GCP_WORKLOAD_IDENTITY_POOL"
    "GCP_ARTIFACT_REPO_NAME"
    )

while IFS='=' read -r key value; do
    if [[ -z "$key" ]] || [[ $key == \#* ]]; then
        continue
    fi
    if [[ " ${SECRETS[@]} " =~ " ${key} " ]]; then
        value=$(echo $value | tr -d '"' | tr -d "'" | tr -d ' ')
        if gcloud secrets describe "$key" >/dev/null 2>&1; then
            printf "%s" "$value" | gcloud secrets versions add "$key" --data-file=-
        else
            printf "%s" "$value" | gcloud secrets create "$key" --replication-policy="automatic" --data-file=-
        fi
    fi
done < $ENV_FILE