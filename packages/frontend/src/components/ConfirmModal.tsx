import { FC, ReactNode } from "react";
import Modal from "./Modal";
import "../styles/ConfirmModal.scss";

type Props = {
  isOpen: boolean,
  onConfirm: (...args: unknown[]) => void,
  onReject: (...args: unknown[]) => void,
  children: ReactNode,
  heading?: string,
}

const ConfirmModal: FC<Props> = ({
  isOpen,
  onConfirm,
  onReject,
  children,
  heading,
}) => {
  return (
    <Modal heading={heading} isOpen={isOpen} onClose={onReject}>
      <div className="confirm-modal">
        {children}
        <div className="buttons">
          <button
            tabIndex={isOpen ? 0 : -1}
            type="button"
            onClick={onReject}
            className="reject"
          >
            No
          </button>
          <button
            tabIndex={isOpen ? 0 : -1}
            type="button"
            onClick={onConfirm}
            className="confirm"
          >
            Yes
          </button>
        </div>
      </div>
    </Modal>
  );
};

ConfirmModal.defaultProps = {
  heading: "",
};

export default ConfirmModal;
