"use server";

// Importa la función para obtener el rol actual del usuario y el tipo de roles desde Prisma
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

// Función para verificar si el usuario tiene rol de arrendador
export const admin = async () => {
  // Obtiene el rol actual del usuario
  const role = await currentRole();

  // Verifica si el rol es de arrendador
  if (role === UserRole.ARRENDADOR) {
    return { success: "Petición realizada correctamente!" }; // Retorna éxito si tiene el rol adecuado
  }

  // Retorna un error si el rol no es de arrendador
  return { error: "No tienes permiso para realizar esta petición" }
};
