"use client";

import { motion } from "framer-motion";
import Loader from "@/components/common/Loader";
import { useGetRooms } from "@/components/Rooms/hooks/useGetRoom";
import Image from "next/image";
import { FaRegCopy } from "react-icons/fa";
import { Chip } from "@nextui-org/react";
import { useState } from "react";

const TableRooms = () => {
  const { habitaciones, loading, error } = useGetRooms();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="rounded-[10px] bg-lightlime/70 backdrop-blur-md px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-black/70 dark:backdrop-blur-md dark:shadow-card">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 text-center rounded-[10px] bg-primary text-white px-7.5 shadow-1 dark:bg-dark dark:shadow-card sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Id</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Multimedia</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Titulo</h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium xsm:text-base">Descripción</h5>
          </div>
        </div>

        {habitaciones.map((room, roomId) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              roomId === habitaciones.length - 1 ? "" : "border-b border-stroke dark:border-dark-3"
            }`}
            key={room.roomId}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white text-custom-size">{room.roomId}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <Image
                src={
                  room.roomId
                    ? `data:image/jpeg;base64,${room.multimedia}`
                    : "/images/notImage.png"
                }
                alt={room.title}
                width={88}
                height={88}
                className="rounded-md"
                objectFit="contain"
              />
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{room.title}</p>
            </div>
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{room.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TableRooms;
