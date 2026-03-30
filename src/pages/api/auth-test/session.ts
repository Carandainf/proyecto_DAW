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
