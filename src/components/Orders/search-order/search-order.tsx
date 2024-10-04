"use client";

import { useState } from 'react';
import { Chip, Snippet } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useToast } from '@chakra-ui/react';
import { useSearchOrder } from '@/hooks/orders/useSearchOrder';

const SearchOrder = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [searchId, setSearchId] = useState<string>("");
  const { order, loading, error } = useSearchOrder(searchId);
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) {
      toast({
        title: "Error",
        description: "Por favor, ingrese un ID de orden",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setSearchId(orderId);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <form onSubmit={handleSubmit} className="p-6.5">
            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
              <div className="w-full">
                <label className="block text-body-sm font-medium text-dark dark:text-white">
                  ID de la orden
                </label>
                <input
                  type="text"
                  placeholder="Ingrese el ID de la orden"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="mt-5 w-full rounded-[7px] bg-slate-50 border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-5 w-full inline-flex justify-center rounded-md bg-primary px-10 py-4 text-center text-white hover:bg-opacity-90"
            >
              Buscar Orden
            </button>
          </form>
        </div>
        {loading && <div className="text-center"></div>}
        {error && <div className="text-center text-red-500">Error: {error.message}</div>}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card w-full"
          >
            <div className="flex flex-col">
              <div className="grid grid-cols-4 text-center rounded-t-[10px] bg-indigo-400 text-white shadow-1 dark:bg-gray-7 dark:shadow-card sm:grid-cols-4">
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">ID de la orden</h5>
                </div>
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Fecha de la orden</h5>
                </div>
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Monto final</h5>
                </div>
                <div className="p-2.5 xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">Tipo de pago</h5>
                </div>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-4 border-b border-stroke dark:border-dark-3">
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <Snippet
                    codeString={order.orderId.toString()}
                    hideSymbol
                    hideCopyButton={false}
                    //@ts-ignore
                    copyButtonProps={{ auto: true }}
                  >
                    {order.orderId}
                  </Snippet>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">${order.finalAmount.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-center p-2.5 xl:p-5">
                  <p className="text-black dark:text-white">{order.paymentType}</p>
                </div>
              </div>
              <div className="p-5 w-full">
                <h3 className="text-lg font-bold">Detalles de la Orden</h3>
                <div className="flex flex-col gap-2 mt-2">
                  <Chip color="primary">Últimos 4 dígitos de la tarjeta: {order.cardLast4Digits}</Chip>
                  <Chip color="success">Cupón aplicado: null</Chip>
                  <Chip color="warning">Monto del descuento: ${order.discountAmount.toFixed(2)}</Chip>
                  <Chip color="default">Dirección de envío: {order.address}</Chip>
                </div>
                <h3 className="text-lg font-bold mt-4">Detalles de los artículos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 w-full">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="border p-3 rounded-md w-full">
                      <Chip color="primary">
                        {item.bookId}
                      </Chip>
                      <p className="ml-3 text-black dark:text-white">Cantidad: {item.quantity}</p>
                      <p className="ml-3 text-black dark:text-white">Precio unitario: ${item.unitPrice.toFixed(2)}</p>
                      <p className="ml-3 text-black dark:text-white">Precio total: ${item.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default SearchOrder;
