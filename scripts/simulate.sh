echo "Opening simulator..."
open -a Simulator

# Wait for a device to be booted
echo "Waiting for simulator to boot..."
while ! xcrun simctl list devices | grep -q "Booted"; do
    sleep 1
done
echo "Simulator is ready"

# Install the app and wait for completion
echo "Installing app..."
if xcrun simctl install booted ./ios/build/xcode/Build/Products/Debug-iphonesimulator/GlobalPay.app; then
    echo "App installed successfully"
else
    echo "Failed to install app"
    exit 1
fi

# Launch the app and wait for completion
echo "Launching app..."
if xcrun simctl launch booted com.anonymous.GlobalPay; then
    echo "App launched successfully"
else
    echo "Failed to launch app"
    exit 1
fi