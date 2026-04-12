// src/pages/api/admin/contacto-read.ts
import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Better-auth 1.5

export const POST: APIRoute = async ({ request }) => {
  // 1. Verificar sesión y rol (Seguridad)
  const session = await auth.api.getSession({ headers: request.headers });

  // Verificamos si existe la sesión y si el rol es admin
  if (!session || session.user.role !== "admin") {
    return new Response(
      JSON.stringify({ error: "No autorizado. Se requiere perfil de administrador." }),
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id_contacto } = body;

    if (!id_contacto) {
      return new Response(JSON.stringify({ error: "ID de contacto no proporcionado" }), {
        status: 400,
      });
    }

    // 2. Actualizar en la base de datos
    await prisma.contacto.update({
      where: { id_contacto: Number(id_contacto) },
      data: {
        leido: true,
        // registrar qué admin lo gestionó y cuándo
        id_admin: session.user.id,
        fecha_gestion: new Date(),
      },
    });

    // Respuesta
    return new Response(
      JSON.stringify({
        message: "Contacto marcado como leído correctamente",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en contacto-read:", error);
    return new Response(JSON.stringify({ error: "Error interno al procesar la solicitud" }), {
      status: 500,
    });
  }
};
