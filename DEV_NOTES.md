# 📚 DEV_NOTES.md

Guía técnica detallada del proyecto DAW: Sistema de Laboratorio Dental.

---

## 🗓 Historial y Actualizaciones

| Fecha      | Versión / Cambio |
| :--------- | :--------------- |
| 03/04/2026 | **v0.5.0: Middleware y Roles**. Implementada protección de rutas `protectRoute`, Navbar dinámico y redirecciones automáticas por rol (Admin/Cliente). Actualización a Prisma 7.6.0. |
| 01/04/2026 | **v0.4.0: Bento Grid**. Interfaz adaptativa en `/test-auth`, corrección de botones y visualización JSON en tiempo real. |
| 30/03/2026 | **v0.3.0: Tailwind 4**. Configuración nativa con PostCSS y eliminación de configuraciones obsoletas de v3. |
| 27/02/2026 | **v0.1.0: Inicio**. Setup inicial Astro 5 + TypeScript + Estructura base. |

---

## 1. Versiones Críticas y Requisitos

* **Node.js**: `>= 20.19` (Requerido por Prisma 7).
* **Prisma**: `7.6.0` (Sincronizado con `@prisma/client`).
* **Better Auth**: `1.5.6`.
* **Tailwind CSS**: `4.0` (vía PostCSS).

---

## 2. Cliente Prisma Global (Singleton)

Archivo: `src/lib/prisma.ts`
Se utiliza un adaptador para `better-sqlite3` para asegurar compatibilidad total con el entorno de ejecución de Astro en modo SSR.

```ts
// Implementación Singleton para evitar fugas de memoria en Hot Reload
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

---

## 3. Lógica de Autenticación y Roles
Configuración de Roles

En src/lib/auth.ts, se ha extendido el modelo de usuario para incluir el campo role. Better Auth mapea este campo directamente desde SQLite.
Helper de Protección de Rutas

Se ha creado una función centralizada para evitar repetir lógica de seguridad en cada página:

```ts
// src/lib/auth.ts
export async function protectRoute(request: Request, requiredRole?: string) {
    const { loggedIn, role, user } = await getUserRole(request);
    // Retorna objeto con: shouldRedirect, url, user
}

---

## 4. Arquitectura de Navegación

El componente src/components/Navbar.astro es Server-Side.

    Detecta la sesión en el servidor.

    Renderiza enlaces condicionales ({role === 'admin' && ...}).

    No expone lógica sensible al cliente.

---

## 5. Endpoints de API (Evolución)

Se han migrado los endpoints manuales a la estructura estándar de Better Auth:

    Antes: /api/auth-test/login

    Ahora (Oficial): /api/auth/sign-in/email

    Nota: Las peticiones fetch desde el cliente DEBEN incluir credentials: "include" para que las cookies de sesión se procesen correctamente.

---

## 6. Estado Actual del Sistema

    [x] SSR Mode: Astro configurado con output: "server".

    [x] Auth Core: Registro, Login y Logout funcionales.

    [x] RBAC (Role Based Access Control): Redirecciones automáticas basadas en rol.

    [x] UI: Navbar dinámico y Layouts protegidos.

    [x] DB: Prisma 7.6.0 conectado a SQLite.

---

## 7. Próximos Pasos (Lógica de Negocio)

    Gestión de Archivos: Implementar form para que el cliente suba trabajos dentales.

    Relación de Datos: Vincular el userId de la sesión con la columna id_usuario de la tabla Archivo.

    Panel de Control: Crear tablas de visualización de estados (Pendiente, En Proceso, Terminado).

---

## 8. Notas de Seguridad

    Las rutas /dashboard/admin/* están protegidas doblemente: comprueban sesión activa Y que el rol sea estrictamente admin.

    El campo name del usuario usa Optional Chaining (user?.name) en los componentes para evitar errores de renderizado si el campo es null en DB.
---
