import { FC } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { reset, setToken, toggleConfirmModal } from "../app/smsSlice";
import ConfirmModal from "./ConfirmModal";

const TwitterConfirmModal: FC<Record<string, never>> = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sms.isConfirmModalOpen);
  const closeModal = () => {
    if (isOpen) dispatch(toggleConfirmModal());
  };

  const onClose = () => {
    closeModal();
  };
  const onConfirm = () => {
    dispatch(setToken("true"));
    onClose();
  };
  const onReject = () => {
    dispatch(reset());
  };
  return (
    <ConfirmModal
      isOpen={isOpen}
      onConfirm={onConfirm}
      onReject={onReject}
      heading="Was Twitter access token retrieval successfull?"
    >
      <p>
        A popup window should have opened to login with Twitter.
        (We have to confirm this way because of the cross-origin-opener-policy header
        of Twitter)
      </p>
    </ConfirmModal>
  );
};

export default TwitterConfirmModal;
