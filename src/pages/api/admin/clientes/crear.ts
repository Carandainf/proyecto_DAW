import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

/**
 * @description Crea un nuevo cliente en el sistema y dispara el flujo de activación.
 * * El proceso consta de:
 * 1. Validación de privilegios de Administrador.
 * 2. Registro del usuario en la base de datos de autenticación.
 * 3. Envío automático de un enlace de 'Reset Password' para que el cliente configure su acceso.
 * * @param {Request} request - Contiene 'name', 'email' y una 'password' provisional.
 * @returns {Promise<Response>} 200 éxito, 401 no autorizado, 500 error de registro.
 */
export const POST: APIRoute = async ({ request }) => {
  // Verificación de sesión de administrador
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
    // Esto permite que el usuario reciba un email y ponga su propia contraseña
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
