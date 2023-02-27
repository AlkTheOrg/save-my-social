import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../../components/Modal";

describe("Modal", () => {
  it("Should render children with no problem", () => {
    const pText = "Children paragraph";
    const { getByText } = render(
      <Modal isOpen onClose={() => {}}>
        <p>{pText}</p>
      </Modal>,
    );

    const p = getByText(pText);
    expect(p).toBeInTheDocument();
  });

  it("Should trigger onClose on outside or Esc is pressed", async () => {
    const pText = "Children paragraph";
    const onClose = jest.fn();
    const { getByText } = render(
      <>
        <button type="button">Click here</button>
        <Modal isOpen onClose={onClose}>
          <p>{pText}</p>
        </Modal>,
      </>,
    );
    const btn = getByText("Click here");
    userEvent.click(btn);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toBeCalledTimes(2);
  });
});
