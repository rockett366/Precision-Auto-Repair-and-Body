import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/render";
import SignUpPage from "@/app/signup/page";

jest.mock("@/app/constants/nav", () => () => <nav data-testid="nav" />);

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));

beforeEach(() => {
  pushMock.mockReset();
  jest.restoreAllMocks();
  global.fetch = undefined;

  // localStorage mock
  const store = {};
  Object.defineProperty(window, "localStorage", {
    value: {
      setItem: (k, v) => {
        store[k] = String(v);
      },
      getItem: (k) => store[k] ?? null,
      removeItem: (k) => {
        delete store[k];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    },
    configurable: true,
  });
});

describe("SignUp page", () => {
  test("client validation prevents submit with empty fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignUpPage />);

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/^password is required!$/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
  });

  test("happy path: submits, stores token, redirects", async () => {
    const user = userEvent.setup();

    global.fetch = jest
      .fn()
      // signup ok
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
      })
      // login returns token
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ access_token: "abc123" }),
      });

    renderWithProviders(<SignUpPage />);

    await user.type(screen.getByLabelText(/first name/i), "Ada");
    await user.type(screen.getByLabelText(/last name/i), "Lovelace");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Aa1!aaaa");
    await user.type(screen.getByLabelText(/confirm password/i), "Aa1!aaaa");
    await user.type(screen.getByLabelText(/phone number/i), "4155550123");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(window.localStorage.getItem("token")).toBe("abc123");
    expect(pushMock).toHaveBeenCalledWith("/client-portal-profile");
  });

  test("server error from signup is shown", async () => {
    const user = userEvent.setup();

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => JSON.stringify({ detail: "Email already used" }),
    });

    renderWithProviders(<SignUpPage />);

    await user.type(screen.getByLabelText(/first name/i), "Ada");
    await user.type(screen.getByLabelText(/last name/i), "Lovelace");
    await user.type(screen.getByLabelText(/^email$/i), "ada@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Aa1!aaaa");
    await user.type(screen.getByLabelText(/confirm password/i), "Aa1!aaaa");
    await user.type(screen.getByLabelText(/phone number/i), "4155550123");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/email already used/i)).toBeInTheDocument();
  });

  test("password helper appears on focus and hides on blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SignUpPage />);

    const pwd = screen.getByLabelText(/^password$/i);
    await user.click(pwd);
    expect(screen.getByText(/password must contain/i)).toBeInTheDocument();

    await user.click(screen.getByLabelText(/^email$/i));
    expect(screen.queryByText(/password must contain/i)).not.toBeInTheDocument();
  });
});