import { Modal, ModalProps } from "antd";

export interface PopupModalProps extends ModalProps {
  show: boolean;
  onClose: ModalProps["onCancel"];
}

function PopupModal({ show, onClose, children, ...props }: PopupModalProps) {
  return (
    <Modal
      open={show}
      onCancel={onClose}
      mask={{ closable: false }}
      keyboard={false}
      centered
      {...props}
    >
      {children}
    </Modal>
  );
}

export default PopupModal;
