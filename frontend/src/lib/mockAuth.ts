// Mock authentication for demo purposes
// This replaces Supabase with local authentication

export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    first_name: string;
    last_name: string;
    college: string;
    engineering_field: string;
    phone: string;
  };
  created_at: string;
}

export interface AuthResponse {
  success: boolean;
  user?: MockUser;
  error?: string;
}

// Demo users
const DEMO_USERS = [
  {
    id: "admin-1",
    email: "shreyans.jaiswal704@gmail.com",
    password: "Shreyans123",
    user_metadata: {
      first_name: "Shreyans",
      last_name: "Jaiswal",
      college: "IIT Delhi",
      engineering_field: "Computer Science",
      phone: "+91 9876543210",
    },
    created_at: new Date().toISOString(),
    role: "admin",
  },
  {
    id: "user-1",
    email: "shreyansjaiswal2005@gmail.com",
    password: "jaiswal12345",
    user_metadata: {
      first_name: "Shreyans",
      last_name: "Jaiswal",
      college: "NIT Trichy",
      engineering_field: "Mechanical Engineering",
      phone: "+91 9876543211",
    },
    created_at: new Date().toISOString(),
    role: "user",
  },
];

export class MockAuthService {
  // Sign in with email/password
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = DEMO_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Store user in localStorage for persistence
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem("mockUser", JSON.stringify(userWithoutPassword));

    return {
      success: true,
      user: userWithoutPassword,
    };
  }

  // Sign up new user
  static async signUp(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    college: string;
    engineeringField: string;
    phone: string;
  }): Promise<AuthResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists
    const existingUser = DEMO_USERS.find((u) => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Validate password
    if (data.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

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

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        college: data.college,
        engineering_field: data.engineeringField,
        phone: data.phone,
      },
      created_at: new Date().toISOString(),
      role: "user",
    };

    // Store user in localStorage
    localStorage.setItem("mockUser", JSON.stringify(newUser));

    return {
      success: true,
      user: newUser,
    };
  }

  // Sign out
  static async signOut(): Promise<void> {
    localStorage.removeItem("mockUser");
  }

  // Get current user
  static getCurrentUser(): MockUser | null {
    const userData = localStorage.getItem("mockUser");
    return userData ? JSON.parse(userData) : null;
  }

  // Check if user is admin
  static isAdmin(user: MockUser | null): boolean {
    if (!user) return false;
    return user.email === "shreyans.jaiswal704@gmail.com";
  }
}

