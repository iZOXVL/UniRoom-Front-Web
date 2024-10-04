import { db } from "@/lib/db";

// Obtiene la confirmación de dos factores usando el ID del usuario
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId }
    });

    return twoFactorConfirmation; // Retorna la confirmación encontrada
  } catch {
    return null; // Retorna null en caso de error
  }
};
