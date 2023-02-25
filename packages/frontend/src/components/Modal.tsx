import React, {
  useRef, useEffect, useCallback,
} from "react";
import "../styles/Modal.scss";
import TabTrap from "./TabTrap";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  heading?: string;
}

const Modal: React.FC<Props> = ({
  children, isOpen, onClose, heading,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  }, [onClose]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose, handleClickOutside, handleEscapeKey]);
  return (
    <div aria-hidden={!isOpen} className={`modal-overlay ${isOpen ? "in" : "out"}`}>
      <div ref={modalRef} className="modal">
        <TabTrap isActive={isOpen}>
          <h2>{heading || ""}</h2>
          {children}
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            tabIndex={isOpen ? 0 : -1}
          >
            ×
          </button>
        </TabTrap>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  heading: "",
};

export default Modal;
