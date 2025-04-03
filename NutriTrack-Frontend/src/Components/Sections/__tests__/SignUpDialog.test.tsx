import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpDialog from '../Authentication/SignUpDialog'; // Adjust path as needed
import axiosInstance from '../../../utils/axiosInstance';
import axios, { AxiosError } from 'axios';
import { useToast } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('../../../utils/axiosInstance', () => ({
  post: jest.fn(),
}));

jest.mock('axios', () => ({
  post: jest.fn(),
}));

jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: jest.fn(),
  };
});

jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: jest.fn(),
}));

jest.mock('zxcvbn', () => ({
  __esModule: true,
  default: jest.fn((password) => ({
    score: password.length > 12 ? 4 : password.length > 8 ? 3 : password.length > 6 ? 2 : password.length > 4 ? 1 : 0,
  })),
}));

describe('SignUpDialog', () => {
  const mockOnClose = jest.fn();
  const mockOpenSignIn = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue(mockToast);
    (useGoogleLogin as jest.Mock).mockReturnValue(jest.fn());
  });

  test('does not render when open is false', () => {
    const { container } = render(
      <SignUpDialog open={false} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders correctly when open is true', () => {
    render(
      <SignUpDialog open={true} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up with email' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up with Google' })).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('handles successful email signup', async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { message: 'User registered' },
    });

    render(
      <SignUpDialog open={true} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up with email' }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Registration Successful!',
        description: 'Your account has been created successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('handles email signup error', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    } as AxiosError);

    render(
      <SignUpDialog open={true} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    
    fireEvent.change(screen.getByPlaceholderText('your@email.com'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up with email' }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Registration Failed',
        description: 'Email already exists',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    });
  });

  test('handles successful Google signup', async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { message: 'Google signup successful' },
    });

    (useGoogleLogin as jest.Mock).mockImplementation(({ onSuccess }) => () => {
      onSuccess({ access_token: 'google-token' });
    });

    render(
      <SignUpDialog open={true} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    
    fireEvent.click(screen.getByRole('button', { name: 'Sign up with Google' }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/google/signup', {
        access_token: 'google-token',
      });
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Sign-Up Successful!',
        description: 'Your account has been created using Google.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('toggles password visibility', () => {
    render(
      <SignUpDialog open={true} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');
    const [togglePasswordButton, toggleConfirmPasswordButton] = screen.getAllByRole('button', { name: '' });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleConfirmPasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });
  
  test('opens sign in dialog', () => {
    render(
      <SignUpDialog open={true} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    
    fireEvent.click(screen.getByText('Sign in'));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOpenSignIn).toHaveBeenCalled();
  });

  test('closes modal when close button is clicked', () => {
    render(
      <SignUpDialog open={true} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
    );
    
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});