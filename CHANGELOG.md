# Changelog

Todos los cambios importantes del proyecto `proyecto_DAW` se documentarán en este archivo.

El formato está inspirado en Keep a Changelog y versionado semántico.

---

# [0.6.0] - 2026-04-05

## Añadido
* **Dashboard de Cliente (Bento Grid)**:
  * Diseño avanzado tipo "Bento" con rejilla responsive (`grid-cols-1 md:grid-cols-3`).
  * Integración de **Tailwind CSS 4** con variables de color personalizadas para el sector dental (`dent-card`, `dent-border`, `dent-accent`).
  * Implementación de fuentes locales ("Inter") para cumplimiento de privacidad y rendimiento.
* **Sistema de Gestión de Archivos STL**:
  * Creación de Endpoint API `src/pages/api/upload.ts` para procesamiento de archivos `multipart/form-data`.
  * Lógica de guardado físico en `/public/uploads` con renombrado único mediante *timestamps* para evitar colisiones de archivos.
  * Vinculación automática de archivos con el `id` de usuario de la sesión activa de Better Auth.
* **Experiencia de Usuario (UX) Pro**:
  * **Zona Dropzone**: Implementada funcionalidad *Drag & Drop* nativa mediante JavaScript para captura de archivos.
  * **Feedback Visual**: Efectos de escala (`scale-101`) y cambio de color cian al arrastrar archivos sobre la zona de carga.
  * **Estado de Éxito**: Pantalla de confirmación animada integrada en el Bento Grid tras una subida correcta, eliminando el uso de `alert()` nativos.

## Cambiado
* **Esquema de Base de Datos (Prisma)**:
  * Evolución del modelo `Archivo` para soportar flujo de trabajo real:
    * Añadido `url_path` para localización de archivos en el servidor.
    * Añadido `descripcion` (String opcional) para observaciones técnicas del dentista.
    * Añadido `prioridad` (String) para gestión de urgencias (Normal/Urgente).
* **Configuración de Prisma v7**:
  * Migración de la lógica de *seeding* al nuevo estándar `prisma.config.ts`.
  * Configuración de la propiedad `migrations.seed` para ejecutar el script mediante `tsx`.

## Corregido
* **Desfase de Tipado (Prisma/TypeScript)**: Solucionado error `ts(2353)` mediante la regeneración forzada del cliente con `npx prisma generate`.
* **Persistencia de Formulario**: Implementado `form.reset()` tras subida exitosa para limpiar estados del navegador (observaciones y prioridad).
* **Interrupción de Navegador en Dropzone**: Corregido el comportamiento por defecto donde el navegador intentaba abrir el archivo `.stl` en lugar de procesar la subida.

---

# [0.5.0] - 2026-04-03

## Añadido
* **Sistema de Roles y Autorización**:
  * Implementado mapeo de campo `role` en la configuración de Better Auth.
  * Creado helper `getUserRole(request)` en `src/lib/auth.ts` para extraer sesión y rol de forma centralizada.
  * Creado helper `protectRoute(request, role)` para gestionar redirecciones automáticas basadas en permisos.
* **Navegación Dinámica**:
  * Nuevo componente `src/components/Navbar.astro`.
  * Menú adaptativo: muestra enlaces de "Panel Admin" o "Mis Pedidos" según el rol detectado en la cookie de sesión.
* **Estructura de Dashboards**:
  * Creada ruta protegida `/dashboard/admin/index.astro`.
  * Creada ruta protegida `/dashboard/cliente/index.astro`.
* **Redirecciones Automáticas**:
  * Implementada lógica de redirección post-login: los administradores van a `/admin` y los usuarios a `/cliente`.
  * Protección "cross-role": un usuario estándar es rebotado si intenta acceder manualmente a la URL de administración.

## Cambiado
* **Refactorización de Endpoints API**:
  * Migración de endpoints de prueba manuales (`/api/auth-test/...`) al manejador dinámico oficial de Better Auth.
  * Configuración del catch-all route en `src/pages/api/auth/[...all].ts`.
* **Actualización de Dependencias**:
  * Forzada la versión de `@prisma/client` y `prisma` a la **7.6.0** para asegurar compatibilidad con el adapter.
  * Instalación de `@opentelemetry/api` como dependencia necesaria para el motor de Better Auth 1.5.

## Corregido
* **Error 404 en Rutas de Autenticación**:
  * Corregidas las URLs de los formularios en el frontend para coincidir con la versión 1.5.x:
    * `/api/auth/sign-up/email` (con guiones y barras).
    * `/api/auth/sign-in/email`.
* **Error de TypeScript `basePath`**: Eliminada propiedad obsoleta en la configuración `advanced` de Better Auth.
* **Error de Tipado en Componentes**: Corregido el error de "posible nulo" en `user.name` mediante el uso de encadenamiento opcional (`user?.name`) en el Navbar y Dashboards.
* **Persistencia de Sesión**: Corregido problema de pérdida de sesión en redirecciones mediante la inclusión de `credentials: "include"` en las peticiones fetch de validación.

---

# [0.4.0] - 2026-04-01

## Añadido

* Configuración completa de Better Auth con Prisma Adapter.
* Endpoints API para autenticación:

  * `/api/auth-test/register`
  * `/api/auth-test/login`
  * `/api/auth-test/session`
  * `/api/auth-test/logout`
* Página `/test-auth` para pruebas de autenticación.
* Formularios funcionales de:

  * Register
  * Login
  * Get Session
  * Logout
* Salida JSON en tiempo real para visualizar respuestas de la API.
* Gestión de sesión mediante cookies.
* Configuración de Astro con:

```js
output: "server"
```

* Diseño inicial tipo Bento Grid responsive en `/test-auth`.
* Tarjetas con tamaños variables y comportamiento dinámico según el contenido.
* Soporte responsive para escritorio, tablet y móvil.
* Animaciones hover y transición en las tarjetas.

## Cambiado

* Migración definitiva a Tailwind CSS 4.
* Sustituida la configuración antigua de Tailwind 3.
* Eliminado el uso de:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

* Sustituido por:

```css
@import "tailwindcss";
```

* Cambio de `postcss.config.cjs` a `postcss.config.mjs`.
* Nuevo contenido de `postcss.config.mjs`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

* Eliminado el plugin `@tailwindcss/vite` del archivo `astro.config.mjs` por incompatibilidad con Astro 5 y Vite.
* Simplificado `astro.config.mjs` a:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
});
```

## Corregido

* Error de incompatibilidad entre versiones de Vite y `@tailwindcss/vite`.
* Error:

```text
Type 'Plugin<any>[]' is not assignable to type 'PluginOption'
```

* Error de Tailwind 4 relacionado con:

```text
Missing "./base" specifier in "tailwindcss" package
```

* Error de PostCSS:

```text
It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin
```

* Error en login por enviar `name` en lugar de `email`.
* Corregido el formulario de login para enviar:

```ts
const loginData = {
  email: form.get("email"),
  password: form.get("password"),
};
```

* Corregido el problema por el que `session` devolvía `null` tras iniciar sesión.
* Corregida la gestión de cookies necesaria para que Better Auth mantenga la sesión.
* Solucionado el problema visual donde las tarjetas Bento se superponían.
* Corregido el tamaño excesivo de los ladrillos, que hacía que apareciesen uno debajo de otro.
* Corregidos los botones que quedaban fuera de sus tarjetas.
* Corregida la superposición entre las tarjetas `Register` y `Logout`.

---

# [0.3.0] - 2026-03-30

## Añadido

* Configuración inicial de Tailwind CSS 4.
* Archivo `global.css` con:

```css
@import "tailwindcss";
```

* Importación global de estilos desde `Layout.astro`.
* Primer diseño responsive para la página `/test-auth`.
* Primeros experimentos con Bento Grid usando CSS Grid y Tailwind.

## Cambiado

* El proyecto pasa de una interfaz básica vertical a una estructura visual basada en tarjetas.
* El layout general cambia a fondo oscuro con tipografía clara.

---

# [0.2.0] - 2026-03-29

## Añadido

* Integración de Better Auth.
* Configuración de Prisma Adapter.
* Registro de usuarios con email y contraseña.
* Login de usuarios.
* Persistencia de sesiones en SQLite.
* Roles iniciales `admin` y `user` creados mediante seed.
* Configuración del archivo `.env` con:

  * `DATABASE_URL`
  * `BETTER_AUTH_SECRET`
  * `BETTER_AUTH_URL`

## Cambiado

* El proyecto deja de ser completamente estático y pasa a usar `output: "server"`.

---

# [0.1.0] - 2026-03-28

## Añadido

* Creación inicial del proyecto con Astro 5 + TypeScript.
* Integración de Prisma 7.
* Base de datos SQLite funcionando.
* Archivo `schema.prisma` inicial.
* Archivo `seed.ts` para insertar datos iniciales.
* Página `/prueba-db` para comprobar conexión a base de datos.
* Configuración inicial de GitHub.
* README inicial del proyecto.

## Añadido --Tailwind CSS y preparación del panel de autenticación

* Tailwind CSS instalado y funcionando.
* Archivo `src/styles/global.css` configurado.
* Layout base `src/layouts/Layout.astro` creado.
* Estructura de páginas actualizada:

```text
src/pages/
├── index.astro
├── prueba-db.astro
└── test-auth.astro
```

* Definido el panel `/test-auth`.
* Decisión tomada de usar:

  * formularios HTML en Astro
  * `fetch()` con URLs absolutas
  * `credentials: "include"`
* Endpoints previstos:

```text
/api/auth-test/register
/api/auth-test/login
/api/auth-test/session
/api/auth-test/logout
```

**Estado:** 🟢 En progreso

### Hitos logrados

* Tailwind CSS instalado y funcionando.
* Archivo `src/styles/global.css` configurado.
* Layout base `src/layouts/Layout.astro` creado.
* Estructura de páginas actualizada:

```text
src/pages/
├── index.astro
├── prueba-db.astro
└── test-auth.astro
```

* Definido el panel `/test-auth`.
* Decisión tomada de usar:

  * formularios HTML en Astro
  * `fetch()` con URLs absolutas
  * `credentials: "include"`
* Endpoints previstos:

```text
/api/auth-test/register
/api/auth-test/login
/api/auth-test/session
/api/auth-test/logout
```

### Próximos pasos

* Crear formularios de register y login.
* Implementar lectura de sesión.
* Implementar logout.
* Añadir protección de rutas según sesión.
* Empezar autorización por roles.

---

## 📌 Estado actual del proyecto

* SQLite funcionando.
* Prisma 7.5.x funcionando.
* Better Auth funcionando.
* Tailwind CSS funcionando.
* Roles iniciales creados.
* Proyecto sincronizado entre varios equipos.
* Próximo objetivo: completar `/test-auth`.

---

## 📅 [2026-03-18] - Integración de Better Auth

**Estado:** 🟢 Completado

### Hitos logrados

* Better Auth instalado y configurado.
* Archivo `src/lib/auth.ts` creado.
* Better Auth conectado a Prisma mediante Prisma Adapter.
* Variables de entorno añadidas:

```env
BETTER_AUTH_SECRET="<secret aleatorio>"
BETTER_AUTH_URL="http://localhost:4321"
```

* Login mediante email + contraseña habilitado.
* Gestión de sesiones habilitada.
* Configuración corregida para usar `expiresIn` en lugar de `maxAge`.
* Proyecto actualizado a Prisma 7.5.x.
* Requisito de Node.js actualizado a:

```text
>= 20.19
```

* `npx prisma generate` ejecutado correctamente tras la actualización.
* Compatibilidad verificada en dos equipos distintos mediante GitHub.

### Resultado

* Flujo actual operativo:

```text
UI (Astro) → API (Astro endpoints) → Better Auth → Prisma → SQLite
```

---

## 📅 [2026-03-10] - Configuración de Prisma + SQLite

**Estado:** 🟢 Completado

### Hitos logrados

* Prisma configurado con SQLite.
* `schema.prisma` creado y funcionando.
* Prisma Client generado correctamente.
* Cliente global en `src/lib/prisma.ts` para evitar múltiples conexiones.
* Base de datos SQLite operativa mediante:

```env
DATABASE_URL="file:./prisma/dev.db"
```

* Seed ejecutado correctamente.
* Roles iniciales creados:

  * `admin`
  * `user`
* Página `prueba-db.astro` creada para verificar lectura desde la base de datos.
* Tipado generado para todos los modelos de Prisma.

### Resultado

* Conexión a base de datos verificada.
* Lectura de datos funcionando correctamente.

---

## 📅 [2026-02-27] - Configuración inicial del proyecto

**Estado:** 🟢 Completado

### Hitos logrados

* Proyecto Astro creado con TypeScript en modo estricto.
* Dependencias instaladas mediante `npm`.
* Repositorio Git inicializado y conectado con GitHub.
* VS Code configurado con:

  * Astro
  * Tailwind CSS IntelliSense
  * Prisma
  * ESLint
  * Prettier
  * Error Lens
  * GitLens
* Configuración inicial de `settings.json`:

  * `formatOnSave`
  * auto-fix de ESLint
  * soporte Tailwind en `.astro`


