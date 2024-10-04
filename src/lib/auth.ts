import { auth } from "@/auth";

// Devuelve el usuario actual de la sesión
export const currentUser = async () => {
  const session = await auth(); // Obtiene la sesión actual

  return session?.user; // Retorna el usuario, si existe
};

// Devuelve el rol del usuario actual de la sesión
export const currentRole = async () => {
  const session = await auth(); // Obtiene la sesión actual

  return session?.user?.role; // Retorna el rol del usuario, si existe
};
