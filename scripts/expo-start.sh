#!/bin/bash

# Check if .env.local exists
if [ ! -f "./.env.local" ]; then
    echo "ERROR: .env.local file not found!"
    exit 1
fi

export NODE_ENV=development

echo "Loading variables from .env.local..."
set -a
source .env.local
set +a

echo "Starting Expo..."
npx expo start