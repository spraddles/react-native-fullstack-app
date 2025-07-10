#!/bin/bash

if [ -f .env.dev ]; then
    export $(cat .env.dev | grep -v '^#' | xargs)
else
    echo "Error: .env.dev file not found"
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

supabase db reset \
    --dns-resolver=https \
    --db-url "postgresql://postgres.${EXPO_PUBLIC_SUPABASE_ID}:${ENCODED_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?connect_timeout=300"