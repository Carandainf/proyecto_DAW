import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";

/**
 * @description Endpoint de descarga segura de archivos.
 * Implementa una triple verificación:
 * 1. ¿Está el usuario logueado?
 * 2. ¿Existe el archivo en la base de datos?
 * 3. ¿El usuario es dueño del archivo o es Administrador? (Control de acceso nivel objeto).
 * * @param {string} params.id - ID único del archivo en la base de datos.
 * @returns {Promise<Response>} Stream del archivo o error 401/403/404 según corresponda.
 */
export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const { user, loggedIn, role } = await getUserRole(request);

  // 1. Verificación de seguridad básica (Autenticación)
  if (!loggedIn || !user) {
    return new Response("No autorizado", { status: 401 });
  }

  if (!id) {
    return new Response("ID de archivo no proporcionado", { status: 400 });
  }

  // 2. Buscar el archivo en la base de datos
  const archivo = await prisma.archivo.findUnique({
    where: { id_archivo: parseInt(id) },
  });

  if (!archivo) {
    return new Response("Archivo no encontrado en la base de datos", { status: 404 });
  }

  // 3. Verificación de propiedad (Autorización)
  // Evitamos que un cliente baje archivos de otro cliente cambiando el ID en la URL.
  if (archivo.id_usuario !== user.id && role !== "admin") {
    return new Response("No tienes permiso para acceder a este archivo", { status: 403 });
  }

  // 4. Construir la ruta física del archivo en el servidor
  const filePath = path.join(process.cwd(), "public", archivo.url_path);

  // 5. Comprobar si el archivo existe físicamente en el almacenamiento
  if (!fs.existsSync(filePath)) {
    return new Response("El archivo físico no existe en el servidor", { status: 404 });
  }

  try {
    // 6. Leer el archivo y servirlo como un stream binario
    const fileBuffer = fs.readFileSync(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream", // Fuerza la descarga de archivos binarios (STL, etc.)
        "Content-Disposition": `attachment; filename="${archivo.nombre_archivo}"`,
      },
    });
  } catch (error) {
    console.error("Error al leer el archivo físico:", error);
    return new Response("Error al procesar la descarga", { status: 500 });
  }
};
