import { auth } from "@/lib/auth";

export async function POST({ request }: { request: Request }) {
    const body = await request.json();

    try {
        const user = await auth.api.signInEmail({
            body: {
                email: body.email,
                password: body.password,
            },
        });

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
        });
    }
}



