"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { unstable_update } from "@/auth";
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/users";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (
  values: z.infer<typeof SettingsSchema>
) => {
  const user = await currentUser();

  // Verifica si el usuario está autenticado
  if (!user) {
    return { error: "Accion no permitida" }
  }

  const dbUser = await getUserById(user.id || "");

  // Asegura que el usuario existe en la base de datos
  if (!dbUser) {
    return { error: "Accion no permitida" }
  }

  // Si el usuario se autenticó con OAuth, no se pueden actualizar ciertos campos
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // Verifica si el correo ha cambiado y si ya está en uso
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "El correo ya esta en uso!" }
    }

    // Genera y envía un token de verificación al nuevo correo
    const verificationToken = await generateVerificationToken(
      values.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { success: "Correo de verificación enviado!" };
  }

  // Verifica la contraseña actual antes de permitir un cambio
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Contraseña incorrecta!" };
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  // Actualiza los datos del usuario en la base de datos
  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    }
  });

  // Actualiza el estado del usuario en la sesión
  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      role: updatedUser.role,
    }
  });

  return { success: "Cambios realizados correctamente!" }
}
