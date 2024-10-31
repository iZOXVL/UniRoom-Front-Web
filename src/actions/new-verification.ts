"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/users";
import { getVerificationTokenByToken } from "@/data/verification-token";

export const newVerification = async (token: string) => {
  // Busca el token de verificación en la base de datos
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "¡El token no existe!" };
  }

  // Verifica si el token ha expirado
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "¡El token ha expirado!" };
  }

  // Busca al usuario asociado al token
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "¡El correo no existe!" };
  }

  // Actualiza el estado de verificación del correo del usuario
  await db.user.update({
    where: { id: existingUser.id },
    data: { 
      emailVerified: new Date(),
      email: existingToken.email,
    }
  });

  // Elimina el token de verificación de la base de datos
  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Hecho, ¡correo verificado!" };
};
