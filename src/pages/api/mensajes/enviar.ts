import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

export const POST: APIRoute = async ({ request, redirect }) => {
  const { user, loggedIn } = await getUserRole(request);

  // 1. Protección de seguridad básica
  if (!loggedIn || !user) {
    return new Response("No autorizado", { status: 401 });
  }

  // 2. Extraer datos del formulario
  const formData = await request.formData();
  const contenido = formData.get("contenido")?.toString();
  const id_archivo = formData.get("id_archivo")?.toString();

  if (!contenido || !id_archivo) {
    return new Response("Faltan datos obligatorios", { status: 400 });
  }

  try {
    // 3. Crear el mensaje en la base de datos
    await prisma.mensaje.create({
      data: {
        contenido: contenido,
        id_archivo: parseInt(id_archivo),
        id_emisor: user.id,
      },
    });

    // 4. Redirigir de vuelta a la página del trabajo para ver el mensaje nuevo
    return redirect(`/dashboard/cliente/trabajo/${id_archivo}`);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    return new Response("Error interno al guardar el mensaje", { status: 500 });
  }
};
