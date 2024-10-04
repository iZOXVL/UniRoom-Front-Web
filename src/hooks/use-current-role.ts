import { useSession } from "next-auth/react";

// Devuelve el rol del usuario actual de la sesión
export const useCurrentRole = () => {
  const session = useSession(); // Obtiene la sesión actual

  return session.data?.user?.role; // Retorna el rol del usuario, si existe
};
