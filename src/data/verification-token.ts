import { db } from "@/lib/db";

// Obtiene un token de verificación a partir del token proporcionado
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken; // Retorna el token de verificación encontrado
  } catch {
    return null; // Retorna null en caso de error
  }
}

// Obtiene un token de verificación a partir del correo electrónico
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken; // Retorna el token de verificación encontrado
  } catch {
    return null; // Retorna null en caso de error
  }
}
