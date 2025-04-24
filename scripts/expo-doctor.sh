#!/bin/bash

ENV_FILE=""
ENV_NAME=""

# set environment file based on argument
if [ "$1" == "prod" ]; then
  ENV_FILE=".env.prod"
  ENV_NAME="prod"
  echo "Using prod environment file: $ENV_FILE"

elif [ "$1" == "local" ]; then
  ENV_FILE=".env.local"
  ENV_NAME="local"
  echo "Using local environment file: $ENV_FILE"

elif [ "$1" == "test" ]; then
  ENV_FILE=".env.test"
  ENV_NAME="test"
  echo "Using test environment file: $ENV_FILE"

else
  echo "Unknown environment: '$1'. Please use 'local', 'test' or 'prod'."
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