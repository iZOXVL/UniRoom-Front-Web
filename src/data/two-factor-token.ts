import { db } from "@/lib/db";

// Obtiene el token de dos factores usando el token proporcionado
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token }
    });

    return twoFactorToken; // Retorna el token encontrado
  } catch {
    return null; // Retorna null en caso de error
  }
};

// Obtiene el token de dos factores usando el correo asociado
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email }
    });

    return twoFactorToken; // Retorna el primer token encontrado
  } catch {
    return null; // Retorna null en caso de error
  }
};
