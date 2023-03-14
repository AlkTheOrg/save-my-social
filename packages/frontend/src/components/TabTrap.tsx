import {
  ReactNode, FC, useRef, useEffect,
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
  isActive?: boolean;
};

const TabTrap: FC<Props> = ({ children, isActive }) => {
  const trapWrapperRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (isActive) {
      const prevFocusedElem = document.activeElement as HTMLElement;
      const wrapperDiv = trapWrapperRef.current;
      wrapperDiv?.addEventListener("keydown", handleKeyDown);

      const firstFocusableElement = getFirstFocusableElement(trapWrapperRef.current);
      // to disable auto click after TabTrap's focus. Why did e.preventDefault not work?
      // setTimeout(() => (firstFocusableElement as HTMLElement)?.focus(), 150);
      (firstFocusableElement as HTMLElement)?.focus();

      return () => {
        wrapperDiv?.removeEventListener("keydown", handleKeyDown);
        // setTimeout(() => prevFocusedElem?.focus(), 150);
        prevFocusedElem?.focus();
      };
    }
    return undefined;
  }, [isActive]);

  return <div ref={trapWrapperRef}>{children}</div>;
};

TabTrap.defaultProps = {
  isActive: true,
};

export default TabTrap;
