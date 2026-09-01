import React, { createContext, useState, useEffect, useCallback } from 'react';
import { storage } from '@/utils/storage';
import { authService, parentService, setAuthFailureCallback } from '@/services/api';
import { STORAGE_KEYS } from '@/constants/config';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          // Profile fetch failed, but keep authenticated - user can still navigate
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

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login(email, password);
      const data = response.data || response;

      await storage.setAccessToken(data.accessToken);
      await storage.setRefreshToken(data.refreshToken);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setIsAuthenticated(true);

      try {
        const profile = await parentService.getProfile();
        setUser(profile.data || profile);
      } catch {
        // Profile fetch failed
      }

      return { success: true };
    } catch (err) {
      const message = err.message || 'Login failed. Please try again.';
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.register(userData);
      const data = response.data || response;

      await storage.setAccessToken(data.accessToken);
      await storage.setRefreshToken(data.refreshToken);

      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setIsAuthenticated(true);

      try {
        const profile = await parentService.getProfile();
        setUser(profile.data || profile);
      } catch {
        // Profile fetch failed
      }

      return { success: true };
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      setError(message);
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

  const refreshSession = async () => {
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

  const value = {
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
