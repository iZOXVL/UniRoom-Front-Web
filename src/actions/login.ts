"use server"; // Archivo ejecutado en el servidor

import * as z from "zod"; 
import bcrypt from "bcryptjs"; // Importa bcrypt para verificar contraseñas
import { AuthError } from "next-auth"; 

import { db } from "@/lib/db"; 
import { signIn } from "@/auth"; 
import { LoginSchema } from "@/schemas"; 
import { getUserByEmail } from "@/data/users"; 
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"; 
import { 
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/lib/mail"; 
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"; 
import { 
  generateVerificationToken,
  generateTwoFactorToken
} from "@/lib/tokens"; 
import { 
  getTwoFactorConfirmationByUserId
} from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  
  const validateFields = LoginSchema.safeParse(values); // Validación de campos

  if (!validateFields.success) {
    return { error: "Credenciales inválidas" }; // Retorna error si la validación falla
  }

  const { email, password, code } = validateFields.data; // Desestructura los datos validados

  const existingUser = await getUserByEmail(email); // Busca el usuario por correo

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Credenciales inexistentes" }; // Retorna error si el usuario no existe
  }

  // Verifica el rol del usuario. Si es "ESTUDIANTE", bloquea el acceso
  if (existingUser.role === "ESTUDIANTE") {
    return { error: "Su rol no pertenece a esta plataforma" }; // Mensaje para el rol no permitido
  }

  // Verificación de la contraseña con bcrypt
  const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordCorrect) {
    return { error: "Credenciales inválidas" }; // Retorna error si la contraseña es incorrecta y no procede con el 2FA
  }

  if (!existingUser.emailVerified) { // Verifica si el correo del usuario está verificado
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: "¡Correo de confirmación enviado" }; // Retorna mensaje de envío de verificación
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) { // Verifica si el 2FA está habilitado
    if (code) { // Si se proporciona un código de 2FA
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email); // Obtiene el token de 2FA
    
      if (!twoFactorToken) {
        return { error: "Código inválido" }; // Retorna error si el token no existe
      }
    
      if (twoFactorToken.token !== code) {
        return { error: "Código inválido" }; // Retorna error si el código no coincide, no envía un nuevo token
      }
    
      const hasExpired = new Date(twoFactorToken.expires) < new Date(); // Verifica si el código ha expirado
    
      if (hasExpired) {
        return { error: "El código ha expirado" }; // Retorna error si el código ha expirado
      }
    
      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } }); // Elimina el token de 2FA
    
      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id); // Verifica la confirmación de 2FA
    
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } }); // Elimina la confirmación existente
      }
    
      await db.twoFactorConfirmation.create({ // Crea una nueva confirmación de 2FA
        data: {
          userId: existingUser.id,
        }
      });
    } else { // Si no se proporciona código, envía un nuevo token de 2FA
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true }; // Indica que se envió un token de 2FA
    }
  }

  try {
    await signIn("credentials", { // Intenta iniciar sesión con las credenciales
      email, 
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas" }; // Retorna error si las credenciales son inválidas
        default:
          return { error: "Ha ocurrido un error en el servidor" }; // Retorna error genérico
      }
    }
    throw error; // Lanza cualquier otro error
  }
};
