import { render, waitFor } from '@testing-library/react';
import { UserProvider, UserContext } from '../UserContext'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; // Adjust path as needed
import { ReactNode } from 'react';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../utils/axiosInstance', () => ({
  post: jest.fn(),
}));

// Mock browser APIs
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const mockSetTimeout = jest.spyOn(global, 'setTimeout');
const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
const mockSetInterval = jest.spyOn(global, 'setInterval');
const mockClearInterval = jest.spyOn(global, 'clearInterval');

describe('UserProvider', () => {
  const mockNavigate = jest.fn();
  let originalDateNow: () => number;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    mockSetTimeout.mockClear();
    mockClearTimeout.mockClear();
    mockSetInterval.mockClear();
    mockClearInterval.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();

    // Mock Date.now for consistent timing
    originalDateNow = Date.now;
    Date.now = jest.fn(() => 1000000); // Fixed timestamp for testing
  });

  afterEach(() => {
    Date.now = originalDateNow; // Restore original Date.now
  });

  const renderWithProvider = (children: ReactNode) => {
    return render(<UserProvider>{children}</UserProvider>);
  };

  test('initializes with user from localStorage', () => {
    const mockUser = {
      userid: 'user123',
      token: 'mock-token',
      name: 'Test User',
      profileCompleted: true,
      userType: 'customer',
      verified: true,
      tokenExpiry: 2000000, // 1000 seconds from now
    };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

    let contextValue: any;
    renderWithProvider(
      <UserContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </UserContext.Consumer>
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('loggedUser');
    expect(contextValue.loggedUser).toEqual(mockUser);
  });

  test('initializes with null if no user in localStorage', () => {
    mockLocalStorage.getItem.mockReturnValueOnce(null);

    let contextValue: any;
    renderWithProvider(
      <UserContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </UserContext.Consumer>
    );

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('loggedUser');
    expect(contextValue.loggedUser).toBeNull();
  });

  test('logs out when token is expired on mount', async () => {
    const mockUser = {
      userid: 'user123',
      token: 'mock-token',
      name: 'Test User',
      profileCompleted: true,
      userType: 'customer',
      verified: true,
      tokenExpiry: 500000, // Expired 500 seconds ago
    };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

    let contextValue: any;
    renderWithProvider(
      <UserContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </UserContext.Consumer>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      expect(contextValue.loggedUser).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('loggedUser');
    });
  });

  test('sets timeout for token expiration', () => {
    const mockUser = {
      userid: 'user123',
      token: 'mock-token',
      name: 'Test User',
      profileCompleted: true,
      userType: 'customer',
      verified: true,
      tokenExpiry: 1500000, // 500 seconds from now
    };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

    renderWithProvider(<div />);

    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 500000);
  });

  test('clears timeout on unmount', () => {
    const mockUser = {
      userid: 'user123',
      token: 'mock-token',
      name: 'Test User',
      profileCompleted: true,
      userType: 'customer',
      verified: true,
      tokenExpiry: 1500000,
    };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

    const { unmount } = renderWithProvider(<div />);
    unmount();

    expect(mockClearTimeout).toHaveBeenCalled();
  });

  test('logout clears user and navigates', async () => {
    const mockUser = {
      userid: 'user123',
      token: 'mock-token',
      name: 'Test User',
      profileCompleted: true,
      userType: 'customer',
      verified: true,
      tokenExpiry: 2000000,
    };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));

    let contextValue: any;
    renderWithProvider(
      <UserContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </UserContext.Consumer>
    );

    contextValue.logout();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      expect(contextValue.loggedUser).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('loggedUser');
    });
  });

  test('refreshes token when near expiry', async () => {
    const mockUser = {
      userid: 'user123',
      token: 'old-token',
      name: 'Test User',
      profileCompleted: true,
      userType: 'customer',
      verified: true,
      tokenExpiry: 1300000, // 300 seconds from now (within 5 min buffer)
    };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
    (axiosInstance.post as jest.Mock).mockResolvedValueOnce({
      data: { token: 'new-token', expiresIn: 3600 },
    });

    let contextValue: any;
    renderWithProvider(
      <UserContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </UserContext.Consumer>
    );

    // Simulate interval trigger
    const intervalCallback = mockSetInterval.mock.calls[0][0];
    Date.now = jest.fn(() => 1000000); // Reset time to initial mount time
    await intervalCallback();

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/api/auth/refresh-token', {
        token: 'old-token',
      });
      expect(contextValue.loggedUser.token).toBe('new-token');
      expect(contextValue.loggedUser.tokenExpiry).toBe(1000000 + 3600 * 1000);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'loggedUser',
        JSON.stringify({
          ...mockUser,
          token: 'new-token',
          tokenExpiry: 1000000 + 3600 * 1000,
        })
      );
    });
  });

  test('logs out on token refresh failure', async () => {
    const mockUser = {
      userid: 'user123',
      token: 'old-token',
      name: 'Test User',
      profileCompleted: true,
      userType: 'customer',
      verified: true,
      tokenExpiry: 1300000, // 300 seconds from now (within 5 min buffer)
    };
    mockLocalStorage.getItem.mockReturnValueOnce(JSON.stringify(mockUser));
    (axiosInstance.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));

    let contextValue: any;
    renderWithProvider(
      <UserContext.Consumer>
        {(value) => {
          contextValue = value;
          return null;
        }}
      </UserContext.Consumer>
    );

    // Simulate interval trigger
    const intervalCallback = mockSetInterval.mock.calls[0][0];
    await intervalCallback();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      expect(contextValue.loggedUser).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('loggedUser');
    });
  });
});
