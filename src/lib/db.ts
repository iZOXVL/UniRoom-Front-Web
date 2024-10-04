import { PrismaClient } from "@prisma/client";

// Declara la variable prisma en el ámbito global
declare global {
    var prisma: PrismaClient | undefined; // PrismaClient puede ser indefinido
}

// Crea una instancia de PrismaClient o reutiliza la existente
export const db = globalThis.prisma || new PrismaClient();

// Asigna la instancia a la variable global solo en entornos de desarrollo
if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
