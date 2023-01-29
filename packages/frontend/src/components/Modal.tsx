import React, { useRef, useEffect, useCallback } from "react";
import "../styles/Modal.scss";

interface Props {
  children: React.ReactNode;
  heading: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<Props> = ({
  children, heading, isOpen, onClose,
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
      // setIsAnimating(true);
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
    <div className="modal-overlay">
      <div ref={modalRef} className="modal">
        <h2 role="alert">{heading}</h2>
        {children}
        <button type="button" className="modal-close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;
