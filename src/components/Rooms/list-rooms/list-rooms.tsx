"use client";

import React, { useMemo, useState } from "react";
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
} from "@nextui-org/react";
import Image from "next/image";
import useGetRooms from "@/components/Rooms/hooks/useGetRoom";
import Loader from "@/components/common/Loader";
import { FaPlus, FaSearch } from "react-icons/fa";
import Link from "next/link";

const TableRooms = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4); // Número de elementos por página
  const [filterValue, setFilterValue] = useState("");
  const { habitaciones, totalRooms, loading, error } = useGetRooms(page, pageSize); // Ajusta para obtener totalRooms de la API

  const filteredItems = useMemo(() => {
    if (!filterValue) return habitaciones;
    return habitaciones.filter((room) =>
      room.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, habitaciones]);

  const handlePageSizeChange = (size:number) => {
    setPageSize(size); // Cambia el tamaño de página según la selección
    setPage(1); // Reinicia la paginación cuando cambie el tamaño de página
  };

  const pageSizeOptions = [
    { key: "5", label: "5" },
    { key: "10", label: "10" },
    { key: "15", label: "15" },
    { key: "30", label: "30" },
    { key: "50", label: "50" },
  ];

  const selectedPageSize = pageSizeOptions.find((option) => option.key === String(pageSize))?.label || "4";

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div>
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
              <Button variant="bordered">
                {selectedPageSize} por página
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Selecciona cuántos registros mostrar por página"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([String(pageSize)])}
              onSelectionChange={(key) => handlePageSizeChange(Number(Array.from(key).join()))}
            >
              {pageSizeOptions.map((option) => (
                <DropdownItem key={option.key}>{option.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
    

        {/* Botón para añadir habitación */}
        <Link href="/rooms/add-room" passHref>
          <Button color="primary" startContent={<FaPlus />}>
            Añadir habitación
          </Button>
        </Link>
      </div>

      <Table aria-label="Table of Rooms" isHeaderSticky isStriped>
        <TableHeader>
          <TableColumn>Id</TableColumn>
          <TableColumn>Portada</TableColumn>
          <TableColumn>Título</TableColumn>
          <TableColumn>Descripción</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredItems.map((room) => (
            <TableRow key={room.roomId}>
              <TableCell>{room.roomId}</TableCell>
              <TableCell>
                <Image
                  src={room.multimedia || "/images/notImage.png"}
                  alt={room.title}
                  width={88}
                  height={88}
                  className="rounded-md"
                  objectFit="contain"
                />
              </TableCell>
              <TableCell>{room.title}</TableCell>
              <TableCell>{room.description}</TableCell>
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
