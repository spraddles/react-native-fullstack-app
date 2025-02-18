#!/bin/bash

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

echo "Running Expo prebuild..."
NODE_ENV=development npx expo prebuild