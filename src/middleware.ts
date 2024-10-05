import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

// Configura la autenticación con NextAuth utilizando una configuración externa
const { auth } = NextAuth(authConfig);

// Exporta una función que maneja la lógica de autenticación y autorización
// para cada petición recibida.
// @ts-ignore se utiliza para ignorar errores de TypeScript en esta línea.
export default auth((req) => {
  const { nextUrl } = req;  // Extrae el URL de la petición.
  const isLoggedIn = !!req.auth;  // Verifica si el usuario está autenticado.

  // Determina si la ruta actual es una API relacionada con la autenticación.
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // Verifica si la ruta es pública (no requiere autenticación).
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Verifica si la ruta es de autenticación (páginas como login o registro).
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Si es una ruta de API de autenticación, no realiza ninguna acción.
  if (isApiAuthRoute) {
    return null;
  }

  // Si el usuario ya está autenticado y está intentando acceder a una ruta de autenticación,
  // lo redirige a la página por defecto después de iniciar sesión.
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;  // Permite el acceso si no está autenticado.
  }

  // Si el usuario no está autenticado y la ruta no es pública,
  // lo redirige a la página de login, añadiendo un callback para redirigirlo después de iniciar sesión.
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;  // Mantiene los parámetros de la URL.
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    // Redirige al usuario a la página de login con un callback URL codificado.
    return Response.redirect(new URL(
      `/?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return null;  // Si ninguna condición aplica, no realiza ninguna acción.
});

// Configura el matcher para especificar qué rutas serán manejadas por esta lógica de autenticación.
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
