import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    // 1. Verificación de seguridad: ¿Existe el usuario?
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Respondemos con éxito aunque no exista para no dar pistas al "hacker"
      // de qué correos están registrados (Privacy by Design)
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    // 2. Si existe, Better-Auth genera el token y dispara nodemailer
    // @ts-ignore
    await auth.api.requestPasswordReset({
      body: {
        email: email,
        redirectTo: "/reset-password",
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error en forgot-password:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
};
