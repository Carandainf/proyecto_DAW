import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import { auth } from "@/lib/auth";

export const POST: APIRoute = async ({ request }) => {
  // 1. Verificación de Seguridad: Solo el Admin puede usar esta API
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const { name, email, password } = await request.json();

    // 2. Registrar en Better Auth usando su API interna de servidor
    // Esto es más seguro que hacerlo desde el navegador
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "user", // Forzamos rol de cliente
      },
    });

    // 3. Configurar Nodemailer con las variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Enviar el Email de Bienvenida
    await transporter.sendMail({
      from: `"Laboratorio Dental" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Tus credenciales de acceso - Laboratorio Dental",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0f172a; color: white; padding: 40px; border-radius: 20px; border: 1px solid #1e293b;">
          <h2 style="color: #00f2ff; font-style: italic; font-size: 24px;">¡Hola, ${name}!</h2>
          <p style="color: #94a3b8; line-height: 1.6;">Se ha creado tu cuenta de acceso para el portal de gestión del laboratorio.</p>
          
          <div style="background-color: #1e293b; padding: 24px; border-radius: 16px; margin: 30px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; font-size: 10px; color: #00f2ff; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Datos de acceso:</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Contraseña temporal:</strong> ${password}</p>
          </div>

          <a href="${process.env.BETTER_AUTH_URL}" style="display: inline-block; background-color: #00f2ff; color: #0f172a; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 12px;">
            Acceder al Portal
          </a>
          
          <p style="font-size: 11px; color: #475569; margin-top: 40px; border-top: 1px solid #1e293b; padding-top: 20px;">
            Le recomendamos cambiar su contraseña en su primer inicio de sesión.
          </p>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Error creando cliente:", error);
    // Manejo de error si el email ya existe
    const message = error.message?.includes("already exists")
      ? "El email ya está registrado"
      : "Error al crear el cliente";

    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
};
