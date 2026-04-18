import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const POST: APIRoute = async ({ request }) => {
  const { id } = await request.json();

  try {
    await prisma.user.update({
      where: { id },
      data: {
        banned: true,
        banReason: "Baja administrativa. Datos conservados por trazabilidad legal.",
      },
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "No se pudo procesar la baja" }), { status: 500 });
  }
};
