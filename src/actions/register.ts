"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/users";
import { sendVerificationEmail } from "@/lib/mail";
import { UserRole } from "@prisma/client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Valida los campos de registro
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Campos invalidos!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Verifica si el usuario ya existe
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "El correo ya está en uso!" };
  }

  // Crea un nuevo usuario en la base de datos
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: UserRole.ARRENDADOR,
    },
  });
  
  // Genera un token de verificación y envía un correo de confirmación
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  );

  return { success: "¡Correo de confirmación enviado!" };
};
