/* eslint-disable no-console */
import {
  FunctionComponent, useEffect, useState, useCallback,
} from "react";

export type WindowOpenerProps = {
  target?: string;
  width?: number;
  height?: number;
  marginTop?: number;
  marginLeft?: number;
  onOpen?: (...args: unknown[]) => void;
  onMessage?: (e: MessageEvent) => void;
  onClose?: (...args: unknown[]) => void;
  shouldBeOpened: boolean
};

const WindowOpener: FunctionComponent<WindowOpenerProps> = ({
  target,
  width,
  height,
  marginTop,
  marginLeft,
  onOpen,
  onMessage,
  onClose,
  shouldBeOpened,
}) => {
  const [openedWindow, setOpenedWindow] = useState<Window | null>(null);

  const handleOpen = useCallback(() => {
    console.log("\ntarget:", target);
    if (target && !openedWindow) {
      const newWindow = window.open(
        target,
        target,
        `width=${width},height=${height},top=${marginTop},left=${marginLeft}`,
      );
      console.log("newWindow:", newWindow);
      setOpenedWindow(newWindow);
      if (onOpen) onOpen();
    }
  }, [target, width, height, marginTop, marginLeft, openedWindow, onOpen]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    console.log("handleClose :: closing window:", openedWindow);
    if (openedWindow && !openedWindow.closed) openedWindow.close();
    setOpenedWindow(null);
  }, [openedWindow, onClose]);

  useEffect(() => {
    if (shouldBeOpened && !openedWindow) handleOpen();
    else if (!shouldBeOpened && openedWindow && !openedWindow.closed) {
      console.log("openedWindow:", openedWindow);
      handleClose();
    }
  }, [shouldBeOpened, openedWindow, handleOpen, handleClose]);

  // if the window is closed manually, we need to listen it and trigger handleClose()
  useEffect(() => {
    console.log("rerenderrr");
    const isClosedInterval = setInterval(() => {
      // shouldBeOpened will be true when the window is closed manually by the user
      if (openedWindow && openedWindow.closed && shouldBeOpened) {
        clearInterval(isClosedInterval);
        handleClose();
      }
      return () => {
        clearInterval(isClosedInterval);
      };
    }, 500);
  }, [openedWindow, handleClose, shouldBeOpened]);

  useEffect(() => {
    if (onMessage) window.addEventListener("message", onMessage);
    return () => {
      if (onMessage) window.removeEventListener("message", onMessage);
    };
  }, [onMessage]);

  return <div style={{ display: "none" }}></div>;
};

const defaultSize = [window.screen.width / 1.5, window.screen.height / 1.5];
WindowOpener.defaultProps = {
  target: "",
  width: defaultSize[0],
  height: defaultSize[1],
  marginTop: window.screen.height / 2 - defaultSize[1] / 2,
  marginLeft: window.screen.width / 2 - defaultSize[0] / 2,
  onOpen: () => {},
  onMessage: () => {},
  onClose: () => {},
};

export default WindowOpener;
