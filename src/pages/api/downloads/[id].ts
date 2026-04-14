import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";
import fs from "node:fs";
import path from "node:path";

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const { user, loggedIn, role } = await getUserRole(request);

  // 1. Verificación de seguridad básica
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

  // 3. Verificación de propiedad (Solo el dueño o el Admin pueden bajarlo)
  if (archivo.id_usuario !== user.id && role !== "admin") {
    return new Response("No tienes permiso para acceder a este archivo", { status: 403 });
  }

  // 4. Construir la ruta física del archivo
  // Asumimos que url_path es algo como "/uploads/archivo.stl"
  const filePath = path.join(process.cwd(), "public", archivo.url_path);

  // 5. Comprobar si el archivo existe físicamente
  if (!fs.existsSync(filePath)) {
    return new Response("El archivo físico no existe en el servidor", { status: 404 });
  }

  // 6. Leer el archivo y servirlo
  const fileBuffer = fs.readFileSync(filePath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${archivo.nombre_archivo}"`,
    },
  });
};
