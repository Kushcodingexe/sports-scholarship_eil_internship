#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Starting EIL Sports Scholarship Application ===${NC}"

# Check if MongoDB is running
echo -e "${BLUE}Checking if MongoDB is running...${NC}"
if mongo --eval "db.version()" >/dev/null 2>&1; then
  echo -e "${GREEN}MongoDB is running.${NC}"
else
  echo -e "${YELLOW}MongoDB is not running. Starting MongoDB...${NC}"
  sudo systemctl start mongod || echo -e "${YELLOW}Couldn't start MongoDB. Please start it manually.${NC}"
fi

# Start backend server in a new terminal
echo -e "${BLUE}Starting backend server...${NC}"
cd backend
gnome-terminal -- bash -c "echo -e '${GREEN}=== Backend Server ===${NC}'; npm start; exec bash" &
echo -e "${GREEN}Backend server started in a new terminal.${NC}"

# Wait a bit for backend to start
sleep 3

# Start frontend development server
echo -e "${BLUE}Starting frontend development server...${NC}"
cd ..
echo -e "${GREEN}=== Frontend Development Server ===${NC}"
npm run dev

# This script will keep running with the frontend process
# The backend process runs in its own terminal window 