import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

export const POST: APIRoute = async ({ request }) => {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const { name, email, password } = await request.json();

    // 1. Crear el usuario en la base de datos
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "user",
      },
    });

    // 2. Disparar el proceso de recuperación/configuración
    // Usamos 'requestPasswordReset'
    await auth.api.requestPasswordReset({
      body: {
        email: email,
        redirectTo: "/reset-password",
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Error detallado:", error);

    const message = error.message?.includes("already exists")
      ? "El email ya está registrado"
      : "Error al crear el cliente";

    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
