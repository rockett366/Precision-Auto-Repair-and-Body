import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/render";
import ReviewPage from "@/app/review/page";

jest.mock("@/app/constants/nav", () => () => <nav data-testid="nav" />);

describe("Review page", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    global.fetch = undefined;
  });

  test("requires a rating before submit (shows error popup)", async () => {
    const user = userEvent.setup();
    // fetch should not be called when rating is missing
    global.fetch = jest.fn();

    renderWithProviders(<ReviewPage />);
    await user.click(screen.getByRole("button", { name: /submit review/i }));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(screen.getByText(/please select a star rating/i)).toBeInTheDocument();
  });

  test("submits with rating and shows success/info popup (happy path)", async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: { get: () => "application/json" },
      json: async () => ({}),
      text: async () => "",
    });

    renderWithProviders(<ReviewPage />);

    // set rating 5
    await user.click(screen.getByRole("button", { name: /set rating to 5/i }));
    // type review
    await user.type(screen.getByLabelText(/review/i), "Great service!");
    // submit
    await user.click(screen.getByRole("button", { name: /submit review/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/thanks for the great rating/i)).toBeInTheDocument();
  });

  test("handles server error and shows error popup", async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      headers: { get: () => "application/json" },
      json: async () => ({ detail: "Invalid input" }),
      text: async () => "",
    });

    renderWithProviders(<ReviewPage />);

    await user.click(screen.getByRole("button", { name: /set rating to 3/i }));
    await user.type(screen.getByLabelText(/review/i), "ok");
    await user.click(screen.getByRole("button", { name: /submit review/i }));

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/something went wrong submitting your review/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
  });

  test("popup can be closed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewPage />);

    // trigger error popup (no rating)
    await user.click(screen.getByRole("button", { name: /submit review/i }));
    const closeBtn = screen.getByRole("button", { name: /close/i });
    await user.click(closeBtn);

    expect(screen.queryByText(/please select a star rating/i)).not.toBeInTheDocument();
  });
});