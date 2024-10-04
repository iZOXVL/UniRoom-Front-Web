import { db } from "@/lib/db";

// Obtiene un usuario a partir de su correo electrónico
export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({ where: { email } });
        return user; // Retorna el usuario encontrado
    } catch {
        return null; // Retorna null en caso de error
    }
};

// Obtiene un usuario a partir de su ID
export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } });
        return user; // Retorna el usuario encontrado
    } catch {
        return null; // Retorna null en caso de error
    }
};
