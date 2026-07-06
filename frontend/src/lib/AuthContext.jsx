import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth as authApi } from '@/api/entityApi';
import { setToken, getToken, clearToken } from '@/api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setIsLoadingAuth(false);
      setAuthChecked(true);
      return;
    }
    try {
      const currentUser = await authApi.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (e) {
      console.error('Auth check failed:', e);
      clearToken();
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    const result = await authApi.login(email, password);
    setToken(result.access_token);
    const currentUser = await authApi.me();
    setUser(currentUser);
    setIsAuthenticated(true);
    return currentUser;
  };

  const register = async (email, password) => {
    const newUser = await authApi.register(email, password);
    // After registration, login to get a token
    const result = await authApi.login(email, password);
    setToken(result.access_token);
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authChecked,
      login,
      register,
      logout,
      checkAuth,
    }}>
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
