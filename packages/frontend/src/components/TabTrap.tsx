import {
  ReactNode, FC, useRef, useState, useEffect,
} from "react";

// eslint-disable-next-line max-len
const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]';

const getFocusableElements = (target: HTMLElement | null) => Array.from(
  target?.querySelectorAll(focusableElementsString) || [],
) as HTMLElement[];
const getFirstFocusableElement = (target: HTMLElement | null) =>
  target?.querySelector(focusableElementsString);

type Props = {
  children: ReactNode;
};

const TabTrap: FC<Props> = ({ children }) => {
  const [prevFocusedElem, setPrevFocusedElem] = useState<HTMLElement | null>(null);
  const trapWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        //* content may be dynamic, so we get all focusable elements every time
        const focusableElements = getFocusableElements(trapWrapperRef.current);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
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
    const firstFocusableElement = getFirstFocusableElement(trapWrapperRef.current);
    (firstFocusableElement as HTMLElement)?.focus();
  }, []);

  return <div ref={trapWrapperRef} tabIndex={-1}>{children}</div>;
};

export default TabTrap;
