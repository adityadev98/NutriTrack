import { render, screen, fireEvent } from '@testing-library/react';
import AuthModal from '../Authentication/AuthModal'; // Adjust path as needed
import '@testing-library/jest-dom';



// Mock the child components
jest.mock('../Authentication/SignInDialog', () => ({ open, onClose, openSignUp, openForgotPassword }: { open: boolean; onClose: () => void; openSignUp: () => void; openForgotPassword: () => void }) => (
  <div data-testid="sign-in-dialog">
    {open && (
      <>
        <button onClick={onClose}>Close Sign In</button>
        <button onClick={openSignUp}>Open Sign Up</button>
        <button onClick={openForgotPassword}>Forgot Password</button>
      </>
    )}
  </div>
));

jest.mock('../Authentication/SignUpDialog', () => ({ open, onClose, openSignIn }: { open: boolean; onClose: () => void; openSignIn: () => void }) => (
  <div data-testid="sign-up-dialog">
    {open && (
      <>
        <button onClick={onClose}>Close Sign Up</button>
        <button onClick={openSignIn}>Open Sign In</button>
      </>
    )}
  </div>
));

jest.mock('../Authentication/ForgotPassword', () => ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
  <div data-testid="forgot-password-dialog">
    {open && <button onClick={handleClose}>Close Forgot Password</button>}
  </div>
));

describe('AuthModal', () => {
  const mockSetOpenSignIn = jest.fn();
  const mockSetOpenSignUp = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('closes SignInDialog when onClose is called', () => {
    render(
      <AuthModal
        openSignIn={true}
        setOpenSignIn={mockSetOpenSignIn}
        openSignUp={false}
        setOpenSignUp={mockSetOpenSignUp}
      />
    );

    fireEvent.click(screen.getByText('Close Sign In'));
    expect(mockSetOpenSignIn).toHaveBeenCalledWith(false);
  });

  test('closes SignUpDialog when onClose is called', () => {
    render(
      <AuthModal
        openSignIn={false}
        setOpenSignIn={mockSetOpenSignIn}
        openSignUp={true}
        setOpenSignUp={mockSetOpenSignUp}
      />
    );

    fireEvent.click(screen.getByText('Close Sign Up'));
    expect(mockSetOpenSignUp).toHaveBeenCalledWith(false);
  });

  test('switches from SignIn to SignUp dialog', () => {
    render(
      <AuthModal
        openSignIn={true}
        setOpenSignIn={mockSetOpenSignIn}
        openSignUp={false}
        setOpenSignUp={mockSetOpenSignUp}
      />
    );

    fireEvent.click(screen.getByText('Open Sign Up'));
    expect(mockSetOpenSignIn).toHaveBeenCalledWith(false);
    expect(mockSetOpenSignUp).toHaveBeenCalledWith(true);
  });

  test('switches from SignUp to SignIn dialog', () => {
    render(
      <AuthModal
        openSignIn={false}
        setOpenSignIn={mockSetOpenSignIn}
        openSignUp={true}
        setOpenSignUp={mockSetOpenSignUp}
      />
    );

    fireEvent.click(screen.getByText('Open Sign In'));
    expect(mockSetOpenSignUp).toHaveBeenCalledWith(false);
    expect(mockSetOpenSignIn).toHaveBeenCalledWith(true);
  });

  test('opens ForgotPassword dialog from SignIn', () => {
    render(
      <AuthModal
        openSignIn={true}
        setOpenSignIn={mockSetOpenSignIn}
        openSignUp={false}
        setOpenSignUp={mockSetOpenSignUp}
      />
    );

    fireEvent.click(screen.getByText('Forgot Password'));
    expect(mockSetOpenSignIn).toHaveBeenCalledWith(false);
    expect(screen.getByTestId('forgot-password-dialog')).toBeInTheDocument();
  });
});