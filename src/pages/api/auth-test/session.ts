import { auth } from "@/lib/auth";

export async function GET({ request }: { request: Request }) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        return new Response(JSON.stringify(session), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 401,
        });
    }
}


/* import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

export const GET: APIRoute = async ({ request }) => {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        return new Response(JSON.stringify(session), {
            status: 200,
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Error al iniciar sesión" }), {
            status: 500,
        });
    }
}; */