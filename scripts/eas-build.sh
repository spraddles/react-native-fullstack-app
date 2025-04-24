#!/bin/bash

# NOTE: the mapping between Test (env) & Preview (EAS) below

ENV_FILE_PATH=""
EAS_ENVIRONMENT=""

# set environment file based on argument
if [ "$1" == "local" ]; then
  ENV_FILE_PATH=".env.local"
  EAS_ENVIRONMENT="development"
  echo "Using local environment file: local (but development on EAS)"

elif [ "$1" == "development" ]; then
  ENV_FILE_PATH=".env.test"
  EAS_ENVIRONMENT="development"
  echo "Using local environment file: test (but development on EAS)"

elif [ "$1" == "preview" ]; then
  ENV_FILE_PATH=".env.test"
  EAS_ENVIRONMENT="preview"
  echo "Using local environment file: test (but preview on EAS)"

elif [ "$1" == "production" ]; then
  ENV_FILE_PATH=".env.prod"
  EAS_ENVIRONMENT="production"
  echo "Using prod environment file: production"

else
  echo "Unknown environment: '$1'. Please use one of: local, development, preview, or production."
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

# Export ENV_FILE_PATH to make it available to other files
export ENV_FILE="$ENV_FILE"

# Check for required variables
if [ -z "$EXPO_PROJECT_ID" ]; then
  echo "Error: Required variable EXPO_PROJECT_ID is not set in $ENV_FILE_PATH."
  exit 1
fi

# export so other files can use this var (like app.config.ts)
export ENV_FILE="$ENV_FILE"

# Set EAS project
echo "EAS project: $EXPO_PROJECT_SLUG"
npx eas project:init --id $EXPO_PROJECT_ID

# Check if yarn.lock exists before trying to remove it (only keep package-json.lock)
if [ -f yarn.lock ]; then
    rm yarn.lock
    echo "Removed yarn.lock file"
else
    echo "No yarn.lock file to remove, continuing..."
fi

# Build command with appropriate environmental awareness
if [ "$1" = "local" ]; then
    echo "Build will be on local..."
    # Use the variables directly from the sourced environment
    npx eas build --profile $EAS_ENVIRONMENT --platform ios --clear-cache --local

# Check for required variables before executing remote builds
elif [ -z "$EXPO_TOKEN" ]; then
    echo "Error: Required variable EXPO_TOKEN is not set in $ENV_FILE_PATH."
    exit 1
else 
    echo "Running remote build..."
    npx eas build --profile $EAS_ENVIRONMENT --platform ios --clear-cache
fi