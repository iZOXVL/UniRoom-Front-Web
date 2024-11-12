// ConfirmationModal.tsx
import React from "react";
import { Modal, Button, ModalBody, ModalHeader, ModalFooter } from "@nextui-org/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
      <ModalHeader>
        <h4>Confirmar Acción</h4>
      </ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onConfirm}>
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
