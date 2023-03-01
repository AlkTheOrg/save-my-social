import userEvent from "@testing-library/user-event";
import SocialAppBtn from "../../components/SocialAppBtn";
import { renderWithProviders } from "../../util/test-utils";

const props = {
  logoPath: "",
  onClick: jest.fn(),
  text: "text",
};

describe("SocialAppBtn", () => {
  it("renders with no problem", () => {
    const { container } = renderWithProviders(
      <SocialAppBtn {...props} />,
    );
    expect(container).toBeInTheDocument();
  });

  it("should not rigger onClick when disabled", () => {
    const disabledText = "Test";
    const { getByText } = renderWithProviders(
      <SocialAppBtn
        {...props}
        isDisabled
        disabledText={disabledText}
      />,
    );
    expect(props.onClick).not.toHaveBeenCalled();
    expect(getByText(disabledText)).toBeInTheDocument();
  });

  it("should trigger onClick when clicked to Enter", async () => {
    const { getByText } = renderWithProviders(
      <SocialAppBtn {...props} />,
    );
    await userEvent.type(getByText(props.text), "{enter}");
    expect(props.onClick).toHaveBeenCalled();
  });
});
