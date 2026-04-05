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
        const file = formData.get("file") as File;
        const descripcion = formData.get("descripcion") as string;
        const prioridad = formData.get("prioridad") as string;

        if (!file) {
            return new Response(JSON.stringify({ error: "No hay archivo" }), { status: 400 });
        }

        // 2. Validar extensión (Seguridad RF2)
        if (!file.name.endsWith(".stl")) {
            return new Response(JSON.stringify({ error: "Formato no permitido. Solo .STL" }), { status: 400 });
        }

        // 3. Crear nombre único para evitar sobrescribir (Timestamp + Nombre)
        const fileName = `${Date.now()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const filePath = path.join(uploadDir, fileName);

        // 4. Guardar archivo en el sistema de archivos
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));

        // 5. Guardar registro completo en Prisma
        const nuevoArchivo = await prisma.archivo.create({
            data: {
                nombre_archivo: file.name,
                url_path: `/uploads/${fileName}`,
                id_usuario: session.user.id,
                estado: "pendiente",
                descripcion: descripcion || "", // Ahora sí lo guardamos
                prioridad: prioridad || "normal",     // Y la prioridad también
            },
        });

        return new Response(JSON.stringify({
            message: "Archivo subido con éxito",
            id: nuevoArchivo.id_archivo
        }), { status: 200 });

    } catch (error) {
        console.error("Error en upload:", error);
        return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
    }
};