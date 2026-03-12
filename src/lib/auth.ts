import "dotenv/config";
import { betterAuth } from "better-auth";
import { prisma } from "@/lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

// voy a crear la instancia de Better-Auth usando el adaptador de Prisma
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // mi DB
    }),
    emailAndPassword: {
        enabled: true, // habilito login con email + contraseña
    },
    // Configuración de roles y permisos
    roles: ["admin", "user"], // estos coinciden con mi tabla Role
    session: {
        // Opcional: para configurar duración, cookie, etc.
        expiresIn: 60 * 60 * 24 * 7, // 7 días
    },
    // Secret y URL base tomados de mi fichero .env
    secret: process.env.BETTER_AUTH_SECRET!,
    baseUrl: process.env.BETTER_AUTH_URL ?? "http://localhost:4321",
});