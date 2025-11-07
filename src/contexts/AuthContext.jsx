import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = apiClient.getToken();
        const savedUser = localStorage.getItem('currentUser');
        
        if (token && savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to restore auth state:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @param {string} [userData.role] - User role (user or admin)
   * @param {string} [userData.verificationCode] - Admin verification code
   */
  const register = async (userData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.post(API_ENDPOINTS.REGISTER, {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role || 'user',
        ...(userData.verificationCode && { verificationCode: userData.verificationCode })
      });

      // Store token and user data
      apiClient.setToken(response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   */
  const login = async (credentials) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        email: credentials.email,
        password: credentials.password
      });

      // Store token and user data
      apiClient.setToken(response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    apiClient.removeToken();
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  /**
   * Check if verification code is valid
   * @param {string} code - Verification code to check
   */
  const checkVerificationCode = async (code) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHECK_VERIFICATION(code));
      return response;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  /**
   * Clear error
   */
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkVerificationCode,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
