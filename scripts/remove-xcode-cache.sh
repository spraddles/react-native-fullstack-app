#!/bin/bash

# Get the path to CoreSimulator devices
SIMULATOR_PATH="$HOME/Library/Developer/CoreSimulator/Devices"

# Function to list all active simulators
list_active_simulators() {
    echo "Fetching list of active simulators..."
    xcrun simctl list devices | grep -E "Booted|Shutdown"
}

# Function to delete unavailable simulators
delete_unavailable_simulators() {
    echo "Deleting unavailable simulators..."
    xcrun simctl delete unavailable
    echo "Unavailable simulators deleted!"
}

# Function to interactively delete unused simulators
delete_unused_simulators() {
    echo "Fetching list of simulators..."
    xcrun simctl list devices > /tmp/simulator_list.txt

    echo -e "\nCurrent simulators:"
    cat /tmp/simulator_list.txt | grep "== Devices ==" -A 100 | grep -E "\(Booted\)|\(Shutdown\)"

    echo -e "\nScanning the simulator directories for unused files..."
    for dir in "$SIMULATOR_PATH"/*; do
        UUID=$(basename "$dir")

        # Check if UUID exists in the active simulator list
        if ! grep -q "$UUID" /tmp/simulator_list.txt; then
            echo "Simulator directory not recognized: $dir"

            # Prompt to delete
            read -p "Do you want to delete this simulator folder? [y/N]: " confirm
            if [[ "$confirm" =~ ^[Yy]$ ]]; then
                echo "Deleting $dir..."
                rm -rf "$dir"
                echo "$dir deleted."
            else
                echo "Skipping $dir."
            fi
        fi
    done

    echo "Simulator cleanup complete."
}

# Main menu
echo "iOS Simulator Cleanup Script"
echo "============================="
echo "1. List active and shutdown simulators"
echo "2. Delete unavailable simulators"
echo "3. Interactively delete unused simulators"
echo "4. Exit"
echo "============================="
read -p "Choose an option: " option

case $option in
1)
    list_active_simulators
    ;;
2)
    delete_unavailable_simulators
    ;;
3)
    delete_unused_simulators
    ;;
4)
    echo "Exiting script."
    exit 0
    ;;
*)
    echo "Invalid option selected."
    ;;
esac
