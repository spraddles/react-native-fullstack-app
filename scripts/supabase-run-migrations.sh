#!/bin/bash

# Check if environment parameter is provided
if [ -z "$1" ]; then
    echo "Error: Environment parameter not specified. Please use 'dev' or 'prod'"
    exit 1
fi

# Set environment based on parameter
ENV=$1

if [ "$ENV" == "dev" ]; then
    ENV_FILE=".env.dev"
elif [ "$ENV" == "prod" ]; then
    ENV_FILE=".env.prod"
else
    echo "Error: Unknown environment '$ENV'. Please use 'dev' or 'prod'"
    exit 1
fi

echo "Using $ENV environment: $ENV_FILE"

if [ -f $ENV_FILE ]; then
    export $(cat $ENV_FILE | grep -v '^#' | xargs)
else
    echo "Error: $ENV_FILE file not found"
    exit 1
fi

if [ -z "$SUPABASE_DB_PASSWORD" ]; then
    echo "Error: SUPABASE_DB_PASSWORD environment variable is not set"
    exit 1
fi

if [ -z "$EXPO_PUBLIC_SUPABASE_ID" ]; then
    echo "Error: EXPO_PUBLIC_SUPABASE_ID environment variable is not set"
    exit 1
fi

ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$SUPABASE_DB_PASSWORD', safe=''))")

supabase db push \
    --dns-resolver=https \
    --db-url "postgresql://postgres.${EXPO_PUBLIC_SUPABASE_ID}:${ENCODED_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?connect_timeout=300"