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

# Check if yarn.lock exists before trying to remove it (only keep package-json.lock)
if [ -f yarn.lock ]; then
    rm yarn.lock
    echo "Removed yarn.lock file"
else
    echo "No yarn.lock file to remove, continuing..."
fi

# set required env file vars for 'npx eas' command
# note: this is different to the vars that are uploaded!
source "$ENV_FILE"

if [ "$2" = "local" ]; then
    echo "Build will be on local..."
    NODE_ENV=$NODE_ENV EXPO_TOKEN=$EXPO_TOKEN npx eas-cli build --profile $EAS_ENVIRONMENT --platform ios --clear-cache --local
else
    NODE_ENV=$NODE_ENV EXPO_TOKEN=$EXPO_TOKEN npx eas-cli build --profile $EAS_ENVIRONMENT --platform ios --clear-cache
fi