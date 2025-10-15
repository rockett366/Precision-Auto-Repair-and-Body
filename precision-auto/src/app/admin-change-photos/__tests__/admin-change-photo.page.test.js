import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/render";
import AdminChangePhotos from "@/app/admin-change-photos/page";

jest.mock("@/app/constants/admin-sidebar", () => () => <aside data-testid="sidebar" />);
jest.mock("@/app/constants/nav.js", () => () => <nav data-testid="nav" />);

describe("AdminChangePhotos page", () => {
  test("renders header, nav & sidebar", () => {
    renderWithProviders(<AdminChangePhotos />);
    expect(screen.getByRole("heading", { level: 1, name: /change photos/i })).toBeInTheDocument();
    expect(screen.getByText(/view and manage photos/i)).toBeInTheDocument();
    expect(screen.getByTestId("nav")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  test("shows image tables with rows; supports Upload or placeholder text", () => {
    renderWithProviders(<AdminChangePhotos />);

    // images present
    expect(screen.getAllByRole("img").length).toBeGreaterThan(0);

    // each table has at least one row
    const tables = screen.getAllByRole("table");
    expect(tables.length).toBeGreaterThan(0);
    tables.forEach((t) => {
      const rows = within(t).getAllByRole("row");
      expect(rows.length).toBeGreaterThan(0);
    });

    // Either new UI with Upload buttons or old placeholder cells
    const uploadButtons = screen.queryAllByRole("button", { name: /upload/i });
    if (uploadButtons.length > 0) {
      expect(uploadButtons.length).toBeGreaterThan(0);
    } else {
      expect(screen.getAllByText(/placeholder/i).length).toBeGreaterThan(0);
    }
  });
});