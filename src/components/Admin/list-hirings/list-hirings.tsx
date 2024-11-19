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
  Tooltip,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Loader from "@/components/common/Loader";
import useGetHirings from "@/components/Admin/hooks/useGetHirings";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@chakra-ui/react";

const TableHirings = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filterValue, setFilterValue] = useState("");
  const [statusByHiring, setStatusByHiring] = useState<{
    [key: number]: string;
  }>({});

  const { hirings, totalHirings, loading, error } = useGetHirings(
    page,
    pageSize
  );
  const user = useCurrentUser();
  const toast = useToast();

  // Filtrar tratos según el valor de búsqueda
  const filteredItems = useMemo(() => {
    if (!filterValue) return hirings || [];
    return (hirings || []).filter((hiring) =>
      hiring.status.toLowerCase().includes(filterValue.toLowerCase())
    );
  }, [filterValue, hirings]);

  // Establecer el estado inicial de los tratos
  useEffect(() => {
    const initialStatus = (hirings || []).reduce((acc, hiring) => {
      acc[hiring.hiringId] = hiring.status;
      return acc;
    }, {} as { [key: number]: string });

    setStatusByHiring(initialStatus);
  }, [hirings]);

  const statusColorMap: {
    [key: string]: "success" | "warning" | "danger" | "default";
  } = {
    Activo: "success",
    Pendiente: "warning",
    Cancelado: "danger",
    Finalizado: "default",
  };

  const handleStatusChange = async (hiringId: number, newStatus: string) => {
    // Implementa la lógica para cambiar el estado si la API lo permite
    // Por ahora, solo actualizamos el estado local
    try {
      setStatusByHiring((prevStatus) => ({
        ...prevStatus,
        [hiringId]: newStatus,
      }));

      toast({
        title: "Éxito",
        description: `El estado del trato ha sido cambiado a ${newStatus}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description:
          "Hubo un problema al actualizar el estado del trato.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const iconClasses = "text-lg text-white pointer-events-none flex-shrink-0";

  return (
    <div>
      <Breadcrumb pageName="Mis tratos" />
      <div className="flex justify-between gap-3 items-end mb-4">
        <Input
          isClearable
          placeholder="Buscar por estado..."
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
      </div>

      {/* Mostrar loader o error en el área de la tabla */}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : (
        <>
          <Table
            aria-label="Tabla de tratos"
            isHeaderSticky
            isStriped
            classNames={{
              base: "max-h-[465px] overflow-auto",
              table: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn>Trato ID</TableColumn>
              <TableColumn>Habitación ID</TableColumn>
              <TableColumn>Inquilino ID</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Precio Mensual</TableColumn>
              <TableColumn>Fecha Inicio</TableColumn>
              <TableColumn>Fecha Fin</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredItems.map((hiring) => (
                <TableRow key={hiring.hiringId}>
                  <TableCell>{hiring.hiringId}</TableCell>
                  <TableCell>{hiring.roomId}</TableCell>
                  <TableCell>{hiring.tenantId}</TableCell>
                  <TableCell>
                    <Dropdown backdrop="opaque">
                      <DropdownTrigger>
                        <Button
                          color={
                            statusColorMap[statusByHiring[hiring.hiringId]] ||
                            "default"
                          }
                          variant="flat"
                          className="w-32"
                        >
                          {statusByHiring[hiring.hiringId] || hiring.status}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Cambiar estado del trato"
                        onAction={(newStatus) =>
                          handleStatusChange(
                            hiring.hiringId,
                            newStatus as string
                          )
                        }
                      >
                        <DropdownItem color="success" key="Activo">
                          Activo
                        </DropdownItem>
                        <DropdownItem color="warning" key="Pendiente">
                          Pendiente
                        </DropdownItem>
                        <DropdownItem color="danger" key="Cancelado">
                          Cancelado
                        </DropdownItem>
                        <DropdownItem key="Finalizado">Finalizado</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                  <TableCell>{hiring.monthlyPrice}</TableCell>
                  <TableCell>
                    {new Date(hiring.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(hiring.endDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="py-4 flex justify-between items-center">
            <span className="text-small text-default-400">
              Total {totalHirings} tratos
            </span>
            <Pagination
              page={page}
              total={Math.ceil(totalHirings / pageSize)}
              onChange={setPage}
              showControls
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TableHirings;
