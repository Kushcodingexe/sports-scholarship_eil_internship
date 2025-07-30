import { supabase } from "./supabase"; // your local client
import type { User } from "@supabase/supabase-js";

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  college: string;
  engineeringField: string;
  phone: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}


// Supabase uses bcrypt internally for password hashing
// This provides the same security as implementing bcrypt ourselves
export class AuthService {
  // Sign up new user with secure password hashing
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Validate password strength
      if (data.password.length < 8) {
        return {
          success: false,
          error: "Password must be at least 8 characters long",
        };
      }

      // Check for strong password
      const hasUpperCase = /[A-Z]/.test(data.password);
      const hasLowerCase = /[a-z]/.test(data.password);
      const hasNumbers = /\d/.test(data.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.password);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return {
          success: false,
          error:
            "Password must contain uppercase, lowercase, number, and special character",
        };
      }

      // Supabase handles bcrypt hashing automatically
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password, // This gets hashed with bcrypt by Supabase
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            college: data.college,
            engineering_field: data.engineeringField,
            phone: data.phone,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Create user profile in our custom table
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          college: data.college,
          engineering_field: data.engineeringField,
          phone: data.phone,
        });

        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      return {
        success: true,
        user: authData.user,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  // Sign in user with bcrypt password verification
  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      // Supabase automatically verifies hashed password with bcrypt
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password, // Compared against bcrypt hash
      });

      if (error) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      return {
        success: true,
        user: authData.user,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  // Sign out user
  static async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  // Reset password
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }

  // Update password (also uses bcrypt hashing)
  static async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword, // Gets hashed with bcrypt
      });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "An unexpected error occurred",
      };
    }
  }
}

// Demo implementation showing how bcrypt would work in Node.js backend
// This is for educational purposes - Supabase handles this internally
export const bcryptExample = `
// In a Node.js backend, you would use bcrypt like this:
import bcrypt from 'bcrypt'

// Hash password during registration
const saltRounds = 12 // Higher = more secure but slower
const hashedPassword = await bcrypt.hash(password, saltRounds)

// Store hashedPassword in database, never store plain password

// Verify password during login
const isValidPassword = await bcrypt.compare(password, hashedPassword)

// Example hashed password:
// Plain: "MySecurePassword123!"
// Hashed: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewT3qHSEuBUjI2Ki"
`;
