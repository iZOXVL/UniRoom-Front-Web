"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import useGetRooms from "@/components/Rooms/hooks/useGetRoom";
import { useCurrentUser } from "@/hooks/use-current-user";
import { MdDelete } from "react-icons/md";
import { useToast } from "@chakra-ui/react";
import {
  IoIosArrowDown,
  IoMdCheckmark,
  IoMdClose,
  IoMdPause,
} from "react-icons/io";

// Función para truncar texto
const truncateText = (text: string, maxLength: number) =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

// Mapa para asignar colores según el estado
const statusColorMap: {
  [key: string]: "success" | "warning" | "danger" | "default";
} = {
  Publicada: "success",
  Pausada: "warning",
  Ocupada: "danger",
  Eliminar: "danger",
};

const TableRooms = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [statusByRoom, setStatusByRoom] = useState<{ [key: string]: string }>(
    {}
  );
  const [pendingCounts, setPendingCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [approvedCounts, setApprovedCounts] = useState<{
    [key: string]: number;
  }>({});

  // Estados para el modal utilizando useDisclosure
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState("");

  const { habitaciones, totalRooms, loading, error } = useGetRooms(
    page,
    pageSize
  );
  const user = useCurrentUser();
  const toast = useToast();

  // Filtrar habitaciones según el valor de búsqueda
  const filteredItems = useMemo(() => {
    if (!filterValue) return habitaciones || [];
    return (habitaciones || []).filter((room) =>
      room.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, habitaciones]);

  // Manejar cambio de estado de la habitación
  const handleStatusChange = async (roomId: string, newStatus: string) => {
    if (!user?.JwtToken) return;

    try {
      const response = await fetch(
        "https://uruniroom.azurewebsites.net/api/Rooms/UpdateRoomStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: user.JwtToken,
            roomId,
            status: newStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el estado.");

      setStatusByRoom((prevStatus) => ({
        ...prevStatus,
        [roomId]: newStatus,
      }));

      toast({
        title: "Éxito",
        description: `El estado de la habitación ha sido cambiado a ${newStatus}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          "Hubo un problema al actualizar el estado de la habitación.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  // Obtener conteos de solicitudes y chats aprobados
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.JwtToken) return;

      try {
        const response = await fetch(
          `https://uniroom-backend-services.onrender.com/chats/${user.JwtToken}`
        );
        const data = await response.json();

        const pendingCountsTemp: { [key: string]: number } = {};
        const approvedCountsTemp: { [key: string]: number } = {};

        data.chats.forEach((chat: any) => {
          const roomId = chat.roomId;
          if (chat.status === "pending") {
            pendingCountsTemp[roomId] = (pendingCountsTemp[roomId] || 0) + 1;
          } else if (chat.status === "approved") {
            approvedCountsTemp[roomId] = (approvedCountsTemp[roomId] || 0) + 1;
          }
        });

        setPendingCounts(pendingCountsTemp);
        setApprovedCounts(approvedCountsTemp);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [user?.JwtToken]);

  // Establecer el estado inicial de las habitaciones
  useEffect(() => {
    const initialStatus = (habitaciones || []).reduce((acc, room) => {
      acc[room.roomId] = room.status;
      return acc;
    }, {} as { [key: string]: string });

    setStatusByRoom(initialStatus);
  }, [habitaciones]);

  const iconClasses = "text-lg text-white pointer-events-none flex-shrink-0";

  return (
    <div>
      <Breadcrumb pageName="Mis habitaciones" />
      <div className="flex justify-between gap-3 items-end mb-4" >
        <Input
          isClearable
          placeholder="Buscar por título..."
          startContent={<FaSearch />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />

        <Dropdown backdrop="opaque">
          <DropdownTrigger>
            <Button variant="flat">{pageSize} por página</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Selecciona cuántos registros mostrar por página"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={new Set([String(pageSize)])}
            onSelectionChange={(key) =>
              setPageSize(Number(Array.from(key).join("")))
            }
          >
            <DropdownItem key="5">5</DropdownItem>
            <DropdownItem key="10">10</DropdownItem>
            <DropdownItem key="15">15</DropdownItem>
            <DropdownItem key="30">30</DropdownItem>
            <DropdownItem key="50">50</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Link href="/rooms/add-room" passHref>
          <Button color="primary" startContent={<FaPlus />}>
            Añadir habitación
          </Button>
        </Link>
      </div>

      {/* Mostrar loader o error en el área de la tabla */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500">
          Error: {error.message}
        </div>
      ) : (
        <>
          <Table
            aria-label="Tabla de habitaciones"
            isHeaderSticky
            isStriped
            classNames={{
              base: "max-h-[465px] overflow-auto",
              table: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn>Portada</TableColumn>
              <TableColumn>Habitación</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Solicitudes</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredItems.map((room) => (
                <TableRow key={room.roomId}>
                  <TableCell>
                    <div
                      onClick={() => {
                        setSelectedImage(
                          room.multimedia || "/images/notImage.png"
                        );
                        onOpen();
                      }}
                      className="cursor-pointer"
                    >
                      <Image
                        isZoomed
                        src={room.multimedia || "/images/notImage.png"}
                        alt={room.title}
                        width={108}
                        height={68}
                        className="rounded-md"
                      />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <p className="font-semibold">{room?.title}</p>
                      <Tooltip
                        content={room.address || ""}
                        placement="top-start"
                      >
                        <p className="text-sm text-default-400">
                          {truncateText(room.address || "", 38)}
                        </p>
                      </Tooltip>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Dropdown backdrop="opaque">
                      <DropdownTrigger>
                        <Button
                          color={
                            statusColorMap[statusByRoom[room.roomId]] ||
                            "default"
                          }
                          variant="flat"
                          className="w-32"
                        >
                          {statusByRoom[room.roomId] || room.status}
                          <IoIosArrowDown className="ml-1" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Cambiar estado de la habitación"
                        onAction={(newStatus) =>
                          handleStatusChange(room.roomId, newStatus as string)
                        }
                      >
                        <DropdownItem
                          color="success"
                          description="La habitación está visible para los usuarios."
                          startContent={
                            <IoMdCheckmark className={iconClasses} />
                          }
                          key="Publicada"
                        >
                          Publicada
                        </DropdownItem>
                        <DropdownItem
                          color="warning"
                          showDivider
                          description="La habitación está temporalmente pausada."
                          startContent={<IoMdPause className={iconClasses} />}
                          key="Pausada"
                        >
                          Pausada
                        </DropdownItem>
                        <DropdownItem
                          color="danger"
                          description="La habitación está ocupada."
                          startContent={<IoMdClose className={iconClasses} />}
                          key="Ocupada"
                        >
                          Ocupada
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>

                  <TableCell>
                    <Chip color="warning" variant="flat">
                      Solicitudes: {pendingCounts[room.roomId] || 0}
                    </Chip>
                    <Chip color="success" variant="flat" className="ml-2">
                      Chats: {approvedCounts[room.roomId] || 0}
                    </Chip>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Tooltip content="Editar habitación" color="primary">
                        <Link href={`/rooms/edit-room?roomId=${room.roomId}`}>
                          <span className="cursor-pointer text-2xl text-primary active:opacity-50">
                            <FaEdit />
                          </span>
                        </Link>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="py-4 flex justify-between items-center">
            <span className="text-small text-default-400">
              Total {totalRooms} habitaciones
            </span>
            <Pagination
              page={page}
              total={Math.ceil(totalRooms / pageSize)}
              onChange={setPage}
              showControls
            />
          </div>
        </>
      )}

      {/* Modal para mostrar la imagen ampliada */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Imagen de la habitación</ModalHeader>
              <ModalBody>
                <Image
                  src={selectedImage}
                  alt="Imagen de la habitación"
                  width={400}
                  height={450}
                  className="object-contain rounded-2xl"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="success" variant="light" onPress={onClose}>
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TableRooms;
