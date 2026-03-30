import { auth } from "@/lib/auth";

export async function POST({ request }: { request: Request }) {
    let body;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "No se recibió body" }), { status: 400 });
    }

    if (!body || !body.email || !body.password || !body.name) {
        return new Response(JSON.stringify({ error: "Faltan campos en el body" }), { status: 400 });
    }

    try {
        const user = await auth.api.signUpEmail({
            body: {
                email: body.email,
                password: body.password,
                name: body.name,
            },
        });
        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
}


