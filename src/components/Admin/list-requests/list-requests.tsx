"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Select,
  SelectItem,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import useGetPendingRequests from "@/components/Admin/hooks/useGetPendingRequests";
import useGetAllRooms from "@/components/Admin/hooks/useGetAllRooms";
import Image from "next/image";
import Loader from "@/components/common/Loader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FaCheck, FaSearch } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import ApprovalModal from "@/components/ui/approval-modal";

const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

const TableRequests = () => {
  const [selectedRoomIds, setSelectedRoomIds] = useState<Set<string>>(new Set());
  const [roomIdsToFilter, setRoomIdsToFilter] = useState<string[]>([]);
  const { chats, loading, error } = useGetPendingRequests(roomIdsToFilter);
  const { rooms, loading: roomsLoading, error: roomsError } = useGetAllRooms();
  const [chatList, setChatList] = useState(chats);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  // Estado para el modal de confirmación
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChatEmail, setSelectedChatEmail] = useState<string | null>(null);
  const [selectedChatTitle, setSelectedChatTitle] = useState<string | null>(null);
  const [selectedTenantName, setSelectedTenantName] = useState<string | null>(null);

  // Estado para la barra de búsqueda
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (chats) setChatList(chats);
  }, [chats]);

  // Filtrar los chats según el valor de búsqueda y los chats disponibles
  const filteredChats = useMemo(() => {
    if (!filterValue) return chatList;
    return chatList.filter((chat) =>
      chat.roomDetails?.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, chatList]);

  if (error)
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );

  if (roomsError)
    return (
      <div className="text-center text-red-500">Error: {roomsError.message}</div>
    );

  const handleRoomChange = (roomIds: Set<string>) => {
    setSelectedRoomIds(roomIds);
  };

  const handleApplyFilter = () => {
    setRoomIdsToFilter(Array.from(selectedRoomIds));
  };

  const handleApprove = async (
    chatId: string,
    email: string,
    title: string
  ) => {
    try {
      const response = await axios.post(
        "https://uniroom-backend-services.onrender.com/update-status",
        {
          chatId,
          email,
          title,
          status: "approved",
        }
      );
      if (response.data.status === "success") {
        setChatList(chatList.filter((chat) => chat.id !== chatId));
        setSelectedChat(response.data.chat);
        setIsModalOpen(true);
        toast({
          title: "Solicitud Aprobada",
          description: `La solicitud para la habitación ${title} ha sido aprobada con éxito.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al aprobar la solicitud:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al aprobar la solicitud.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (
    chatId: string,
    email: string,
    title: string
  ) => {
    try {
      const response = await axios.post(
        "https://uniroom-backend-services.onrender.com/update-status",
        {
          chatId,
          email,
          title,
          status: "refused",
        }
      );
      if (response.data.status === "success") {
        setChatList(chatList.filter((chat) => chat.id !== chatId));
        toast({
          title: "Solicitud Rechazada",
          description: `La solicitud para la habitación ${title} ha sido rechazada.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al rechazar la solicitud.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleConfirmAction = async () => {
    if (!selectedChatId || !selectedChatEmail || !selectedChatTitle || !actionType) {
      return;
    }

    if (actionType === "approve") {
      await handleApprove(selectedChatId, selectedChatEmail, selectedChatTitle);
    } else if (actionType === "reject") {
      await handleReject(selectedChatId, selectedChatEmail, selectedChatTitle);
    }
    setIsConfirmModalOpen(false);
  };

  return (
    <div>
      <Breadcrumb pageName="Mis solicitudes" />

      {/* Contenedor para los filtros y la barra de búsqueda */}
      <div className="flex gap-2 items-center mb-4">
        {/* Barra de búsqueda */}
        <Input
          isClearable
          placeholder="Buscar por título..."
          startContent={<FaSearch />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          size="lg"
          onValueChange={setFilterValue}
          className="flex-grow h-12"
        />

        {/* Filtro de habitaciones */}
        <Select
          label="Filtrar por habitación"
          placeholder="Selecciona una habitación"
          selectionMode="multiple"
          className="w-2/4"
          size="sm"
          selectedKeys={selectedRoomIds}
          onSelectionChange={(keys) =>
            handleRoomChange(new Set(keys as unknown as string[]))
          }
        >
          {rooms.map((room) => (
            <SelectItem key={room.roomId} value={room.roomId}>
              {room.title}
            </SelectItem>
          ))}
        </Select>

        {/* Botón de filtro */}
        <Button
          onClick={handleApplyFilter}
          className="w-auto"
          size="lg"
          color="primary"
        >
          Aplicar
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : filteredChats && filteredChats.length > 0 ? (
        <>
          <Table
            aria-label="Tabla de Solicitudes Pendientes"
            isHeaderSticky
            isStriped
            classNames={{
              base: "max-h-[520px] overflow-auto",
              table: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn>Inquilino</TableColumn>
              <TableColumn>Habitación</TableColumn>
              <TableColumn>Precio</TableColumn>
              <TableColumn>Aceptar</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredChats.map((chat) => (
                <TableRow key={chat.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://i.imgur.com/q3QmUAf.jpeg"
                        alt={chat.participants[1]?.name || "Inquilino"}
                        width={40}
                        height={40}
                        className="rounded-full"
                        objectFit="contain"
                      />
                      <div>
                        <p className="font-semibold">
                          {chat.participants[1]?.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{chat.roomDetails?.title}</p>
                      <Tooltip
                        content={chat.roomDetails?.location || ""}
                        placement="top-start"
                      >
                        <p className="text-sm text-default-400">
                          {truncateText(
                            chat.roomDetails?.location || "",
                            40
                          )}
                        </p>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-bold text-green-500">
                        ${chat.roomDetails?.price} MXN
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Tooltip content="Aceptar solicitud" color="success">
                        <span
                          className="cursor-pointer text-2xl text-success active:opacity-50"
                          onClick={() => {
                            setActionType("approve");
                            setSelectedChatId(chat.id);
                            setSelectedChatEmail(chat.participants[1]?.email);
                            setSelectedChatTitle(chat.roomDetails?.title);
                            setSelectedTenantName(chat.participants[1]?.name);
                            setIsConfirmModalOpen(true);
                          }}
                        >
                          <FaCheck />
                        </span>
                      </Tooltip>
                      <Tooltip content="Eliminar solicitud" color="danger">
                        <span
                          className="cursor-pointer text-2xl text-danger active:opacity-50"
                          onClick={() => {
                            setActionType("reject");
                            setSelectedChatId(chat.id);
                            setSelectedChatEmail(chat.participants[1]?.email);
                            setSelectedChatTitle(chat.roomDetails?.title);
                            setSelectedTenantName(chat.participants[1]?.name);
                            setIsConfirmModalOpen(true);
                          }}
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
        </>
      ) : (
        <div className="text-center text-gray-500">
          No hay solicitudes pendientes.
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal isOpen={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen} backdrop="blur">
        <ModalContent>
          <ModalHeader>
            {actionType === "approve"
              ? "Confirmar aprobación"
              : "Confirmar rechazo"}
          </ModalHeader>
          <ModalBody>
            <p>
              ¿Estás seguro de que quieres{" "}
              {actionType === "approve" ? "aprobar" : "rechazar"} la solicitud de{" "}
              <strong className="text-primary">{selectedTenantName}</strong> para la habitación{" "}
              <strong className="text-primary">{selectedChatTitle}</strong>?
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              color="danger"
              onPress={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button color="primary" onPress={handleConfirmAction}>
              {actionType === "approve" ? "Aprobar" : "Rechazar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de aprobación (si decides mantenerlo) */}
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
