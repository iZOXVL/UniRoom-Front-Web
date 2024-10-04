import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/users"
import Google from "next-auth/providers/google";

// Configuración de NextAuth para autenticación
export default {
  providers: [
    // Proveedor de autenticación de Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Proveedor de autenticación con credenciales
    Credentials({
      async authorize(credentials) {
        // Valida los campos de entrada usando el esquema de inicio de sesión
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const user = await getUserByEmail(email);
          
          // Verifica si el usuario existe y tiene una contraseña
          if (!user || !user.password) return null;

          // Compara la contraseña ingresada con la almacenada
          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          );

          // Devuelve el usuario si las contraseñas coinciden
          if (passwordsMatch) return user;
        }
        return null; // Devuelve null si la validación falla
      }
    })
  ],
} satisfies NextAuthConfig; // Asegura que la configuración satisface el tipo NextAuthConfig
