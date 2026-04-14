import type { APIRoute } from "astro";
import { prisma } from "@/lib/prisma";

export const POST: APIRoute = async ({ request }) => {
  const { id, estado } = await request.json();

  await prisma.archivo.update({
    where: { id_archivo: Number(id) },
    data: { estado: estado },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
