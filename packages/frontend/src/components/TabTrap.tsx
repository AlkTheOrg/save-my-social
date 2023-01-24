import {
  ReactNode, FC, useRef, useState, useEffect,
} from "react";

// eslint-disable-next-line max-len
const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';

type Props = {
  children: ReactNode;
};

const TabTrap: FC<Props> = ({ children }) => {
  const [prevFocusedElem, setPrevFocusedElem] = useState<HTMLElement | null>(null);
  const trapWrapperRef = useRef<HTMLDivElement>(null);

  const getFocusableElements = () => Array.from(
    trapWrapperRef.current?.querySelectorAll(focusableElementsString) || [],
  ) as HTMLElement[];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();

        //* content may be dynamic, so we get all focusable elements every time
        const focusableElements = getFocusableElements();
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
          }
        } else if (document.activeElement === lastElement) {
          firstElement?.focus();
        }
      }
    };

    setPrevFocusedElem(document.activeElement as HTMLElement);
    const wrapperDiv = trapWrapperRef.current;
    wrapperDiv?.addEventListener("keydown", handleKeyDown);

    return () => {
      wrapperDiv?.removeEventListener("keydown", handleKeyDown);
      prevFocusedElem?.focus();
    };
  }, [prevFocusedElem]);

  useEffect(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement.focus();
    }
  }, []);

  return <div ref={trapWrapperRef} tabIndex={-1}>{children}</div>;
};

export default TabTrap;
