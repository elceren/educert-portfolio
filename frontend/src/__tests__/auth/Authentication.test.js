import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import authService from '../../services/authService';

// Mock the auth service
jest.mock('../../services/authService');

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: { from: { pathname: '/' } } })
}));

// Helper function to render components with providers
const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          {component}
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

describe('Authentication Components', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Login Component', () => {
    test('renders login form correctly', () => {
      renderWithProviders(<Login />);
      
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    test('validates form inputs', async () => {
      renderWithProviders(<Login />);
      
      // Try to submit without filling in fields
      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
      
      // Check for validation messages
      await waitFor(() => {
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
    });

    test('handles successful login', async () => {
      // Mock successful login
      authService.login.mockResolvedValue({ success: true });
      
      renderWithProviders(<Login />);
      
      // Fill in form
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'password123' }
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
      
      // Check if login was called with correct parameters
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    test('handles login error', async () => {
      // Mock failed login
      authService.login.mockResolvedValue({ 
        success: false, 
        error: 'Invalid credentials' 
      });
      
      renderWithProviders(<Login />);
      
      // Fill in form
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: 'wrongpassword' }
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
      
      // Check if login was called
      await waitFor(() => {
        expect(authService.login).toHaveBeenCalled();
      });
    });
  });

  describe('Register Component', () => {
    test('renders registration form correctly', () => {
      renderWithProviders(<Register />);
      
      expect(screen.getByText('Create an Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/I am a/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    });

    test('validates form inputs', async () => {
      renderWithProviders(<Register />);
      
      // Try to submit without filling in fields
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      
      // Check for validation messages
      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
      });
    });

    test('validates password match', async () => {
      renderWithProviders(<Register />);
      
      // Fill in form with mismatched passwords
      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' }
      });
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: 'password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'password456' }
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      
      // Check for password match validation
      await waitFor(() => {
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
      });
    });

    test('handles successful registration', async () => {
      // Mock successful registration
      authService.register.mockResolvedValue({ success: true });
      
      renderWithProviders(<Register />);
      
      // Fill in form
      fireEvent.change(screen.getByLabelText(/Full Name/i), {
        target: { value: 'Test User' }
      });
      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/^Password/i), {
        target: { value: 'password123' }
      });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
        target: { value: 'password123' }
      });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      
      // Check if register was called with correct parameters
      await waitFor(() => {
        expect(authService.register).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          userType: 'Student'
        });
      });
    });
  });
});
