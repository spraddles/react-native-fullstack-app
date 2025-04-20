#!/bin/bash

# check environment parameter was provided
if [ -z "$1" ]; then
  echo "Error: Environment parameter required (preview or production)"
  echo "Usage: sh ./scripts/eas-push-secrets.sh [preview|production]"
  exit 1
fi

# check environment parameter is either "preview" or "production"
if [ "$1" != "preview" ] && [ "$1" != "production" ]; then
  echo "Error: Environment must be either 'preview' or 'production'"
  echo "Usage: sh ./scripts/eas-push-secrets.sh [preview|production]"
  exit 1
fi

# store environment parameter
EAS_ENVIRONMENT="$1"
echo "Using environment: $EAS_ENVIRONMENT"

ENV_FILE=""
if [ "$EAS_ENVIRONMENT" == "preview" ]; then
    ENV_FILE=".env.test"
    NODE_ENV="test"
elif [ "$EAS_ENVIRONMENT" == "production" ]; then
    ENV_FILE=".env.prod"
    NODE_ENV="production"
else
    echo "Error: Unknown environment '$EAS_ENVIRONMENT'. Please use 'preview' or 'production'"
    exit 1
fi

# set required env file vars for 'npx eas' command
# note: this is different to the vars that are uploaded!
source "$ENV_FILE"

# Create a temporary file for environment variables
TMP_ENV_FILE=".env.tmp"
> $TMP_ENV_FILE # Clear/create the temp file

# Add all EXPO_PUBLIC variables to the temporary file
grep "^EXPO_PUBLIC" "$ENV_FILE" >> $TMP_ENV_FILE

# Define an array of additional environment variables that don't match EXPO_PUBLIC pattern
ADDITIONAL_VARS=(
  "EXPO_PROJECT_ID"
)

# Add the additional variables to the temporary file
for var in "${ADDITIONAL_VARS[@]}"; do
  grep "^$var=" "$ENV_FILE" >> $TMP_ENV_FILE 2>/dev/null || echo "Warning: Variable $var not found in $ENV_FILE"
done

# Count how many variables were added
VAR_COUNT=$(wc -l < $TMP_ENV_FILE)
echo "Added $VAR_COUNT variables to temporary env file"

# Push the temporary env file to EAS
echo "Pushing variables to EAS $EAS_ENVIRONMENT environment..."
NODE_ENV=$NODE_ENV EXPO_TOKEN=$EXPO_TOKEN npx eas env:push --environment $EAS_ENVIRONMENT --path $TMP_ENV_FILE

# Clean up
rm $TMP_ENV_FILE
echo "Temporary env file removed"

echo "Environment variables successfully pushed to $EAS_ENVIRONMENT"