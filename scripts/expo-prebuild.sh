#!/bin/bash

# Check if .env.local exists
if [ ! -f "./.env.local" ]; then
    echo "ERROR: .env.local file not found!"
    exit 1
fi

if [ -d "./.expo" ]; then
    echo "Removing Expo directory..."
    rm -rf ./.expo
fi

if [ -d "./ios" ]; then
    echo "Removing iOS directory..."
    rm -rf ./ios
fi

if [ -d "./android" ]; then
    echo "Removing Android directory..."
    rm -rf ./android
fi

echo "Loading variables from .env.local..."
set -a
source .env.local
set +a

echo "Running Expo prebuild..."
npx expo prebuild --clean