"use client";

import { Snippet } from "@nextui-org/snippet";
import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import { useGetOrders } from "@/hooks/orders/useGetOrders";

const ListOrders = () => {
  const { orders, loading, error } = useGetOrders();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 text-center rounded-[10px] bg-indigo-400 text-white shadow-1 dark:bg-gray-7 dark:shadow-card">
          <div className="p-2.5 xl:p-5 col-span-1">
            <h5 className="text-sm font-medium uppercase xsm:text-base">ID</h5>
          </div>
          <div className="p-2.5 xl:p-5 col-span-1">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Fecha de Orden</h5>
          </div>
          <div className="p-2.5 xl:p-5 col-span-1">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Monto Final</h5>
          </div>
          <div className="p-2.5 xl:p-5 col-span-1">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Tipo de Pago</h5>
          </div>
        </div>

        {orders.map((order, key) => (
          <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
            className={`grid grid-cols-4 gap-2 border-b border-stroke dark:border-dark-3 p-2.5 xl:p-5 ${
              key === orders.length - 1 ? "" : "border-b"
            }`}
            key={order.orderId}
          >
            <div className="flex items-center justify-center col-span-1">
              <Snippet
                codeString={order.orderId.toString()}
                hideSymbol
                hideCopyButton={false}
                //@ts-ignore
                copyButtonProps={{ auto: true }}
              >
               {"#"+order.orderId.toString()}
              </Snippet>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <p className="text-black dark:text-white">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <p className="text-black dark:text-white">${order.finalAmount.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-center col-span-1">
              <p className="text-black dark:text-white">{order.paymentType}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ListOrders;
