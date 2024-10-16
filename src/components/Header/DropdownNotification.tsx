import { useState } from "react";
import Link from "next/link";
import ClickOutside from "@/components/ClickOutside";
import Image from "next/image";
import { IoNotificationsOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const notificationList = [
  {
    title: "Tienes una nueva notificación"
  }
];

const DropdownNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const dropdownVariants = {
    open: {
      opacity: 1,
      scale: 1,
      display: "flex",
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3
      },
      transitionEnd: {
        display: "none"
      }
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative hidden sm:block">
      <li>
        <Link
          onClick={() => {
            setNotifying(false);
            setDropdownOpen(!dropdownOpen);
          }}
          href="#"
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-stroke bg-gray-2 text-dark hover:text-primary dark:border-dark-4 dark:bg-dark-3 dark:text-white dark:hover:text-white"
        >
          <span className="relative">
            <IoNotificationsOutline className="h-6 w-6" />

            <span
              className={`absolute -top-0.5 right-0 z-1 h-2.5 w-2.5 rounded-full border-2 border-gray-2 bg-red-light dark:border-dark-3 ${
                !notifying ? "hidden" : "inline"
              }`}
            >
              <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-red-light opacity-75"></span>
            </span>
          </span>
        </Link>

        <motion.div
          variants={dropdownVariants}
          initial="closed"
          animate={dropdownOpen ? "open" : "closed"}
          className="absolute -right-27 mt-10 flex h-auto w-75 flex-col rounded-xl border-[0.5px] border-stroke bg-white px-5.5 pb-5.5 pt-5 shadow-default dark:border-dark-3 dark:bg-gray-dark sm:right-0 sm:w-[364px]"
        >
          <div className="mb-5 flex items-center justify-between">
            <h5 className="text-lg font-medium text-dark dark:text-white">
              Notificaciones
            </h5>
            <span className="rounded-md bg-primary px-2 py-0.5 text-body-xs font-medium text-white">
              1 Nueva
            </span>
          </div>

          <ul className="no-scrollbar mb-5 flex h-auto flex-col gap-1 overflow-y-auto">
            {notificationList.map((item, index) => (
              <li key={index}>
                <Link
                  className="flex items-center gap-4 rounded-[10px] p-2.5 hover:bg-gray-2 dark:hover:bg-dark-3"
                  href="#"
                >

                  <span className="block">
                    <span className="block font-medium text-dark dark:text-white">
                      {item.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            className="flex items-center justify-center rounded-[7px] border border-primary p-2.5 font-medium text-primary hover:bg-blue-light-5 dark:border-dark-4 dark:text-dark-6 dark:hover:border-primary dark:hover:bg-blue-light-3 dark:hover:text-primary"
            href="#"
          >
            Mostrar todas las notificaciones
          </Link>
        </motion.div>
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
