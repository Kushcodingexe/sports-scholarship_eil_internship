#!/bin/bash

# Script to start both frontend and backend servers for development

echo "Starting Sports Scholarship Application (Frontend & Backend)"
echo "==============================================="

# Check if we have terminals
if command -v gnome-terminal &> /dev/null; then
    # On Linux with gnome-terminal
    echo "Starting backend server in a new terminal..."
    gnome-terminal -- bash -c "cd $(dirname "$0")/backend && npm start; exec bash"
    
    echo "Starting frontend server in this terminal..."
    cd "$(dirname "$0")"
    npm run dev
elif command -v xterm &> /dev/null; then
    # On Linux with xterm
    echo "Starting backend server in a new terminal..."
    xterm -e "cd $(dirname "$0")/backend && npm start" &
    
    echo "Starting frontend server in this terminal..."
    cd "$(dirname "$0")"
    npm run dev
elif command -v open &> /dev/null && [[ "$OSTYPE" == "darwin"* ]]; then
    # On macOS
    echo "Starting backend server in a new terminal..."
    open -a Terminal.app "$(dirname "$0")/backend/start-backend.command"
    
    echo "Starting frontend server in this terminal..."
    cd "$(dirname "$0")"
    npm run dev
else
    # No suitable terminal found, run in background
    echo "Starting backend server in the background..."
    (cd "$(dirname "$0")/backend" && npm start &)
    
    echo "Starting frontend server..."
    cd "$(dirname "$0")"
    npm run dev
fi 