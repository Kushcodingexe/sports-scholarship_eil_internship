# Sports Scholarship Application

This application allows engineering students to apply for sports scholarships, and provides an admin interface for reviewing and managing applications.

## Project Structure

- `backend/` - Node.js/Express backend with MongoDB database
- `src/` - Frontend React application
- `public/` - Static assets

## Setup Instructions

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Start the Backend Server

Option 1: Use the convenience script:
```bash
./start-backend.sh
```

Option 2: Start manually:
```bash
cd backend
npm start
```

The backend server will run on http://localhost:7777.

### 3. Start the Frontend Application

```bash
npm run dev
```

The frontend application will run on http://localhost:5173.

## Admin Dashboard

To access the admin dashboard:

1. Ensure the backend server is running
2. Navigate to http://localhost:5173/admin
3. Log in with the admin credentials:
   - Email: admin@example.com
   - Password: Password123!

See [Admin Dashboard Guide](./ADMIN_DASHBOARD.md) for more information.

## Backend API

The backend provides REST API endpoints for authentication and application management. 

See [Backend Setup](./BACKEND_SETUP.md) for more information on the backend configuration and API endpoints.

## Seeding the Database

To populate the database with sample data:

```bash
cd backend
node src/seed-applications.js
```

This will create sample users and applications for testing.

## Documentation

- [Admin Dashboard Guide](./ADMIN_DASHBOARD.md) - Instructions for using the admin dashboard
- [Backend Setup](./BACKEND_SETUP.md) - Backend configuration and API documentation

