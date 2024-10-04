import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

// Maneja las solicitudes GET
export async function GET() {
  const role = await currentRole();
  
  // Verifica si el rol del usuario es ARRRENDADOR
  if (role === UserRole.ARRENDADOR) {
    return new NextResponse(null, { status: 200 });
  }

  // Retorna 403 si el rol no tiene permiso
  return new NextResponse(null, { status: 403 });
}
