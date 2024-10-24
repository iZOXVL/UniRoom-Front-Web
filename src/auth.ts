import { JwtToken } from './../node_modules/.prisma/client/index.d';
import NextAuth, { Session } from "next-auth"
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import jwt from "jsonwebtoken";
import { getUserById } from "@/data/users";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";

const JWT_SECRET = process.env.JWT_SECRET || 'Un1R0Om202A*@*';

// Generar JWT
const generateJWT = (userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET); // Sin expiración
  return token;
};

// Función para eliminar tokens antiguos y crear uno nuevo
const createJwtToken = async (userId: string) => {
  // Elimina todos los tokens antiguos para evitar duplicados
  await db.jwtToken.deleteMany({
    where: { userId: userId },
  });

  // Luego crea el nuevo token
  const newToken = generateJWT(userId);
  await db.jwtToken.create({
    data: {
      userId,
      token: newToken,
    },
  });

  return newToken;
};

// Configuración de NextAuth para autenticación
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/login", // Página de inicio de sesión personalizada
    error: "/auth/error", // Página de error personalizada
  },
  events: {
    // Actualiza el estado de verificación del correo al vincular cuentas
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });
    }
  },
  callbacks: {
    // Validación al iniciar sesión
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true; // Permite otros proveedores

      const existingUser = await getUserById(user.id || "");

      if (!existingUser?.emailVerified) return false; // Verifica si el correo está verificado

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false; // Verifica la confirmación de dos factores

        // Elimina la confirmación de dos factores después de su uso
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      // Generar JWT y guardarlo en la base de datos (elimina los antiguos antes)
      const jwtToken = await createJwtToken(existingUser.id);

      return true; // Si todo es válido, permite el inicio de sesión
    },
    // Configuración de la sesión
    async session({ session, token }: { session: Session, token?: any }) {
      // Agrega información adicional al objeto de sesión
      if (session.user && token.provider) {
        session.user.provider = token.provider;
      }

      if (token.sub && session.user) {
        session.user.id = token.sub; // Asocia el ID del usuario
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole; // Asocia el rol del usuario
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean; // Estado de la verificación en dos pasos
      }

      if (session.user) {
        session.user.name = token.name; // Nombre del usuario
        session.user.email = token.email; // Correo del usuario
        session.user.isOAuth = token.isOAuth as boolean; // Indica si es un usuario OAuth
        session.user.JwtToken = token.JwtToken; // Token JWT
      }

      return session; // Devuelve la sesión actualizada
    },
    // Configuración del JWT
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider; // Guarda el proveedor de autenticación
      }

      // Si se inicia sesión, generar el JWT y guardarlo en la base de datos (elimina los antiguos antes)
      if (user) {
        const jwtToken = await createJwtToken(user.id as string);
        token.JwtToken = jwtToken; // Agregar el token generado al objeto token
      }

      if (!token.sub) return token; // Si no hay ID, devuelve el token original

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token; // Devuelve el token si no se encuentra el usuario

      const existingAccount = await getAccountByUserId(existingUser.id);

      // Almacena información relevante en el token
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token; // Devuelve el token actualizado
    }
  },

  adapter: PrismaAdapter(db), // Adapter de Prisma para gestión de usuarios
  session: { strategy: "jwt" }, // Estrategia de sesión usando JWT
  ...authConfig, // Configuración adicional de autenticación
});
