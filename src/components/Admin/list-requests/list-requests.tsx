"use client";

import React, { useState, useEffect } from "react";
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip 
} from "@nextui-org/react";
import useGetPendingRequests from "@/components/Admin/hooks/useGetRequests";
import Image from "next/image";
import Loader from "@/components/common/Loader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FaCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import ApprovalModal from "@/components/ui/approval-modal"; // Modal personalizado
import axios from "axios";

// Función para recortar la dirección si es muy larga
const truncateText = (text: string, maxLength: number) => 
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const TableRequests = () => {
  const { chats, loading, error } = useGetPendingRequests();
  const [chatList, setChatList] = useState(chats); // Estado local para manejar la lista sin refetch
  const [selectedChat, setSelectedChat] = useState(null); // Guardar el chat seleccionado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Controlar la apertura del modal

  useEffect(() => {
    setChatList(chats); // Actualiza chatList cuando chats cambie
  }, [chats]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  // Manejar la aprobación de la solicitud
  const handleApprove = async (chatId: string, email: string, title: string) => {
    try {
      console.log(email, title, chatId);
      const response = await axios.post("https://uniroom-backend-services.onrender.com/update-status", {
        chatId,
        email,
        title,
        status: "approved",
      });

      if (response.data.status === "success") {
        // Eliminar el chat aprobado de la tabla (sin refetch)
        setChatList(chatList.filter((chat) => chat.id !== chatId));
        setSelectedChat(response.data.chat); // Guardar el chat aprobado para el modal
        setIsModalOpen(true); // Abrir el modal de éxito
      }
    } catch (error) {
      console.error("Error al aprobar la solicitud:", error);
    }
  };

  // Manejar el cierre del modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Breadcrumb pageName="Mis solicitudes" />
      <Table aria-label="Tabla de Solicitudes Pendientes" isHeaderSticky isStriped>
        <TableHeader>
          <TableColumn>Inquilino</TableColumn>
          <TableColumn>Habitación</TableColumn>
          <TableColumn>Precio</TableColumn>
          <TableColumn>Aceptar</TableColumn>
        </TableHeader>
        <TableBody>
          {chatList.map((chat) => (
            <TableRow key={chat.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src="https://i.imgur.com/q3QmUAf.jpeg"
                    alt={chat.participantDetails[1]?.name || "Inquilino"}
                    width={40}
                    height={40}
                    className="rounded-full"
                    objectFit="contain"
                  />
                  <div>
                    <p className="font-semibold">{chat.participantDetails[1]?.name}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-semibold">{chat.roomDetails?.title}</p>
                  <Tooltip content={chat.roomDetails?.location || ""} placement="top-start">
                    <p className="text-sm text-default-400">
                      {truncateText(chat.roomDetails?.location || "", 40)}
                    </p>
                  </Tooltip>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="text-sm text-bold text-green-500">
                    ${chat.roomDetails?.price} MXN
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <Tooltip content="Aceptar solicitud" color="success">
                    <span
                      className="cursor-pointer text-2xl text-success active:opacity-50"
                      onClick={() => handleApprove(chat.id, chat.participants[1]?.email, chat.roomDetails?.title)}
                    >
                      <FaCheck />
                    </span>
                  </Tooltip>
                  <Tooltip content="Eliminar solicitud" color="danger">
                    <span
                      className="cursor-pointer text-2xl text-danger active:opacity-50"
                      onClick={() =>
                        setChatList(chatList.filter((c) => c.id !== chat.id))
                      }
                    >
                      <MdCancel />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de Aprobación */}
      {selectedChat && (
        <ApprovalModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          chat={selectedChat} 
        />
      )}
    </div>
  );
};

export default TableRequests;
