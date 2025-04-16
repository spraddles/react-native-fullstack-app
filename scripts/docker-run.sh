#!/bin/bash

ENV_FILE=""
ENV_NAME=""

# set environment file based on argument
if [ "$1" == "prod" ]; then
  ENV_FILE="./.env.prod"
  ENV_NAME="prod"
  echo "Using prod environment file: $ENV_FILE"

elif [ "$1" == "dev" ]; then
  ENV_FILE="./.env.dev"
  ENV_NAME="dev"
  echo "Using dev environment file: $ENV_FILE"

elif [ "$1" == "test" ]; then
  ENV_FILE="./.env.test"
  ENV_NAME="test"
  echo "Using test environment file: $ENV_FILE"

else
  echo "Unknown environment: $1. Please use 'dev', 'test' or 'prod'."
  exit 1
fi

# load environment variables
if [ -f "$ENV_FILE" ]; then
  set -o allexport
  source "$ENV_FILE"
  set -o allexport
else
  echo "Environment file not found: $ENV_FILE"
  exit 1
fi

# remove existing container
docker stop node-express 2>/dev/null
docker rm node-express 2>/dev/null

# start new container
docker run -d \
    --name node-express \
    -v ${PWD}/docker/services/express:/app \
    -v express_node_modules:/app/node_modules \
    --env-file "$ENV_FILE" \
    -p 0:${PORT} \
    node-express:latest