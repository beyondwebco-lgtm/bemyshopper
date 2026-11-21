'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

export interface UserProfile {
  id: Id<'users'>;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  address?: string;
}

// Clean and minimal auth error formatter
export function cleanAuthErrorMessage(err: unknown): string {
  if (!err) return 'Invalid email or password. Please try again.';
  const raw = err instanceof Error ? err.message : String(err);

  // Incorrect password
  if (/incorrect password|password.*incorrect|wrong password/i.test(raw)) {
    return 'Incorrect password. Please try again.';
  }

  // Account not found
  if (/no account found|account not found|not registered|please sign up/i.test(raw)) {
    return 'No account found with this email. Please check your spelling or create an account.';
  }

  // Blocked / suspended
  if (/suspended|blocked/i.test(raw)) {
    return 'Your account has been suspended. Please contact store support.';
  }

  // Account already exists
  if (/already exists/i.test(raw)) {
    return 'An account with this email already exists. Please sign in.';
  }

  // Password too short
  if (/least 6 characters/i.test(raw)) {
    return 'Password must be at least 6 characters.';
  }

  // Access denied
  if (/access denied/i.test(raw)) {
    return 'Access Denied: Only Store Administrator has access.';
  }

  // Extract inner message if clean
  const match = raw.match(/(?:Uncaught Error|Server Error|Error):\s*([^\n\r]+)/i);
  if (match && match[1]) {
    const extracted = match[1]
      .replace(/at\s+handler.*$/i, '')
      .replace(/Called by client.*$/i, '')
      .replace(/\[.*?\]/g, '')
      .trim();
    if (extracted && extracted.length > 3 && extracted.length < 120 && !extracted.includes('CONVEX')) {
      return extracted;
    }
  }

  // Minimal clean fallback
  return 'Incorrect email or password. Please try again.';
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: 'admin' | 'user';
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'bemyshopper_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const convexLogin = useMutation(api.users.login);
  const convexRegister = useMutation(api.users.register);

  // Restore user session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // Ignore local storage parse error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      let device = 'Web Browser';
      if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent;
        if (/mobile/i.test(ua)) {
          device = 'Mobile Device';
        } else if (/mac/i.test(ua)) {
          device = 'Mac Desktop';
        } else if (/win/i.test(ua)) {
          device = 'Windows PC';
        } else {
          device = 'Desktop Browser';
        }
      }
      const profile = await convexLogin({ email, password, device });
      setUser(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: cleanAuthErrorMessage(err) };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: 'admin' | 'user';
  }) => {
    try {
      const profile = await convexRegister(data);
      setUser(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: cleanAuthErrorMessage(err) };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
