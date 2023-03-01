import { screen } from "@testing-library/react";
import App from "../../App";
import { renderWithProviders } from "../../util/test-utils";

test("renders homepage", () => {
  renderWithProviders(<App />);

  expect(screen.getByText(/Header/i)).toBeInTheDocument();
});
