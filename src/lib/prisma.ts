import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * @description Adaptador y Cliente de Prisma para SQLite.
 * Se utiliza el adaptador 'better-sqlite3' para mayor rendimiento en entornos Node.js.
 */
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });

/**
 * @description Implementación del patrón Singleton para Prisma.
 * En desarrollo, Astro recarga los archivos frecuentemente.
 * Guardamos la instancia en 'global' para reutilizar la misma conexión y evitar errores 'Too many connections'.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Si no estamos en producción, exponemos la instancia al objeto global
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
