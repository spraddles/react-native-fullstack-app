#!/bin/bash

# NOTE: the mapping between Test (env) & Preview (EAS) below

ENV_FILE_PATH=""
EAS_ENVIRONMENT=""

# set environment file based on argument
if [ "$1" == "production" ]; then
  ENV_FILE_PATH=".env.prod"
  EAS_ENVIRONMENT="production"
  echo "Using prod environment file: $ENV_FILE_PATH"

elif [ "$1" == "dev" ]; then
  ENV_FILE_PATH=".env.dev"
  EAS_ENVIRONMENT="preview"
  echo "Using test environment file: $ENV_FILE_PATH"

else
  echo "Unknown environment: '$1'. Please use 'dev' or 'prod'."
  exit 1
fi

# Check if environment file exists
if [ ! -f "$ENV_FILE_PATH" ]; then
  echo "Error: Environment file $ENV_FILE_PATH does not exist."
  exit 1
fi

# set required env file vars for 'npx eas' command
# note: this is different to the vars that are uploaded!
source "$ENV_FILE_PATH"

# Check if required variables are set
if [ -z "$EXPO_TOKEN" ]; then
  echo "Error: Required variable EXPO_TOKEN is not set in $ENV_FILE_PATH."
  exit 1
fi

# Create a temporary file for environment variables
TMP_ENV_FILE=".env.tmp"
> $TMP_ENV_FILE # Clear/create the temp file

# Add all EXPO_PUBLIC variables to the temporary file
grep "^EXPO_PUBLIC" "$ENV_FILE_PATH" >> $TMP_ENV_FILE

# Define an array of additional environment variables that don't match EXPO_PUBLIC pattern
ADDITIONAL_VARS=(
  "EXPO_PROJECT_ID"
)

# Add the additional variables to the temporary file
for var in "${ADDITIONAL_VARS[@]}"; do
  grep "^$var=" "$ENV_FILE_PATH" >> $TMP_ENV_FILE 2>/dev/null || echo "Warning: Variable $var not found in $ENV_FILE_PATH"
done

# Count how many variables were added
VAR_COUNT=$(wc -l < $TMP_ENV_FILE)
echo "Added $VAR_COUNT variables to temporary env file"

# export so other files can use this var (like app.config.ts)
export ENV_FILE="$ENV_FILE"

# Set EAS project
echo "EAS project: $EXPO_PROJECT_SLUG"
npx eas project:init --id $EXPO_PROJECT_ID

# Push the temporary env file to EAS
echo "Pushing variables to EAS $EAS_ENVIRONMENT environment..."
npx eas env:push --environment $EAS_ENVIRONMENT --path $TMP_ENV_FILE

# Clean up
rm $TMP_ENV_FILE
echo "Temporary env file removed"

echo "Environment variables successfully pushed to $EAS_ENVIRONMENT"