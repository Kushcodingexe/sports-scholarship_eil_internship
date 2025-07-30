# Admin Dashboard Guide

This document explains how to access and use the Simple Admin Dashboard for the Sports Scholarship application.

## Accessing the Admin Dashboard

1. Start the backend server (see [Backend Setup](./BACKEND_SETUP.md) for instructions)
2. Start the frontend application: 
   ```bash
   npm run dev
   ```
3. Navigate to the admin dashboard at: http://localhost:5173/admin
4. Log in with admin credentials:
   - Email: admin@example.com
   - Password: Password123!

## Dashboard Features

### Viewing Applications

The Simple Admin Dashboard displays all applications from the MongoDB database in a clear, tabular format. For each application, you can see:

- Application ID
- Applicant Name
- Sport
- Current Status

### Managing Applications

As an admin, you can:

1. **View Application Details**
   - Click the "View Details" button next to any application
   - This expands a detailed view showing:
     - Applicant information (name, email, mobile, field)
     - Sports details (sport type, position, tournament date)
     - Previous comments and status changes

2. **Approve Applications**
   - Click the "Approve" button next to an application
   - Add approval comments in the dialog (required)
   - Submit to update the application status
   - The status will change to "Approved" and your comment will be saved
   - You cannot approve an already approved application

3. **Reject Applications**
   - Click the "Reject" button next to an application
   - Provide rejection reasons in the dialog (required)
   - Submit to update the application status
   - The status will change to "Rejected" and your comment will be saved
   - You cannot reject an already rejected application

4. **Refresh Applications**
   - Click the "Refresh" button at the top of the applications list
   - This will fetch the latest applications from the database

## Application Statuses

Applications can have one of the following statuses:

- **Pending**: New application that has not been reviewed
- **Under Review**: Application is being reviewed by admins
- **Approved**: Application has been approved
- **Rejected**: Application has been rejected

Each status is color-coded for easy identification in the dashboard.

## Working with Comments

When you approve or reject an application, your comments are saved and displayed in the application details view. Comments include:

- The content of your comment
- The date and time the comment was made
- The action type (approve, reject, or comment)

This helps maintain a record of all decisions made for each application.

## Troubleshooting

### No Applications Displayed

If no applications are displayed in the dashboard:

1. Verify that the backend server is running
2. Check that you're logged in as an admin user
3. Make sure applications exist in the database

If the backend server is not running, the dashboard will display an error message with instructions on how to start the server.

### Authentication Issues

If you cannot log in as an admin:

1. Verify that you're using the correct credentials
2. Check that the backend server is running properly
3. Ensure the authentication service is correctly configured

## Adding Test Applications

To add test applications to the database:

1. Register as a regular user 
2. Submit applications through the user interface
3. Or use the seed script to populate the database with sample applications:
   ```bash
   cd backend
   node src/seed-applications.js
   ```

This seed script will:
- Create default user accounts if they don't exist
- Create multiple sample applications with various statuses
- Associate the applications with the regular user accounts 