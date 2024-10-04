"use server"; // Archivo ejecutado en el servidor

import { signOut } from "@/auth"; // Importa la función de cierre de sesión

export const logout = async () => {
  await signOut(); // Ejecuta el cierre de sesión
};
