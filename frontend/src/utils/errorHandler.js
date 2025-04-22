/**
 * Global error handling utility for the EduCert platform
 * This utility provides standardized error handling across the application
 */

// Error types
export const ErrorTypes = {
  AUTH_ERROR: 'auth_error',
  NETWORK_ERROR: 'network_error',
  VALIDATION_ERROR: 'validation_error',
  SERVER_ERROR: 'server_error',
  NOT_FOUND: 'not_found',
  UNKNOWN_ERROR: 'unknown_error'
};

/**
 * Format error response from API for consistent display
 * @param {Object} error - Error object from API call
 * @returns {Object} Formatted error object
 */
export const formatError = (error) => {
  // Default error structure
  const formattedError = {
    type: ErrorTypes.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again.',
    details: null,
    status: null
  };

  // No error object
  if (!error) {
    return formattedError;
  }

  // Network error
  if (error.message === 'Network Error') {
    return {
      ...formattedError,
      type: ErrorTypes.NETWORK_ERROR,
      message: 'Unable to connect to the server. Please check your internet connection.'
    };
  }

  // Error with response from server
  if (error.status) {
    formattedError.status = error.status;
    
    switch (error.status) {
      case 400:
        return {
          ...formattedError,
          type: ErrorTypes.VALIDATION_ERROR,
          message: error.message || 'Invalid request. Please check your input.',
          details: error.data?.errors
        };
      case 401:
        return {
          ...formattedError,
          type: ErrorTypes.AUTH_ERROR,
          message: 'Authentication failed. Please log in again.'
        };
      case 403:
        return {
          ...formattedError,
          type: ErrorTypes.AUTH_ERROR,
          message: 'You do not have permission to perform this action.'
        };
      case 404:
        return {
          ...formattedError,
          type: ErrorTypes.NOT_FOUND,
          message: error.message || 'The requested resource was not found.'
        };
      case 500:
      case 502:
      case 503:
        return {
          ...formattedError,
          type: ErrorTypes.SERVER_ERROR,
          message: 'Server error. Please try again later.'
        };
      default:
        return {
          ...formattedError,
          message: error.message || formattedError.message
        };
    }
  }

  // If error has a message but no status
  if (error.message) {
    return {
      ...formattedError,
      message: error.message
    };
  }

  return formattedError;
};

/**
 * Log error to console for debugging
 * In a production environment, this could be extended to log to a monitoring service
 * @param {Object} error - Error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = 'general') => {
  console.error(`Error in ${context}:`, error);
  
  // In a production app, you would add additional logging here
  // Example: send error to monitoring service
};

export default {
  ErrorTypes,
  formatError,
  logError
};
