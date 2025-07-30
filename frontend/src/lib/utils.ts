import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debug and fix admin role issues
 * This function checks the current user in localStorage and ensures the role is properly set
 * For development/debugging purposes only
 */
export function debugUserRole() {
  try {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (!storedUser) {
      console.log('No user found in localStorage');
      return { fixed: false, message: 'No user found' };
    }

    const user = JSON.parse(storedUser);
    console.log('Current user from localStorage:', user);

    if (!user.role) {
      console.log('User has no role, adding admin role');
      user.role = 'admin';
      localStorage.setItem('auth_user', JSON.stringify(user));
      return { fixed: true, message: 'Added admin role to user' };
    }

    if (user.role !== 'admin') {
      console.log('User role is not admin, updating to admin');
      user.role = 'admin';
      localStorage.setItem('auth_user', JSON.stringify(user));
      return { fixed: true, message: 'Updated user role to admin' };
    }

    return { fixed: false, message: 'User already has admin role' };
  } catch (error) {
    console.error('Error in debugUserRole:', error);
    return { fixed: false, message: 'Error processing user data' };
  }
}
