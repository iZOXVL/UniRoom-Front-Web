import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

// Genera un token de dos factores y lo almacena en la base de datos
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString(); // Crea un token numérico
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // Establece la expiración a 5 minutos

  const existingToken = await getTwoFactorTokenByEmail(email); // Busca un token existente

  if (existingToken) {
    // Elimina el token existente si lo hay
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      }
    });
  }

  // Crea y devuelve el nuevo token de dos factores
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return twoFactorToken;
}

// Genera un token de restablecimiento de contraseña y lo almacena en la base de datos
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4(); // Crea un token único
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Establece la expiración a 1 hora

  const existingToken = await getPasswordResetTokenByEmail(email); // Busca un token existente

  if (existingToken) {
    // Elimina el token existente si lo hay
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  // Crea y devuelve el nuevo token de restablecimiento de contraseña
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return passwordResetToken;
}

// Genera un token de verificación y lo almacena en la base de datos
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4(); // Crea un token único
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Establece la expiración a 1 hora

  const existingToken = await getVerificationTokenByEmail(email); // Busca un token existente

  if (existingToken) {
    // Elimina el token existente si lo hay
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Crea y devuelve el nuevo token de verificación
  const verficationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return verficationToken;
};
