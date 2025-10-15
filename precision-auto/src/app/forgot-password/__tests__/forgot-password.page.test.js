import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/render";
import ForgotPassword from "@/app/forgot-password/page";

jest.mock("@/app/constants/nav.js", () => () => <nav data-testid="nav" />);

describe("Forgot Password page", () => {
  test("renders and validates email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPassword />);

    expect(screen.getByRole("heading", { level: 1, name: /forgot password/i })).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();

    const email = screen.getByLabelText(/email/i);
    await user.type(email, "not-an-email");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  test("shows success popup for valid email and can close", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPassword />);

    await user.clear(screen.getByLabelText(/email/i));
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/email submitted successfully/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText(/email submitted successfully/i)).not.toBeInTheDocument();
  });
});