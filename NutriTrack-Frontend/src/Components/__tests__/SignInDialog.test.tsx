import { SignInDialog } from "../Sections";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import fetchMock from 'jest-fetch-mock';
import { ChakraProvider } from '@chakra-ui/react';
import axiosInstance from "../../utils/axiosInstance.ts"; 
jest.mock("../../utils/axiosInstance.ts", () => ({
    post: jest.fn(),
  }));
  
describe('SignInDialog', () => {
  const mockOnClose = jest.fn();
  const mockOpenSignUp = jest.fn();
  const mockSetLoggedUser = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.clear();
    jest.clearAllMocks(); // Clears all mock function calls
  });

  function renderComponent(open = true) {
    return render(
      <MemoryRouter>
        <UserContext.Provider
          value={{
            loggedUser: { 
              userid: 'testUser',
              token: 'testToken',
              name: 'Test User',
              profileCompleted: true,
              userType: 'customer',
              tokenExpiry: Date.now() + 3600000, // 1 hour expiry
            },
            setLoggedUser: mockSetLoggedUser,
            logout: mockLogout,
          }}
        >
          <ChakraProvider>
            <SignInDialog open={open} onClose={mockOnClose} openSignUp={mockOpenSignUp} />
          </ChakraProvider>
        </UserContext.Provider>
      </MemoryRouter>
    );
  }  

  test("successful login stores user and redirects", async () => {
    (axiosInstance.post as jest.Mock).mockResolvedValue({
        data: {
          token: "fake-jwt-token",
          userType: "customer",
          profileCompleted: true,
          userProfile: { user: "user123", name: "Test User" },
          expiresIn: 3600,
        },
      });     
  
    renderComponent();
  
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
  
    fireEvent.submit(screen.getByTestId("signInForm")); // Ensures the form submits
  
    await waitFor(() => {
    //   console.log("Mock SetLoggedUser Calls:", mockSetLoggedUser.mock.calls);
      expect(mockSetLoggedUser).toHaveBeenCalledWith(
        expect.objectContaining({
          userid: "user123",
          token: "fake-jwt-token",
        })
      );
    });
  
    expect(localStorage.getItem("token")).toBe("fake-jwt-token");
    expect(localStorage.getItem("user")).toBe("user123");
    expect(mockOnClose).toHaveBeenCalled(); // Ensures modal closes after login
  });  

  test("allows login submission with Enter key", async () => {
    renderComponent();
  
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
  
    fireEvent.keyDown(screen.getByPlaceholderText("••••••••"), {
      key: "Enter",
      code: "Enter",
    });
  
    await waitFor(() => {
      expect(mockSetLoggedUser).toHaveBeenCalledWith(
        expect.objectContaining({
          userid: "user123",
          token: "fake-jwt-token",
        })
      );
    });
  
    expect(screen.getByRole("button", { name: "Sign in with email" })).toBeEnabled();
  });
  test('renders sign-in modal when open', () => {
    renderComponent();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in with email" })).toBeInTheDocument();
  });

  test('does not render when open is false', () => {
    renderComponent(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in with email' }));
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid email', async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in with email' }));
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test('shows validation error for short password', async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in with email' }));
    expect(await screen.findByText(/password must be at least 6 characters long/i)).toBeInTheDocument();
  });

   

  test("shows error toast on login failure", async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });
  
    renderComponent();
  
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in with email" }));
  
    // More flexible check for toast message
    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });
  

  test('handles network failure during login', async () => {
    (axiosInstance.post as jest.Mock).mockRejectedValue(new Error("Network Error"));

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in with email' }));

    expect(await screen.findByText(/login failed/i)).toBeInTheDocument();
  });

 
  test('opens sign-up dialog when clicking "Sign up"', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(mockOpenSignUp).toHaveBeenCalled();
  });

  test('opens forgot password dialog when clicking "Forgot your password?"', () => {
    renderComponent();
    fireEvent.click(screen.getByText(/forgot your password\?/i));
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
  });
});
