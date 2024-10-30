"use client";

import React, { useState, useEffect } from "react";
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, 
  Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button 
} from "@nextui-org/react";
import useGetPendingRequests from "@/components/Admin/hooks/useGetRequests";
import Image from "next/image";
import Loader from "@/components/common/Loader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FaCheck } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import ApprovalModal from "@/components/ui/approval-modal";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";

const truncateText = (text:string, maxLength:number) => 
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const TableRequests = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);
  const { chats, loading, error } = useGetPendingRequests(selectedRoomId);
  const [chatList, setChatList] = useState(chats);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomTitle, setSelectedRoomTitle] = useState("Todas");

  useEffect(() => {
    if (chats) setChatList(chats);
  }, [chats]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const handleRoomChange = (roomId?: string, title?: string) => {
    setSelectedRoomId(roomId); // roomId será undefined si "Todas" está seleccionado
    setSelectedRoomTitle(title || "Todas");
  };

  const handleApprove = async (chatId:string, email:string, title:string) => {
    try {
      const response = await axios.post("https://uniroom-backend-services.onrender.com/update-status", {
        chatId, email, title, status: "approved",
      });
      if (response.data.status === "success") {
        setChatList(chatList.filter(chat => chat.id !== chatId));
        setSelectedChat(response.data.chat);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error al aprobar la solicitud:", error);
    }
  };

  const handleReject = async (chatId:string, email:string, title:string) => {
    try {
      const response = await axios.post("https://uniroom-backend-services.onrender.com/update-status", {
        chatId, email, title, status: "refused",
      });
      if (response.data.status === "success") {
        setChatList(chatList.filter(chat => chat.id !== chatId));
      }
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <Breadcrumb pageName="Mis solicitudes" />

      <div className="mb-4">
      <Dropdown backdrop="opaque">
  <DropdownTrigger>
    <Button color={"default"} variant="flat" className="w-64">
      {truncateText(selectedRoomTitle || "", 25)}
      <IoIosArrowDown className="ml-1" />
    </Button>
  </DropdownTrigger>
  <DropdownMenu aria-label="Cambiar habitación">
    <DropdownItem onClick={() => handleRoomChange()}>Todas</DropdownItem>
    {chats.map(chat => (
      <DropdownItem 
        key={chat.roomId} 
        onClick={() => handleRoomChange(chat.roomId, chat.roomDetails.title)}
      >
        {chat.roomDetails.title}
      </DropdownItem>
    ))}
  </DropdownMenu>
</Dropdown>

      </div>

      {chatList.length > 0 ? (
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
                        onClick={() => handleReject(chat.id, chat.participants[1]?.email, chat.roomDetails?.title)}
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
      ) : (
        <div className="text-center text-gray-500">No hay solicitudes pendientes.</div>
      )}

      {selectedChat && (
        <ApprovalModal isOpen={isModalOpen} onClose={closeModal} chat={selectedChat} />
      )}
    </div>
  );
};

export default TableRequests;
