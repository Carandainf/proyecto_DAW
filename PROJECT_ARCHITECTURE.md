# 🏗️ PROJECT_ARCHITECTURE.md

> Arquitectura técnica del proyecto DAW: Sistema de Gestión de Laboratorio Dental.
>
> Última actualización: `07/04/2026` · Versión actual: `v0.7.0`

---

# 📦 Stack Tecnológico

| Tecnología                  | Versión | Uso                                      |
| --------------------------- | ------- | ---------------------------------------- |
| `Astro`                     | `5.x`   | Framework principal con renderizado SSR  |
| `TypeScript`                | Última  | Tipado estricto en toda la aplicación    |
| `Tailwind CSS`              | `4.x`   | Sistema de estilos y variables de diseño |
| `Prisma`                    | `7.6.x` | ORM para acceso a SQLite                 |
| `Better Auth`               | `1.5.x` | Autenticación, sesión y RBAC             |
| `jsPDF` + `jspdf-autotable` | Última  | Generación de informes PDF en cliente    |
| `Lucide` / SVGs             | Última  | Sistema de iconografía técnica           |

---

# 1. 🧱 Arquitectura de Capas

El sistema utiliza una arquitectura SSR (`Server-Side Rendering`) para mantener la lógica crítica y los datos sensibles en el servidor.

```text
CLIENTE (Navegador)
│
├── UI: Astro Components + Tailwind 4
├── Layout: Bento Grid + Layout.astro
├── Logic: jsPDF (Generación local de PDF)
└── Auth: Cookies + Gestión de sesión
│
▼
SERVIDOR (Astro Runtime)
│
├── API Endpoints
│   ├── /api/auth/[...all]
│   ├── /api/upload
│   └── /api/get-session
│
├── Middleware / Seguridad
│   └── protectRoute(request, role)
│
└── Persistencia
    └── Prisma Client (Singleton)
│
▼
CAPA DE DATOS
│
├── SQLite → prisma/dev.db
└── Storage → /public/uploads
```

## Principios de Diseño

- SSR para proteger acceso a datos sensibles.
- Cliente ligero: sólo UI y generación de PDF.
- Lógica de negocio concentrada en endpoints y helpers.
- Persistencia desacoplada mediante Prisma.

---

# 2. 🔄 Flujo de Gestión Documental (PDF)

La generación de documentos se realiza completamente en el cliente para evitar carga adicional en el servidor.

## Flujo

```text
1. Prisma obtiene los registros desde SQLite.
2. Astro renderiza la página SSR.
3. Los datos se inyectan al navegador mediante define:vars.
4. El usuario pulsa "Descargar PDF".
5. jsPDF genera el documento localmente.
6. El navegador descarga el Blob sin nuevas llamadas API.
```

## Inyección de Datos

```astro
define:vars={{ todosLosTrabajos }}
```

## Generación de PDF

```ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const pdf = new jsPDF();
```

## Beneficios

- Reduce consumo de CPU en el servidor.
- Elimina peticiones innecesarias.
- Permite exportación inmediata desde el historial.

---

# 3. 📂 Estructura del Proyecto

```text
proyecto_DAW/
├── public/
│   └── uploads/                  # Almacenamiento físico de STL / OBJ
│
├── prisma/
│   ├── schema.prisma             # Modelo de datos
│   └── dev.db                    # Base de datos SQLite
│
├── src/
│   ├── components/               # Navbar, BentoCard, tablas, botones
│   ├── layouts/                  # Layout.astro y plantillas base
│   ├── lib/
│   │   ├── prisma.ts             # Prisma Singleton
│   │   ├── auth.ts               # Better Auth + configuración de roles
│   │   └── protectRoute.ts       # Seguridad y RBAC
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/[...all].ts
│   │   │   ├── upload.ts
│   │   │   └── get-session.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── admin/            # Gestión global del laboratorio
│   │   │   └── cliente/          # Historial y subida de archivos
│   │   │
│   │   ├── test-auth.astro
│   │   └── index.astro
│   │
│   └── styles/
│       ├── global.css
│       └── tailwind.css
│
├── .prettierrc
├── astro.config.mjs
├── tailwind.config.ts
└── package.json
```

---

# 4. 🔐 Sistema de Seguridad y Roles (RBAC)

El control de acceso se centraliza mediante `protectRoute(request, role)`.

## Nivel 1: Validación de Sesión

Verifica que el usuario tenga una sesión activa y una cookie válida.

```ts
const session = await auth.api.getSession({ headers: request.headers });
```

Si no existe sesión:

```text
→ Redirección a /test-auth
```

---

## Nivel 2: Validación de Rol

Se compara el rol almacenado en la sesión con el rol requerido por la página.

```ts
if (session.user.role !== requiredRole) {
  return redirect("/dashboard/cliente");
}
```

## Reglas Actuales

| Usuario            | Destino Permitido    |
| ------------------ | -------------------- |
| `admin`            | `/dashboard/admin`   |
| `cliente` / `user` | `/dashboard/cliente` |
| Sin sesión         | `/test-auth`         |

## Flujo de Seguridad

```text
Petición → protectRoute()
         → Validar sesión
         → Validar rol
         → Permitir acceso / Redirigir
```

---

# 5. 🗄️ Modelo de Datos

## Tabla `User`

Gestionada por Better Auth y extendida con el campo `role`.

```ts
role: "admin" | "user";
```

Campos relevantes:

| Campo   | Tipo     | Descripción                       |
| ------- | -------- | --------------------------------- |
| `id`    | `string` | Identificador del usuario         |
| `email` | `string` | Correo de acceso                  |
| `name`  | `string` | Nombre visible                    |
| `role`  | `string` | Rol del sistema (`admin`, `user`) |

---

## Tabla `Archivo`

Representa cada fichero STL/OBJ asociado a un usuario.

| Campo            | Tipo            | Descripción                           |
| ---------------- | --------------- | ------------------------------------- |
| `id`             | `String (UUID)` | Identificador único                   |
| `nombre_archivo` | `String`        | Nombre original del archivo           |
| `url_path`       | `String`        | Ruta física en el servidor            |
| `estado`         | `Enum`          | `pendiente`, `recibido`, `completado` |
| `id_usuario`     | `String`        | Relación con `User.id`                |
| `prioridad`      | `String`        | `normal` o `urgente`                  |

## Relación Actual

```text
User (1) ──────── (N) Archivo
```

Un usuario puede tener múltiples archivos asociados.

---

# 6. 🚀 Estado de la Implementación

| Área                                         | Estado |
| -------------------------------------------- | ------ |
| Autenticación (Sign-up / Sign-in / Sign-out) | ✅     |
| RBAC y rutas protegidas                      | ✅     |
| Dashboards por rol                           | ✅     |
| Navbar dinámico                              | ✅     |
| Upload de STL con persistencia               | ✅     |
| Exportación PDF con datos reales             | ✅     |
| Configuración DX + Prettier + Astro          | ✅     |

---

# 7. 📌 Próximos Hitos

## Prioridad Alta

- [ ] Crear API de descarga segura para archivos en `/uploads`.
- [ ] Validar permisos antes de permitir la descarga.
- [ ] Implementar sistema de mensajería asociado a cada archivo.
- [ ] Añadir relación `Archivo → Mensajes (1:N)`.

---

## Mejoras de Interfaz

- [ ] Añadir buscador dinámico en la tabla de historial.
- [ ] Implementar filtros por estado y prioridad.
- [ ] Añadir paginación en dashboard de cliente.
- [ ] Mejorar feedback visual en subida de archivos.

---

## Escalabilidad Futura

- [ ] Sustituir SQLite por PostgreSQL.
- [ ] Migrar `/public/uploads` a almacenamiento externo (`S3`, `Cloudflare R2`).
- [ ] Añadir auditoría de acciones y trazabilidad.
- [ ] Implementar notificaciones en tiempo real.

---

# 📎 Resumen Arquitectónico

```text
Frontend  → Astro + Tailwind + TypeScript
Backend   → Astro SSR + API Routes
Auth      → Better Auth + RBAC
ORM       → Prisma Singleton
Database  → SQLite
Storage   → /public/uploads
Reports   → jsPDF + AutoTable
Security  → protectRoute(request, role)
```
