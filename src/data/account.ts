import { db } from "@/lib/db";

// Obtiene la cuenta asociada a un ID de usuario
export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId }
    });

    return account; // Retorna la cuenta encontrada
  } catch {
    return null; // Retorna null en caso de error
  }
};
