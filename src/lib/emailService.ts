// Email Service for sending emails (using EmailJS)
// This provides a client-side email sending solution using EmailJS

import emailjs from '@emailjs/browser';

interface EmailParams {
  to_email: string;
  to_name?: string;
  subject: string;
  message: string;
  from_name?: string;
}

class EmailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private initialized: boolean = false;

  constructor() {
    // These values should be set from environment variables in a real app
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
    
    // Check if we have the required configuration
    this.initialized = !!(this.serviceId && this.templateId && this.publicKey);
    
    if (this.initialized) {
      emailjs.init(this.publicKey);
    } else {
      console.warn('EmailService not properly configured. Please set the required environment variables.');
    }
  }

  /**
   * Send an email using EmailJS
   * @param params Email parameters including recipient, subject, and message
   * @returns Promise resolving to success status and any error
   */
  async sendEmail(params: EmailParams): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      console.warn('EmailService not initialized. Email will not be sent.');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    try {
      const templateParams = {
        to_email: params.to_email,
        to_name: params.to_name || params.to_email,
        subject: params.subject,
        message: params.message,
        from_name: params.from_name || 'EIL Scholar Admin'
      };

      await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to send email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending email'
      };
    }
  }

  /**
   * Send an OTP verification email
   * @param email Recipient email
   * @param otp One-time password
   * @returns Promise resolving to success status and any error
   */
  async sendOTPEmail(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const subject = 'Your EIL Scholar Verification Code';
    const message = `
      Your verification code is: <strong>${otp}</strong>
      <br><br>
      This code will expire in 5 minutes.
      <br><br>
      If you did not request this code, please ignore this email.
    `;

    return this.sendEmail({
      to_email: email,
      subject,
      message
    });
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService; 