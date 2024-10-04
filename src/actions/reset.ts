"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/users";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  // Valida el esquema de datos para la recuperación de contraseña
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Correo invalido!" };
  }

  const { email } = validatedFields.data;

  // Verifica si el usuario existe
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Correo no encontrado!" };
  }

  // Genera un token de restablecimiento de contraseña y envía el correo
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Correo de recuperación enviado!" };
}
