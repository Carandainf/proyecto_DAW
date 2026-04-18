import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id, name, email } = await request.json();

    // Validación básica
    if (!id || !name || !email) {
      return new Response(JSON.stringify({ error: "Todos los campos son obligatorios" }), {
        status: 400,
      });
    }

    // Actualizamos el usuario
    await prisma.user.update({
      where: { id },
      data: {
        name: name,
        email: email,
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    // Si el email ya existe en otro usuario, Prisma lanzará un error P2002
    if (error.code === "P2002") {
      return new Response(JSON.stringify({ error: "El email ya está en uso por otro cliente" }), {
        status: 400,
      });
    }

    console.error("Error al actualizar cliente:", error);
    return new Response(JSON.stringify({ error: "No se pudo actualizar el cliente" }), {
      status: 500,
    });
  }
};
