import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test-utils/render";
import SelectServicePage from "@/app/select-service/page";

jest.mock("@/app/constants/nav.js", () => () => <nav data-testid="nav" />);

beforeEach(() => {
  jest.restoreAllMocks();
  global.fetch = undefined;
  window.alert = jest.fn();
});

function getDateInput() {
  const label = screen.getByText(/select a date/i);
  const container = label.closest("div")?.parentElement || document.body;
  const input = container.querySelector('input[type="date"]');
  expect(input).toBeInTheDocument();
  return input;
}

describe("Select Service page", () => {
  test("renders headings, date input, and loads slots on date change", async () => {
    const user = userEvent.setup();

    // 1) GET on initial mount (today) -> none booked
    // 2) GET after we change the date -> mark 09:30 as booked
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ booked: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ booked: ["09:30"] }) });

    renderWithProviders(<SelectServicePage />);

    // main heading present
    expect(
      screen.getByRole("heading", { level: 1, name: /schedule a service/i })
    ).toBeInTheDocument();

    // change date to a known weekday so weekday slots render
    const dateInput = getDateInput();
    await user.clear(dateInput);
    await user.type(dateInput, "2025-10-13"); // Monday

    // slots appear; 8:30 AM should be enabled
    expect(await screen.findByRole("button", { name: /8:30 am/i })).toBeEnabled();

    // 9:30 AM should be disabled (booked from our mock)
    const nineThirty = screen.getByRole("button", { name: /9:30 am/i });
    expect(nineThirty).toBeDisabled();

    // nav smoke
    expect(screen.getByTestId("nav")).toBeInTheDocument();
  });

  test("happy path: pick slot, open review, confirm -> posts & alerts", async () => {
    const user = userEvent.setup();

    // 1) GET on mount, 2) GET after date change, 3) POST /book
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ booked: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ booked: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    renderWithProviders(<SelectServicePage />);

    // choose a weekday
    const dateInput = getDateInput();
    await user.clear(dateInput);
    await user.type(dateInput, "2025-10-13");

    // pick a time
    const eightThirty = await screen.findByRole("button", { name: /8:30 am/i });
    await user.click(eightThirty);

    // open review modal
    await user.click(screen.getByRole("button", { name: /next step/i }));

    // modal visible
    expect(
      screen.getByRole("heading", { level: 2, name: /review your appointment/i })
    ).toBeInTheDocument();

    // confirm -> POST + alert
    await user.click(screen.getByRole("button", { name: /confirm appointment/i }));
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(window.alert).toHaveBeenCalledWith("Appointment confirmed!");
  });
});