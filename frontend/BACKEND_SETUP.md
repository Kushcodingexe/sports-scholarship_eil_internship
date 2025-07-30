# Backend Setup and Connection Guide

This document explains how to set up and connect the backend server for the Sports Scholarship application.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (local or Atlas cloud instance)

## Starting the Backend Server

### Option 1: Use the Startup Script

We've provided a convenient startup script that handles everything automatically:

```bash
./start-backend.sh
```

This script will:
1. Navigate to the backend directory
2. Install dependencies if needed
3. Start the server

### Option 2: Manual Setup

If you prefer to set up manually:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will start on port 7777 by default. You should see a message like:
```
Server running on port 7777
MongoDB Connected: ...
```

## Configuration

The backend server uses configuration settings from `backend/src/config/config.js`. You can modify these settings if needed:

- `PORT`: The port the server will run on (default: 7777)
- `MONGODB_URI`: The connection string for MongoDB
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRE`: Token expiration time

## Default User Accounts

The server automatically seeds the database with default users if none exist:

1. **Admin User**
   - Email: admin@example.com
   - Password: Password123!
   - Role: admin

2. **Regular User 1**
   - Email: john@example.com
   - Password: Password123!
   - Role: user

3. **Regular User 2**
   - Email: jane@example.com
   - Password: Password123!
   - Role: user

## API Endpoints

### Authentication

- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`
- **Get Current User**: `GET /api/auth/me`

### Applications

- **Get All Applications**: `GET /api/applications`
- **Create Application**: `POST /api/applications`
- **Get Single Application**: `GET /api/applications/:id`
- **Update Application**: `PUT /api/applications/:id`
- **Delete Application**: `DELETE /api/applications/:id`
- **Update Application Status**: `PUT /api/applications/:id/status`
- **Upload Documents**: `POST /api/applications/:id/documents`
- **Get Document**: `GET /api/applications/:id/documents/:docId`
- **Delete Document**: `DELETE /api/applications/:id/documents/:docId`

## Troubleshooting

### Server Won't Start

1. Check if the port is already in use:
   ```bash
   lsof -i :7777
   ```
   If something is using the port, either close that application or change the port in config.js

2. Check MongoDB connection:
   - Ensure MongoDB is running
   - Verify the connection string in config.js

3. Check for errors in the server logs

### API Connection Issues

1. Ensure the frontend API URL matches the backend server address:
   - The frontend applicationService and authService should point to http://localhost:7777

2. Check CORS settings if accessing from a different domain

3. Verify that the authentication token is properly set

### Admin Dashboard Not Showing Applications

1. Make sure you're logged in as an admin user
2. Check if there are any applications in the database
3. Verify that the backend server is running
4. Check browser console for any errors 