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
    <header className="sticky top-0 z-50 flex w-full border-b border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark">
      <div className="flex flex-grow items-center justify-between px-4 py-5 shadow-2 md:px-5 2xl:px-10">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
           {/* <!-- Hamburger Toggle BTN --> */}
           <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke p-1.5 shadow-sm dark:border-primary lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-primary delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-primary delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-primary duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}
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
