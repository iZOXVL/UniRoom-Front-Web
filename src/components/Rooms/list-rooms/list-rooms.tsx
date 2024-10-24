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
} from "@nextui-org/react";
import Image from "next/image";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import useGetRooms from "@/components/Rooms/hooks/useGetRoom";
import { useCurrentUser } from "@/hooks/use-current-user"; 
import { MdDelete } from "react-icons/md";

// Función para truncar texto y mostrar un tooltip si es muy largo
const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const TableRooms = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [pendingCounts, setPendingCounts] = useState<{ [key: string]: number }>({});
  const [approvedCounts, setApprovedCounts] = useState<{ [key: string]: number }>({});
  
  const { habitaciones, totalRooms, loading, error } = useGetRooms(page, pageSize);
  const user = useCurrentUser(); 

  const filteredItems = useMemo(() => {
    if (!filterValue) return habitaciones;
    return habitaciones.filter((room) =>
      room.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, habitaciones]);

  // Obtener los contadores de solicitudes pendientes y aprobadas
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.JwtToken) return;

      try {
        const response = await fetch(`https://uniroom-backend-services.onrender.com/chats/${user.JwtToken}`);
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

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div>
      <Breadcrumb pageName="Mis habitaciones" />
      <div className="flex justify-between gap-3 items-end mb-4">
        {/* Barra de búsqueda */}
        <Input
          isClearable
          placeholder="Buscar por título..."
          startContent={<FaSearch />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />

        {/* Dropdown para seleccionar la cantidad de registros por página */}
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">{pageSize} por página</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Selecciona cuántos registros mostrar por página"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={new Set([String(pageSize)])}
            onSelectionChange={(key) => setPageSize(Number(Array.from(key).join()))}
          >
            <DropdownItem key="5">5</DropdownItem>
            <DropdownItem key="10">10</DropdownItem>
            <DropdownItem key="15">15</DropdownItem>
            <DropdownItem key="30">30</DropdownItem>
            <DropdownItem key="50">50</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {/* Botón para añadir habitación */}
        <Link href="/rooms/add-room" passHref>
          <Button color="primary" startContent={<FaPlus />}>
            Añadir habitación
          </Button>
        </Link>
      </div>

      <Table aria-label="Tabla de habitaciones" isHeaderSticky isStriped>
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
              {/* Imagen de la habitación */}
              <TableCell>
                <Image
                  src={room.multimedia || "/images/notImage.png"}
                  alt={room.title}
                  width={88}
                  height={88}
                  className="rounded-md"
                  objectFit="cover"
                />
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-semibold">{room.title}</p>
                  <Tooltip content={room.address || ""} placement="top-start">
                    <p className="text-sm text-default-400">
                      {truncateText(room.address || "", 40)}
                    </p>
                  </Tooltip>
                </div>
              </TableCell>

              {/* Estado */}
              <TableCell>
                <Chip color={room.status ? "success" : "warning"}>
                  {room.status}
                </Chip>
              </TableCell>

              {/* Solicitudes */}
              <TableCell>
                <Chip color="warning" variant="flat">
                Solicitudes: {pendingCounts[room.roomId] || 0}
                </Chip>
                <Chip color="success" variant="flat" className="ml-2">
                  Chats: {approvedCounts[room.roomId] || 0}
                </Chip>
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Tooltip content="Editar habitación" color="primary">
                    <span className="cursor-pointer text-2xl text-primary active:opacity-50">
                      <FaEdit />
                    </span>
                  </Tooltip>
                  <Tooltip content="Eliminar habitación" color="danger">
                    <span className="cursor-pointer text-2xl text-danger active:opacity-50">
                      <MdDelete />
                    </span>
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
    </div>
  );
};

export default TableRooms;
