"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

interface LogoutButtonProps {
  children?: React.ReactNode;
};

export const LogoutButton = ({
  children
}: LogoutButtonProps) => {
  const user = useCurrentUser();
  const userId = user?.id; // Obtén el ID del usuario actual de la sesión
  const onClick = () => {
    logout(userId as string);
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};