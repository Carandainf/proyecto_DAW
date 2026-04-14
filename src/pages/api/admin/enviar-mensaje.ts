import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";
import { getUserRole } from "@/lib/auth";

export const POST: APIRoute = async ({ request }) => {
  const { user } = await getUserRole(request);
  const { id_archivo, contenido } = await request.json();

  if (!user) return new Response("No autorizado", { status: 401 });

  await prisma.mensaje.create({
    data: {
      id_archivo: Number(id_archivo),
      id_emisor: user.id,
      contenido: contenido.toString(),
      fecha_envio: new Date(),
    },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
