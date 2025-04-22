import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatError, logError } from '../utils/errorHandler';
import authService from '../services/authService';

// Create context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => useContext(NotificationContext);

// Notification types
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Add a new notification
  const addNotification = (message, type = NotificationType.INFO, duration = 5000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    
    const newNotification = {
      id,
      message,
      type,
      duration,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    setNotificationCount(prev => prev + 1);
    
    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  // Helper methods for different notification types
  const success = (message, duration = 5000) => {
    return addNotification(message, NotificationType.SUCCESS, duration);
  };
  
  const error = (errorObj, duration = 8000) => {
    // Format error if it's an object
    const formattedError = typeof errorObj === 'object' 
      ? formatError(errorObj)
      : { message: errorObj };
    
    // Log error for debugging
    logError(formattedError, 'notification');
    
    return addNotification(formattedError.message, NotificationType.ERROR, duration);
  };
  
  const warning = (message, duration = 7000) => {
    return addNotification(message, NotificationType.WARNING, duration);
  };
  
  const info = (message, duration = 5000) => {
    return addNotification(message, NotificationType.INFO, duration);
  };
  
  // Fetch user notifications from backend
  const fetchUserNotifications = async () => {
    try {
      // This would be implemented to fetch notifications from the backend
      // const response = await notificationService.getUserNotifications();
      // Process and add notifications
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };
  
  // Context value
  const value = {
    notifications,
    notificationCount,
    addNotification,
    removeNotification,
    clearNotifications,
    success,
    error,
    warning,
    info,
    fetchUserNotifications
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
