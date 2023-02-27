import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabTrap from "../../components/TabTrap";

describe("TabTrap", () => {
  it("Should focus on the first element", () => {
    const firstBtnText = "First Button";
    const { getByText } = render(
      <TabTrap>
        <p>Non focusable paragraph.</p>
        <button type="button">{firstBtnText}</button>
        <button type="button">Second Button</button>
      </TabTrap>,
    );

    const firstBtn = getByText(firstBtnText);
    expect(firstBtn).toHaveFocus();
  });

  it("Should trap the tab", () => {
    const btnText = "My Button";
    const { getByText } = render(
      <>
        <button type="button">Outside Button</button>
        <TabTrap>
          <p>Non focusable paragraph.</p>
          <button type="button">{btnText}</button>
        </TabTrap>,
      </>,
    );

    const trappedBtn = getByText(btnText);
    userEvent.tab();
    expect(trappedBtn).toHaveFocus();
  });

  it("Should not trap when isActive prop is false", () => {
    const btnText = "My Button";
    const { getByText } = render(
      <>
        <button type="button">Outside Button</button>
        <TabTrap isActive={false}>
          <p>Non focusable paragraph.</p>
          <button type="button">{btnText}</button>
        </TabTrap>,
      </>,
    );

    const trappedBtn = getByText(btnText);
    expect(trappedBtn).not.toHaveFocus();
  });
});
