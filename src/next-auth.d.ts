import { Image } from 'next/image';
import { JwtToken } from './../node_modules/.prisma/client/index.d';
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

// Se extiende el tipo de usuario por defecto de NextAuth para incluir
// roles y otras propiedades adicionales.
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;              // Añade el campo 'role' que utiliza el tipo 'UserRole' de Prisma.
  isTwoFactorEnabled: boolean; // Indica si el usuario tiene habilitada la autenticación de dos factores.
  isOAuth: boolean;            // Indica si el usuario está autenticado usando OAuth.
  provider?: string;          // Opcional: define el proveedor de OAuth que se está utilizando (si aplica).
  JwtToken: JwtToken;    // Añade el campo 'JwtToken' que utiliza el tipo 'JwtToken' de Prisma.
  Image: string;      // Añade el campo 'Image' que utiliza el tipo 'Image' de Prisma.
};

// Se amplía el módulo "next-auth" para incluir el tipo 'ExtendedUser'
// en la interfaz 'Session', lo que significa que cada sesión de usuario 
// ahora incluirá estas propiedades adicionales.
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;  // Sobrescribe el tipo de 'user' dentro de 'Session' con 'ExtendedUser'.
  }
}
