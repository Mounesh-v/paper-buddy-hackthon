import React, { createContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { storage } from '@/utils/storage';
import { authService, parentService, setAuthFailureCallback } from '@/services/api';
import { STORAGE_KEYS } from '@/constants/config';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { name: string; email: string; password: string; phoneNumber?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearAuth: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const clearAuth = useCallback(async () => {
    await storage.clearAuth();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    setAuthFailureCallback(() => {
      clearAuth();
    });
    return () => setAuthFailureCallback(null);
  }, [clearAuth]);

  const loadSession = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const storedAccessToken = await storage.getAccessToken();
      const storedRefreshToken = await storage.getRefreshToken();

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);

        try {
          const profile = await parentService.getProfile();
          setUser(profile.data || profile);
        } catch {
          await clearAuth();
        }
      }
    } catch {
      await clearAuth();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login(email, password);
      const data = response.data || response;

      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Invalid response from server');
      }

      await storage.setAccessToken(data.accessToken);
      await storage.setRefreshToken(data.refreshToken);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setIsAuthenticated(true);

      try {
        const profile = await parentService.getProfile();
        setUser(profile.data || profile);
      } catch {
        // Profile fetch failed but keep auth state
      }

      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Login failed. Please try again.';
      setError(message);
      await clearAuth();
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; phoneNumber?: string }) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.register(userData);
      const data = response.data || response;

      if (!data.accessToken || !data.refreshToken) {
        throw new Error('Invalid response from server');
      }

      await storage.setAccessToken(data.accessToken);
      await storage.setRefreshToken(data.refreshToken);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setIsAuthenticated(true);

      try {
        const profile = await parentService.getProfile();
        setUser(profile.data || profile);
      } catch {
        // Profile fetch failed but keep auth state
      }

      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
      await clearAuth();
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      await clearAuth();
    }
  };

  const refreshSession = async (): Promise<boolean> => {
    try {
      if (!refreshToken) return false;

      const response = await authService.refreshToken(refreshToken);
      const data = response.data || response;

      await storage.setAccessToken(data.accessToken);
      await storage.setRefreshToken(data.refreshToken || refreshToken);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken || refreshToken);

      return true;
    } catch {
      await clearAuth();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearAuth,
    refreshSession,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
