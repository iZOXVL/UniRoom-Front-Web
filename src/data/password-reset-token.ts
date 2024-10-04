import { db } from "@/lib/db";

// Obtiene un token de restablecimiento de contraseña usando el token
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken; // Retorna el token encontrado
  } catch {
    return null; // Retorna null en caso de error
  }
};

// Obtiene el primer token de restablecimiento de contraseña asociado a un correo
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email }
    });

    return passwordResetToken; // Retorna el token encontrado
  } catch {
    return null; // Retorna null en caso de error
  }
};
