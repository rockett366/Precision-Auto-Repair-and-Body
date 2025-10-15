import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils/render";
import Loyalty from "@/app/loyalty-membership/page";

jest.mock("@/app/constants/nav.js", () => () => <nav data-testid="nav" />);
jest.mock("@/app/constants/footer", () => () => <footer data-testid="footer" />);
jest.mock("next/image", () => (props) => <img {...props} />);

describe("Loyalty Membership page", () => {
  test("renders main headings and sections", () => {
    renderWithProviders(<Loyalty />);

    expect(
      screen.getByRole("heading", { level: 1, name: /customer loyalty membership/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 2, name: /our membership/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /free services/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /discounted services/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /membership plan options/i })
    ).toBeInTheDocument();

    expect(screen.getByTestId("nav")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("renders feature cards, lists, and at least one image", () => {
    renderWithProviders(<Loyalty />);

    expect(
      screen.getByRole("heading", { level: 3, name: /discounted services/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /free services/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /different membership plans/i })
    ).toBeInTheDocument();

    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
    expect(screen.getAllByAltText(/stock photo for car/i).length).toBeGreaterThan(0);
  });
});