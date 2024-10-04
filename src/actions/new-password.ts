"use server"; 

import * as z from "zod"; 
import bcrypt from "bcryptjs"; 

import { NewPasswordSchema } from "@/schemas"; 
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"; 
import { getUserByEmail } from "@/data/users"; 
import { db } from "@/lib/db"; 

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  // Verifica la existencia del token
  if (!token) {
    return { error: "Token inexistente!" };
  }

  // Valida los campos de entrada
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Campos invalidos!" };
  }

  const { password } = validatedFields.data;

  // Obtiene el token de restablecimiento de la base de datos
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return { error: "Token invalido!" };
  }

  // Verifica si el token ha expirado
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "El token ha expirado!" };
  }

  // Busca al usuario por correo asociado al token
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "El correo no existe!" }
  }

  // Hashea la nueva contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Actualiza la contraseña del usuario en la base de datos
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  // Elimina el token de restablecimiento una vez que se ha utilizado
  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Contraseña actualizada correctamente!" };
};
