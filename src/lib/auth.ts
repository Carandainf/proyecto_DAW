import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";

// --- INSTANCIA DE BETTER-AUTH ---
export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "sqlite" }),

    // Configuramos el inicio de sesión con email
    emailAndPassword: { enabled: true },

    // IMPORTANTE: Mapeo la columna "role" de la base de datos
    // para que Better-Auth y TypeScript la reconozcan, sino me da error
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
            },
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7 // 1 semana
    },

    secret: process.env.BETTER_AUTH_SECRET!,
    baseUrl: process.env.BETTER_AUTH_URL ?? "http://localhost:4321",
});

/**
 * HELPER: Obtener el usuario y su rol en el servidor (Astro)
 * Se usa en los archivos .astro para proteger rutas.
 */
export async function getUserRole(request: Request) {
    // Usamos la API interna pasando los headers de la petición original.
    // Esto extrae la cookie de sesión automáticamente.
    const session = await auth.api.getSession({
        headers: request.headers
    });

    // Si no hay sesión válida
    if (!session || !session.user) {
        return {
            loggedIn: false,
            role: null,
            user: null
        };
    }

    // Si hay sesión, devolvemos los datos
    return {
        loggedIn: true,
        role: session.user.role || "user",
        user: session.user,
    };
}

/**
 * HELPER: Proteger rutas según el rol del usuario
 * Verifica la sesión y redirige si el usuario no tiene permisos.
 */
export async function protectRoute(request: Request, requiredRole?: string) {
    // Reutilizamos la lógica de getUserRole para obtener el estado actual
    const { loggedIn, role, user } = await getUserRole(request);

    // Si el usuario no ha iniciado sesión
    if (!loggedIn) {
        return {
            shouldRedirect: true,
            url: "/pruebas/test-auth", // Lo mandamos a la ruta de pruebas o otra que nos interese
            user: null
        };
    }

    // SI EXISTE UN ROL REQUERIDO: Comprobamos si el usuario tiene permiso
    if (requiredRole && role !== requiredRole) {
        // Lógica de redirección inteligente: 
        // Si un user intenta entrar a admin -> va a su panel de cliente.
        // Si un admin intenta entrar a cliente (opcional) -> va a su panel de admin.
        const fallback = role === "admin" ? "/dashboard/admin" : "/dashboard/cliente";

        return {
            shouldRedirect: true,
            url: fallback,
            user
        };
    }

    // Si todo es correcto (está logueado y tiene el rol), no redirigimos
    return {
        shouldRedirect: false,
        user,
        role
    };
}



