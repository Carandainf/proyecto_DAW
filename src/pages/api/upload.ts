import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Para saber qué cliente está subiendo
import fs from "node:fs/promises";
import path from "node:path";

export const POST: APIRoute = async ({ request }) => {
    // 1. Verificar sesión (Seguridad)
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || !session.user) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    try {
        const formData = await request.formData();
        const descripcion = formData.get("descripcion") as string;
        const prioridad = formData.get("prioridad") as string;
        const files = formData.getAll("files") as File[];

        // Comprobamos que hay fichero adjunto
        if (!files || files.length === 0) {
            return new Response(JSON.stringify({ error: "No se enviaron archivos" }), { status: 400 });
        }

        // Comprobamos que el fichero es .stl
        if (!files.every((file) => file.name.endsWith(".stl"))) {
            return new Response(JSON.stringify({ error: "Formato no permitido. Solo .STL" }), { status: 400 });
        }

        // Recorremos los ficheros y los guardamos
        for (const file of files) {
            const fileName = `${Date.now()}-${file.name}`;
            const filePath = path.join(process.cwd(), "public", "uploads", fileName);
            const arrayBuffer = await file.arrayBuffer();
            await fs.writeFile(filePath, Buffer.from(arrayBuffer));
            await prisma.archivo.create({
                data: {
                    nombre_archivo: file.name,
                    url_path: `/uploads/${fileName}`,
                    id_usuario: session.user.id,
                    estado: "pendiente",
                    descripcion: descripcion || "", // Añadido un fallback por seguridad
                    prioridad: prioridad || "normal",
                },
            });
        }

        // Una vez termina el bucle, le decimos al frontend que todo ha ido bien
        return new Response(JSON.stringify({
            message: "Archivos subidos con éxito"
        }), { status: 200 });
        // 👆 ---------------------- 👆

    } catch (error) {
        console.error("Error en upload:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    }
};