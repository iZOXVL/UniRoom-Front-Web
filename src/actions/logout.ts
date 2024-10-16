"use server"; // Archivo ejecutado en el servidor

import { signOut } from "@/auth"; // Importa la función de cierre de sesión
import { db } from "@/lib/db"; // Importa la instancia de la base de datos
import { getUserById } from "@/data/users"; // Función que obtiene al usuario actual

export const logout = async (userId: string) => {
  // Elimina todos los JWT tokens asociados con el usuario
  await db.jwtToken.deleteMany({
    where: {
      userId: userId, // Borra todos los JWT asociados al usuario
    },
  });

  await signOut(); // Ejecuta el cierre de sesión
};
