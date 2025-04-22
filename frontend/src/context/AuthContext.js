import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired, log out
            logout();
          } else {
            // Token valid, set user
            setUser({
              id: decodedToken.id,
              email: decodedToken.email,
              userType: decodedToken.userType
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        const decodedToken = jwt_decode(response.token);
        setUser({
          id: decodedToken.id,
          email: decodedToken.email,
          userType: decodedToken.userType,
          name: response.user.name
        });
        
        setIsAuthenticated(true);
        
        // Redirect based on user type
        if (decodedToken.userType === 'Student') {
          navigate('/student/dashboard');
        } else if (decodedToken.userType === 'Instructor') {
          navigate('/instructor/dashboard');
        } else if (decodedToken.userType === 'Administrator') {
          navigate('/admin/dashboard');
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        const decodedToken = jwt_decode(response.token);
        setUser({
          id: decodedToken.id,
          email: decodedToken.email,
          userType: decodedToken.userType,
          name: response.user.name
        });
        
        setIsAuthenticated(true);
        
        // Redirect based on user type
        if (decodedToken.userType === 'Student') {
          navigate('/student/dashboard');
        } else if (decodedToken.userType === 'Instructor') {
          navigate('/instructor/dashboard');
        } else if (decodedToken.userType === 'Administrator') {
          navigate('/admin/dashboard');
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.updateProfile(user.id, userData);
      
      if (response.success) {
        // Update user data if needed
        setUser({
          ...user,
          name: userData.name || user.name
        });
        
        return { success: true };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
