#!/bin/bash

# Script to start the backend server for the Sports Scholarship application

echo "Starting Sports Scholarship Backend Server..."

# Navigate to the backend directory
cd "$(dirname "$0")/backend"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js to run the server."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm to run the server."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the server
echo "Starting the server..."
npm start 