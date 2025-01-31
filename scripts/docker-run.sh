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
    -p 0:${EXPRESS_PORT} \
    node-express:latest
