import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  try {
    await prisma.contacto.create({
      data: {
        nombre: body.nombre,
        email: body.email,
        asunto: body.asunto,
        mensaje: body.mensaje,
        leido: false, // Por defecto es falso
      },
    });
    return new Response(JSON.stringify({ message: "OK" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error BD" }), { status: 500 });
  }
};
