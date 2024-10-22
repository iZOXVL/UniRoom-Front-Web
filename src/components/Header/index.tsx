import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importamos el idioma español

import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import SearchForm from "@/components/Header/SearchForm";

const Header = (props: { sidebarOpen: string | boolean | undefined; setSidebarOpen: (arg0: boolean) => void }) => {
  const [fechaHora, setFechaHora] = useState({ dia: "", hora: "", fechaCompleta: "" });

  useEffect(() => {
    const actualizarFechaHora = () => {
      const ahora = dayjs().locale("es");

      setFechaHora({
        dia: ahora.format("dddd"),
        hora: ahora.format("h:mm A"),
        fechaCompleta: ahora.format("D [de] MMMM [de] YYYY"),
      });
    };

    actualizarFechaHora(); 
    const intervalo = setInterval(actualizarFechaHora, 1000); 

    return () => clearInterval(intervalo);
  }, []);

  return (
    <header className="sticky top-0 z-999 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-5 shadow-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2 lg:hidden"
          >
            {/* Icono del menú hamburguesa */}
          </button>
        </div>

        {/* Fecha y hora */}
        <div className="hidden xl:flex flex-col items-start">
          <h1 className="text-xl capitalize font-bold text-dark dark:text-white">
            {fechaHora.dia}, {fechaHora.hora}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {fechaHora.fechaCompleta}
          </p>
        </div>

        <div className="flex items-center justify-normal gap-2 2xsm:gap-4 lg:w-full lg:justify-between xl:w-auto xl:justify-normal">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <SearchForm />
            <DarkModeSwitcher />
            <DropdownNotification />
          </ul>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
