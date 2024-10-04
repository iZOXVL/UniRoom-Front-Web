import { useSession } from "next-auth/react";

// Devuelve los datos del usuario actual de la sesión
export const useCurrentUser = () => {
  const session = useSession(); // Obtiene la sesión actual

  return session.data?.user; // Retorna los datos del usuario, si existen
};
