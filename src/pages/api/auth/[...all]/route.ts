import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// creo los manejadores GET/POST para todas las rutas de /api/auth/*
export const { GET, POST } = toNextJsHandler(auth);