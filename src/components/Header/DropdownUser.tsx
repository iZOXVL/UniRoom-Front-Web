import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { FaClipboardUser, FaGear } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { RiArrowDownSLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";

const DropdownUser = () => {
  const user = useCurrentUser();
  const onClick = () => {
    logout();
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const arrowVariants = {
    open: { rotate: 180, transition: { duration: 0.3 } },
    closed: { rotate: 0, transition: { duration: 0.3 } }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={user?.image || "https://avatar.iran.liara.run/public"}
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="User"
            className="overflow-hidden rounded-full"
          />
        </span>

        <span className="flex items-center gap-2 font-medium text-dark dark:text-dark-6">
        <span className="hidden lg:block">{user?.name}</span>
          <motion.span
            variants={arrowVariants}
            initial="closed"
            animate={dropdownOpen ? "open" : "closed"}
            className="fill-current"
          >
            <RiArrowDownSLine className="duration-200 ease-in" />
          </motion.span>
        </span>
      </Link>

      <motion.div
        variants={dropdownVariants}
        initial="closed"
        animate={dropdownOpen ? "open" : "closed"}
        className="absolute right-0 mt-7.5 flex w-[280px] flex-col rounded-lg border-[0.5px] border-stroke bg-white shadow-default dark:border-dark-3 dark:bg-gray-dark"
      >
        <div className="flex items-center gap-2.5 px-5 pb-5.5 pt-3.5">
          <span className="relative block h-12 w-12 rounded-full">
            <Image
              width={112}
              height={112}
              src={user?.image || "https://avatar.iran.liara.run/public"}
              style={{
                width: "auto",
                height: "auto",
              }}
              alt="User"
              className="overflow-hidden rounded-full"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-gray-dark"></span>
          </span>
          <span className="block">
            <span className="block font-medium text-dark dark:text-white">
            {user?.name}
            </span>
            <span className="block font-medium text-dark-5 dark:text-dark-6">
            {user?.email}
            </span>
          </span>
        </div>
        <ul className="flex flex-col gap-1 border-y-[0.5px] border-stroke p-2.5 dark:border-dark-3">

          <li>
            <Link
              href="/settings"
              className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base"
            >
              <FaGear />
              Configuración
            </Link>
          </li>
        </ul>
        <div className="p-2.5">
          <button onClick={onClick} className="flex w-full items-center gap-2.5 rounded-[7px] p-2.5 text-sm font-medium text-dark-4 duration-300 ease-in-out hover:bg-gray-2 hover:text-dark dark:text-dark-6 dark:hover:bg-dark-3 dark:hover:text-white lg:text-base">
            <IoLogOut />
            Cerrar sesión
          </button>
        </div>
      </motion.div>
    </ClickOutside>
  );
};

export default DropdownUser;
