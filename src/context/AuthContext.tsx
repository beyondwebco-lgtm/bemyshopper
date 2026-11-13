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
      const profile = await convexLogin({ email, password });
      setUser(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      return { success: true };
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Invalid credentials';
      return { success: false, error };
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
      const error = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, error };
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

