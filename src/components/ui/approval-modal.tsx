import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: any;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, chat }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="blur" className="z-1">
      <ModalContent>
        <ModalHeader>Solicitud Aprobada</ModalHeader>
        <ModalBody>
          <p>La solicitud para la habitación {chat.roomDetails.title} ha sido aprobada con éxito.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => window.location.href = "/admin/chats"}>
            Ir a chats
          </Button>
          <Button color="danger" variant="light" onPress={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ApprovalModal;
