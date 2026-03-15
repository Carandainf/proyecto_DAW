import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

export const POST: APIRoute = async () => {
    try {
        const result = await auth.api.signUpEmail({
            body: {
                name: "Usuario Test",
                email: "test@example.com",
                password: "12345678",
            },
        });

        return new Response(JSON.stringify(result), {
            status: 200,
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error al registrar el usuario" }), {
            status: 500,
        });
    }
};
