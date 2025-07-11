#!/bin/bash

ENV_FILE=""
ENV_NAME=""

# set environment file based on argument
if [ "$1" == "prod" ]; then
  ENV_FILE=".env.prod"
  ENV_NAME="prod"
  echo "Using prod environment file: $ENV_FILE"

elif [ "$1" == "dev" ]; then
  ENV_FILE=".env.dev"
  ENV_NAME="dev"
  echo "Using dev environment file: $ENV_FILE"

else
  echo "Unknown environment: '$1'. Please use 'dev' or 'prod'."
  exit 1
fi

# Get absolute path for the env file
ABSOLUTE_ENV_FILE_PATH="$(pwd)/$ENV_FILE"

# Check if the file exists
if [ -f "$ABSOLUTE_ENV_FILE_PATH" ]; then
  set -o allexport
  source "$ABSOLUTE_ENV_FILE_PATH"
  set -o allexport
else
  echo "Environment file not found: $ABSOLUTE_ENV_FILE_PATH"
  exit 1
fi

npx expo-doctor