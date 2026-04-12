# 🏗️ PROJECT_ARCHITECTURE.md

> Arquitectura técnica del proyecto DAW: Sistema de Gestión de Laboratorio Dental.

> Última actualización: `12/04/2026` · Versión actual: `v0.8.5`

---

# 📦 Stack Tecnológico

| Tecnología   | Versión | Uso                                       |
| ------------ | ------- | ----------------------------------------- |
| Astro        | 5.x     | Framework principal con renderizado SSR   |
| TypeScript   | Última  | Tipado estricto en toda la aplicación     |
| Tailwind CSS | 4.x     | Sistema de estilos nativo y variables CSS |
| Prisma       | 7.x     | ORM para acceso a SQLite                  |
| Better Auth  | 1.5.x   | Autenticación, sesión y RBAC              |
| jsPDF        | Última  | Generación de informes PDF en cliente     |
| SQLite       | 3.x     | Base de datos relacional ligera           |

---

# 1. 🧱 Arquitectura de Capas y Seguridad

El sistema utiliza una arquitectura SSR (Server-Side Rendering) para proteger la lógica de negocio y los datos sensibles.

## Capas del Sistema

### UI (Astro + Tailwind 4)

- Diseño basado en Bento Grid
- Interfaz adaptativa
- Soporte nativo para modo oscuro

### Seguridad (Honeypot & Auth)

- Protección anti-bots mediante campos invisibles (honeypot)
- Validación de sesión mediante cookies seguras

### Servidor (Astro Runtime)

- Endpoints API:
  - Autenticación
  - Gestión de archivos
  - Sistema de contacto
- Middleware `protectRoute(request, role)` para RBAC

### Persistencia (Prisma + SQLite)

- Acceso a datos mediante Prisma
- Patrón Singleton para optimizar conexiones

---

# 2. 🔐 Sistema de Seguridad y Roles (RBAC)

El control de acceso se centraliza mediante:

```ts
protectRoute(request, role)

Niveles de validación
Validación de sesión:
Verifica la cookie de Better Auth en cada request
Validación de rol:
Compara role (admin | user) con el requerido
Matriz de acceso
Usuario	Destino Permitido	Capa Legal
admin	/dashboard/admin	Acceso a gestión global
user	/dashboard/cliente	Acceso a sus pedidos
público	/	Formulario con Honeypot

# 3. 📂 Estructura del Proyecto
proyecto_DAW/
├── src/
│   ├── components/
│   │   ├── ContactForm.astro
│   │   ├── Footer.astro
│   │   └── Navbar.astro
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   └── prisma.ts
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   ├── contacto/enviar.ts
│   │   │   └── upload.ts
│   │   │
│   │   ├── dashboard/
│   │   ├── privacidad.astro
│   │   ├── aviso-legal.astro
│   │   └── cookies.astro
│
└── prisma/
    └── schema.prisma

# 4. 🗄️ Modelo de Datos y Trazabilidad

El sistema utiliza un modelo relacional que permite el seguimiento completo de las interacciones.

Tabla Archivo (Pedidos)
Relación: User (1) → (N) Archivo
Campos clave:
estado
prioridad (normal, urgente)
Tabla Contacto (Nuevo)

Diseñada para entornos multi-empleado:

id_admin → Identifica quién gestionó el mensaje
fecha_gestion → Timestamp de la acción
leido → Control de estado en dashboard
# 5. ⚖️ Cumplimiento Legal (LSSI-CE / RGPD)

La arquitectura incorpora una capa legal completa:

Privacidad
Información clara sobre tratamiento de datos personales
Cookies
Uso exclusivo de cookies técnicas (Better Auth)
No requiere banner de consentimiento (sin tracking externo)
Aviso Legal
Identificación del responsable del servicio

# 6. 🚀 Estado de la Implementación
Área	Estado
Autenticación con Roles	✅ Completado
Protección Anti-Spam (Honeypot)	✅ Completado
Páginas legales + Footer dinámico	✅ Completado
Trazabilidad de administración	✅ Completado
Dashboard Admin (CRUD pedidos)	🚧 En proceso
Mensajería interna por pedido	📅 Planificado
Generación de informes PDF	✅ Completado

# 📎 Resumen Arquitectónico
Frontend  → Astro (SSR) + Tailwind 4
Backend   → API Routes (Node.js)
Auth      → Better Auth + RBAC
Security  → Honeypot + Middlewares
Database  → SQLite
ORM       → Prisma
```
