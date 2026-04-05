import { auth } from "@/lib/auth";
import type { APIRoute } from "astro";

export const prerender = false;

// Este archivo capturará CUALQUIER cosa que vaya a /api/auth/*
export const ALL: APIRoute = async ({ request }) => {
    console.log("Petición recibida en auth handler:", request.url);
    return await auth.handler(request);
};
