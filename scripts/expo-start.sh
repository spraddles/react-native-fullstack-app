#!/bin/bash

# Check if .env.dev exists
if [ ! -f "./.env.dev" ]; then
    echo "ERROR: .env.dev file not found!"
    exit 1
fi

export NODE_ENV=development

echo "Loading variables from .env.dev..."
set -a
source .env.dev
set +a

echo "Starting Expo..."
npx expo start