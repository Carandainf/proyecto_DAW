import { auth } from "@/lib/auth";

export async function POST({ request }: { request: Request }) {
    try {
        await auth.api.signOut({
            headers: request.headers,
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
        });
    }
}