# Email Service Setup Guide

This application uses EmailJS to send emails directly from client-side JavaScript, which is ideal for applications that don't have a backend server.

## Setup Instructions

### 1. Create an EmailJS Account

1. Sign up for a free account at [EmailJS](https://www.emailjs.com/)
2. Verify your account

### 2. Create an Email Service

1. In the EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select your preferred email provider (Gmail, Outlook, etc.)
4. Follow the instructions to connect your email account

### 3. Create an Email Template

1. In the EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Design your email template with the following parameters:
   - `to_email` - recipient's email address
   - `to_name` - recipient's name
   - `subject` - email subject line
   - `message` - email content/body
   - `from_name` - sender's name

Example template:

```html
<!DOCTYPE html>
<html>
<head>
  <title>{{subject}}</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Hello {{to_name}},</h2>
    <div>
      {{{message}}}
    </div>
    <p style="margin-top: 30px;">
      Best regards,<br>
      {{from_name}}
    </p>
  </div>
</body>
</html>
```

### 4. Configure Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Replace the placeholder values with your actual EmailJS credentials:

- `your_service_id`: Found in the "Email Services" section
- `your_template_id`: Found in the "Email Templates" section
- `your_public_key`: Found in the "Account" section under "API Keys"

### 5. Restart Your Development Server

After setting up the environment variables, restart your development server for the changes to take effect.

## Testing

1. Log in to the application using an existing email
2. You should receive an OTP email at the specified address
3. The OTP will also be logged to the console during development

## Troubleshooting

- Check browser console for any errors
- Verify that your EmailJS account is active and within free tier limits (200 emails/month)
- Confirm that your email template contains all required parameters 