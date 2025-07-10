#!/bin/bash

if [ -f .env.local ]; then
    source .env.local
else
    echo "Error: .env.local file not found"
    exit 1
fi

if [ -z "$EXPO_PUBLIC_APP_NAME" ]; then
    echo "Error: EXPO_PUBLIC_APP_NAME not found in .env file"
    exit 1
fi

export NODE_ENV=development

cd ios
pod install

# Return to root directory
cd ..

xcodebuild \
  -workspace ios/$EXPO_PUBLIC_APP_NAME.xcworkspace \
  -scheme $EXPO_PUBLIC_APP_NAME \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 16 pro' \
  -derivedDataPath ./ios/build/xcode \
  build

if [ $? -eq 0 ]; then
    echo "Build completed successfully"
else
    echo "Build failed"
    exit 1
fi