#!/bin/bash

if [ -f .env.dev ]; then
    source .env.dev
else
    echo "Error: .env.dev file not found"
    exit 1
fi

if [ -z "$EXPO_PUBLIC_APP_NAME" ]; then
    echo "Error: EXPO_PUBLIC_APP_NAME not found in .env.dev file"
    exit 1
fi

export NODE_ENV=development

echo "Opening simulator..."
open -a Simulator

echo "Waiting for simulator to boot..."
while ! xcrun simctl list devices | grep -q "Booted"; do
    sleep 1
done
echo "Simulator is ready"

echo "Installing app..."
if xcrun simctl install booted ./ios/build/xcode/Build/Products/Debug-iphonesimulator/$EXPO_PUBLIC_APP_NAME.app; then
    echo "App installed successfully"
else
    echo "Failed to install app"
    exit 1
fi

echo "Launching app..."
if xcrun simctl launch booted com.anonymous.$EXPO_PUBLIC_APP_NAME; then
    echo "App launched successfully"
else
    echo "Failed to launch app"
    exit 1
fi