import { createAuthClient } from "better-auth/react";

// apunto a mi servidor local de Astro
export const authClient = createAuthClient({
  baseURL: import.meta.env.PUBLIC_BETTER_AUTH_URL ?? "http://localhost:4321",
});

// Exporto métodos para usarlos en páginas o componentes
export const { signUp, signIn, signOut, useSession, resetPassword } = authClient;
