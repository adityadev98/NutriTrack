import { render, act } from "@testing-library/react";
import { UserProvider, UserContext } from "../contexts/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../utils/axiosInstance", () => ({
  post: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UserContext", () => {
  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock = {};
    global.localStorage.setItem = jest.fn((key, value) => {
      localStorageMock[key] = value;
    });
    global.localStorage.getItem = jest.fn(
      (key) => localStorageMock[key] || null,
    );
    global.localStorage.removeItem = jest.fn((key) => {
      delete localStorageMock[key];
    });
  });

  function renderWithUserProvider(children: React.ReactNode) {
    return render(
      <MemoryRouter>
        <UserProvider>{children}</UserProvider>
      </MemoryRouter>,
    );
  }

  test("initializes with null if no user is stored", () => {
    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          expect(context?.loggedUser).toBeNull();
          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("initializes with stored user from localStorage", () => {
    localStorageMock["loggedUser"] = JSON.stringify({
      userid: "testUser",
      token: "testToken",
      name: "Test User",
      profileCompleted: true,
      userType: "customer",
      tokenExpiry: Date.now() + 3600000,
    });

    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          expect(context?.loggedUser?.userid).toBe("testUser");
          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("setLoggedUser updates user state and localStorage", () => {
    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          act(() => {
            context?.setLoggedUser({
              userid: "newUser",
              token: "newToken",
              name: "New User",
              profileCompleted: false,
              userType: "customer",
              tokenExpiry: Date.now() + 3600000,
            });
          });

          expect(context?.loggedUser?.userid).toBe("newUser");
          expect(localStorageMock["loggedUser"]).toBeDefined();
          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("logout function clears user state and localStorage", () => {
    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          act(() => {
            context?.logout();
          });

          expect(context?.loggedUser).toBeNull();
          expect(localStorageMock["loggedUser"]).toBeUndefined();
          expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });

          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("logs out if token is expired on initialization", () => {
    localStorageMock["loggedUser"] = JSON.stringify({
      userid: "expiredUser",
      token: "expiredToken",
      name: "Expired User",
      profileCompleted: true,
      userType: "customer",
      tokenExpiry: Date.now() - 1000, // Expired
    });

    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          expect(context?.loggedUser).toBeNull();
          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("refreshes token before expiration", async () => {
    localStorageMock["loggedUser"] = JSON.stringify({
      userid: "testUser",
      token: "testToken",
      name: "Test User",
      profileCompleted: true,
      userType: "customer",
      tokenExpiry: Date.now() + 5 * 60 * 1000, // 5 min buffer
    });

    (axiosInstance.post as jest.Mock).mockResolvedValue({
      data: { token: "newToken", expiresIn: 3600 },
    });

    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          expect(context?.loggedUser?.token).toBe("newToken");
          expect(localStorageMock["loggedUser"]).toContain("newToken");
          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("logs out if token refresh fails", async () => {
    localStorageMock["loggedUser"] = JSON.stringify({
      userid: "testUser",
      token: "testToken",
      name: "Test User",
      profileCompleted: true,
      userType: "customer",
      tokenExpiry: Date.now() + 5 * 60 * 1000, // 5 min buffer
    });

    (axiosInstance.post as jest.Mock).mockRejectedValue(
      new Error("Token refresh failed"),
    );

    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          expect(context?.loggedUser).toBeNull();
          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("detects user activity and prevents logout", () => {
    localStorageMock["loggedUser"] = JSON.stringify({
      userid: "activeUser",
      token: "activeToken",
      name: "Active User",
      profileCompleted: true,
      userType: "customer",
      tokenExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes left
    });

    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          act(() => {
            window.dispatchEvent(new Event("mousemove"));
          });

          expect(context?.loggedUser?.userid).toBe("activeUser");
          return null;
        }}
      </UserContext.Consumer>,
    );
  });

  test("logs out user if inactive beyond token expiry", async () => {
    localStorageMock["loggedUser"] = JSON.stringify({
      userid: "inactiveUser",
      token: "inactiveToken",
      name: "Inactive User",
      profileCompleted: true,
      userType: "customer",
      tokenExpiry: Date.now() + 2000, // 2 seconds expiry
    });

    renderWithUserProvider(
      <UserContext.Consumer>
        {(context) => {
          setTimeout(() => {
            expect(context?.loggedUser).toBeNull();
          }, 3000); // Wait for expiry
          return null;
        }}
      </UserContext.Consumer>,
    );
  });
});
