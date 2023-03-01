/* eslint-disable max-len */
import { render } from "@testing-library/react";
import WindowOpener, { WindowOpenerProps } from "../../components/WindowOpener";

describe("WindowOpener", () => {
  it("should open a window", () => {
    const onOpen = jest.fn();
    const { container } = render(
      <WindowOpener
        shouldBeOpened
        target="http://localhost:3005/test"
        onOpen={onOpen}
      />,
    );
    expect(onOpen).toHaveBeenCalled();
    expect(global.open).toHaveBeenCalled();
    expect(container).toBeInTheDocument();
  });

  const defaultProps: WindowOpenerProps = {
    target: "https://www.example.com",
    shouldBeOpened: false,
    width: 100,
    height: 100,
    marginTop: 5,
    marginLeft: 5,
  };

  it("should open a new window with the specified dimensions and URL when shouldBeOpened is true", () => {
    const { container } = render(<WindowOpener {...defaultProps} shouldBeOpened />);
    expect(container.querySelector("div")).toHaveStyle("display: none");
    expect(global.open).toHaveBeenCalledWith(
      defaultProps.target,
      "_blank",
      `width=${defaultProps.width},height=${defaultProps.height},top=${defaultProps.marginTop},left=${defaultProps.marginLeft}`,
    );
  });

  it("should call onMessage when a message is received", () => {
    const onMessage = jest.fn();
    render(<WindowOpener {...defaultProps} onMessage={onMessage} />);
    global.dispatchEvent(new MessageEvent("message"));
    expect(onMessage).toHaveBeenCalled();
  });

  it("should add message event listener and remove it when component is unmounted", () => {
    const addEventListenerMock = jest.spyOn(global, "addEventListener");
    const removeEventListenerMock = jest.spyOn(global, "removeEventListener");
    expect(global).toHaveProperty("addEventListener");
    const onMessage = jest.fn();
    const { unmount } = render(
      <WindowOpener shouldBeOpened={false} onMessage={onMessage} />,
    );
    expect(addEventListenerMock).toHaveBeenCalledWith("message", onMessage);
    expect(removeEventListenerMock).not.toHaveBeenCalled();
    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith("message", onMessage);
  });
});
