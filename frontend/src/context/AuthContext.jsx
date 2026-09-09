import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS, loginWithRole } from '../api/authApi';
import { parseJwt } from '../utils/jwtHelper';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return DEMO_USERS.STUDENT; // Default to student persona if not logged in
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const loginRole = async (roleKey) => {
    setLoading(true);
    try {
      const res = await loginWithRole(roleKey);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  const loginCustom = (jwtToken) => {
    const parsed = parseJwt(jwtToken);
    if (!parsed) {
      throw new Error('Invalid JWT format');
    }
    const customUser = {
      userId: parsed.sub,
      username: parsed.username || 'custom_user',
      name: parsed.username || 'Authenticated User',
      role: parsed.role || 'ROLE_STUDENT',
      schoolId: parsed.schoolId,
      sectionId: parsed.sectionId,
      gradeId: parsed.gradeId,
      academicYearId: parsed.academicYearId,
    };

    setToken(jwtToken);
    setUser(customUser);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(customUser));
    return customUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const role = user?.role || 'ROLE_STUDENT';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        isAuthenticated: !!user,
        loading,
        loginRole,
        loginCustom,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
