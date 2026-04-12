# 🦷 proyecto_DAW: Sistema de Gestión de Laboratorio Dental

> Proyecto de Ciclo Formativo de Grado Superior (DAW) desarrollado con arquitectura moderna SSR, tipado estricto y control de acceso por roles.

> Última actualización: `07/04/2026` · Versión actual: `v0.7.0`

---

# 📦 Stack Tecnológico

| Tecnología   | Versión | Uso                                                         |
| ------------ | ------- | ----------------------------------------------------------- |
| Astro        | 5.x     | Framework principal con SSR                                 |
| TypeScript   | Última  | Tipado estricto en toda la aplicación                       |
| Tailwind CSS | 4.x     | Estilos con enfoque **CSS-first** (`@import "tailwindcss"`) |
| Prisma       | 7.x     | ORM para acceso a SQLite                                    |
| SQLite       | Última  | Base de datos relacional ligera                             |
| Better Auth  | 1.5.x   | Autenticación + RBAC                                        |
| Node.js      | >=20.19 | Runtime de ejecución                                        |

---

# 🧱 Arquitectura General

```text
CLIENTE (Astro + Tailwind)
│
├── UI dinámica (Bento Grid)
├── Formularios (Contacto + Auth)
└── Generación PDF (jsPDF)
│
▼
SERVIDOR (Astro SSR)
│
├── API Routes (/auth, /upload, /contacto)
├── Middleware (RBAC con protectRoute)
└── Prisma Client (Singleton)
│
▼
DATOS
│
├── SQLite (prisma/dev.db)
└── Storage (/public/uploads)
```

# 📂 Estructura del Proyecto

```text
/
├── prisma/
│   ├── schema.prisma
│   └── dev.db
│
├── public/
│   └── uploads/
│
├── src/
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── ContactForm.astro     # Formulario con Honeypot
│   │   └── Footer.astro          # Footer corporativo
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── auth.ts
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/[...all].ts
│   │   │   └── contacto/
│   │   │       └── enviar.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   └── cliente/
│   │   │
│   │   ├── privacidad.astro
│   │   ├── aviso-legal.astro
│   │   ├── cookies.astro
│   │   ├── test-auth.astro
│   │   └── index.astro
│   │
│   └── styles/
│       └── global.css
│
├── astro.config.mjs
├── package.json
└── README.md
```

# 🔐 Autenticación y Control de Acceso (RBAC)

Sistema basado en Better Auth con validación en servidor.

Funcionalidades
Registro y login con validación segura
Gestión de roles (admin, user)
Middleware protectRoute(request, role)
Redirecciones automáticas tras login
Navbar dinámico según sesión
Flujo

Login → Validación sesión → Validación rol
→ /dashboard/admin | /dashboard/cliente

# Endpoints de Autenticación

| Acción   | Ruta                    | Método |
| -------- | ----------------------- | ------ |
| Registro | /api/auth/sign-up/email | POST   |
| Login    | /api/auth/sign-in/email | POST   |
| Sesión   | /api/auth/get-session   | GET    |
| Logout   | /api/auth/sign-out      | POST   |

# 🛡️ Seguridad y Protección de Datos

El sistema implementa medidas avanzadas orientadas a seguridad y cumplimiento legal:

Honeypot Anti-Bot: Protección invisible en formularios sin CAPTCHA
Prevención SQL Injection: Uso de Prisma (queries parametrizadas)
RBAC en servidor: Validación de sesión y rol en cada request
Cumplimiento RGPD/LSSI:
Página de privacidad
Aviso legal
Política de cookies técnicas

# 📊 Base de Datos y Trazabilidad

El sistema utiliza Prisma sobre SQLite con modelo orientado a trazabilidad.

Características
Relación User → Archivo (1:N)
Persistencia de trabajos STL/OBJ
Control de estado (pendiente, recibido, completado)
Sistema de Contacto
Registro de usuario que envía el mensaje
Identificación del administrador que lo gestiona (id_admin)
Registro temporal de gestión (fecha_gestion)

# 🛠 Instalación y Puesta en Marcha

1. Clonar repositorio
   git clone https://github.com/Carandainf/proyecto_DAW.git
   cd proyecto_DAW
2. Instalar dependencias
   npm install
3. Variables de entorno
   DATABASE_URL="file:./prisma/dev.db"
   BETTER_AUTH_SECRET="tu_secreto"
   BETTER_AUTH_URL="http://localhost:4321"
4. Base de datos
   npx prisma db push
   npx prisma generate
5. Desarrollo
   npm run dev

# ⚡ Comandos de Utilidad

Comando Acción
npx prisma studio UI para explorar la DB
npm run build Build de producción
npx prisma db seed Datos iniciales

# 🎨 Configuración Tailwind CSS 4

Configuración CSS-first sin plugins adicionales en Astro:

@import "tailwindcss";

✔ Astro 5 detecta automáticamente Tailwind
✔ No requiere configuración JS adicional

# 🚀 Estado del Desarrollo

Funcionalidades completadas
SSR con Astro 5
Prisma + SQLite
Autenticación con roles (RBAC)
Middleware de protección de rutas
Navbar dinámico
Sistema de subida de archivos STL
Sistema de contacto con Honeypot
Arquitectura legal (RGPD / LSSI)
Trazabilidad de mensajes (admin + timestamp)

# En progreso

Diseño final del dashboard
CRUD completo de trabajos dentales
Exportación PDF avanzada

# 🔮 Roadmap Técnico

API segura de descarga de archivos
Sistema de mensajería por archivo
Filtros y buscador en dashboard
Migración a PostgreSQL
Storage externo (S3 / R2)
Auditoría y logs de actividad

# 📎 Documentación Técnica

DEV_NOTES.md → Historial técnico
PROJECT_ARCHITECTURE.md → Arquitectura
DATABASE_DESIGN.md → Base de datos

# 🧠 Resumen

Frontend → Astro + Tailwind + TypeScript
Backend → Astro SSR + API Routes
Auth → Better Auth + RBAC
ORM → Prisma
DB → SQLite
Storage → /public/uploads
Security → protectRoute + Honeypot

---
