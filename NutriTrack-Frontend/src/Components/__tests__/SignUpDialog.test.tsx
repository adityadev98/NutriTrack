import { SignUpDialog } from "../Sections";
import { render, screen, fireEvent} from "@testing-library/react";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
//import axiosInstance from "../../utils/axiosInstance.ts";
jest.mock("../../utils/axiosInstance.ts", () => ({
  post: jest.fn(),
}));

describe("SignUpDialog", () => {
  const mockOnClose = jest.fn();
  const mockOpenSignIn = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks(); // Clears all mock function calls
  });

  function renderComponent(open = true) {
    return render(
      <MemoryRouter>
        <ChakraProvider>
          <SignUpDialog open={open} onClose={mockOnClose} openSignIn={mockOpenSignIn} />
        </ChakraProvider>
      </MemoryRouter>
    );
  }

  // ✅ Test: Renders modal when open
  test("renders sign-up modal when open", () => {
    renderComponent();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up with email" })).toBeInTheDocument();
  });

  // ✅ Test: Does not render modal when closed
  test("does not render when open is false", () => {
    renderComponent(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  // ✅ Test: Shows validation errors for empty fields
  test("shows validation errors for empty fields", async () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: "Sign up with email" }));
    
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be 8\+ chars, include an uppercase letter, a number & a symbol./i)).toBeInTheDocument();
    // expect(await screen.findByText(/password must be 8\+ chars/i)).toBeInTheDocument();
    // expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  // ✅ Test: Shows validation error for invalid email
  test("shows validation error for invalid email", async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign up with email" }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  // ✅ Test: Shows validation error for weak password
  test("shows validation error for weak password", async () => {
    renderComponent();
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordInputs[0], { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign up with email" }));

    expect(await screen.findByText(/weak/i)).toBeInTheDocument();
  });

  // ✅ Test: Shows validation error for mismatched passwords
  test("shows validation error for mismatched passwords", async () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "StrongP@ssw0rd" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "DifferentP@ss" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign up with email" }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  // // ✅ Test: Successful registration stores user and closes modal
  // test("successful registration stores user and closes modal", async () => {
  //   (axiosInstance.post as jest.Mock).mockResolvedValue({
  //     data: { message: "Registration Successful" },
  //   });

  //   renderComponent();

  //   fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
  //     target: { value: "test@example.com" },
  //   });
  //   fireEvent.change(screen.getByLabelText("Password"), {
  //     target: { value: "StrongP@ssw0rd" },
  //   });
  //   fireEvent.change(screen.getByLabelText("Confirm Password"), {
  //     target: { value: "StrongP@ssw0rd" },
  //   });

  //   fireEvent.submit(screen.getByTestId("signUpForm"));

  //   // Debugging log for API call verification
  //   await waitFor(() => {
  //     console.log("Mock API Calls:", (axiosInstance.post as jest.Mock).mock.calls);
  //     expect(axiosInstance.post).toHaveBeenCalledTimes(1);
  //   });

  //   await waitFor(() => {
  //     console.log("Mock OnClose Calls:", mockOnClose.mock.calls);
  //     expect(mockOnClose).toHaveBeenCalled();
  //   });

  //   expect(await screen.findByText(/Registration Successful/i)).toBeInTheDocument();
    
  // });

  // // ✅ Test: Shows error toast on registration failure
  // test("shows error toast on registration failure", async () => {
  //   (axiosInstance.post as jest.Mock).mockRejectedValue({
  //     response: { data: { message: "Email already registered" } },
  //   });

  //   renderComponent();

  //   fireEvent.change(screen.getByPlaceholderText(/your@email.com/i), {
  //     target: { value: "existing@example.com" },
  //   });
  //   fireEvent.change(screen.getByLabelText("Password"), {
  //     target: { value: "StrongP@ssw0rd" },
  //   });
  //   fireEvent.change(screen.getByLabelText("Confirm Password"), {
  //     target: { value: "StrongP@ssw0rd" },
  //   });

  //   fireEvent.submit(screen.getByTestId("signUpForm"));
  //   // fireEvent.click(screen.getByRole("button", { name: "Sign up with email" }));
  //   expect(await screen.findByText(/email already registered/i)).toBeInTheDocument();
  // });

  // ✅ Test: Clicking "Sign in" opens the sign-in dialog
  test('opens sign-in dialog when clicking "Sign in"', () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: "Sign in with email" }));
    expect(mockOpenSignIn).toHaveBeenCalled();
  });
});
