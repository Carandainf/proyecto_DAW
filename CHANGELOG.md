# 🚀 CHANGELOG - proyecto_DAW

Registro de cambios y evolución del proyecto.

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

## 📅 [2026-03-29] - Tailwind CSS y preparación del panel de autenticación

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
