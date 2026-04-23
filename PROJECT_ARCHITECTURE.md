# 🏗️ PROJECT_ARCHITECTURE.md

> Arquitectura técnica del proyecto DAW: Sistema de Gestión de Laboratorio Dental.

> Última actualización: `23/04/2026` · Versión actual: `v0.8.5`

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
| NodeMailer   | Última  | Motor de notificaciones por email         |

---

# 1. 🧱 Arquitectura de Capas y Flujos

El sistema se divide en cuatro capas claramente diferenciadas para asegurar la escalabilidad:

A. Capa de Presentación (UI)

      Astro Islands: Uso de componentes estáticos para el contenido y componentes hidratados solo donde es necesario.

      Bento Grid Layout: Estructura visual para el Dashboard de administración.

B. Capa de Aplicación (Servidor Astro)

      API Routes: Endpoints dedicados para:

          /api/auth/*: Ciclo de vida de la sesión.

          /api/upload: Lógica de recepción de archivos STL con validación de metadatos.

          /api/contacto: Procesamiento de mensajes con integración de email.

      Middleware: Validación de privilegios antes de renderizar rutas protegidas.

C. Capa de Seguridad (Multi-nivel)

      Frontend: Honeypot invisible en formularios para mitigación de bots.

      Transferencia: Validación en servidor de archivos (máx. 20MB, extensión .stl, sanitización de nombres).

      Acceso: Cookies httpOnly gestionadas por Better Auth.

D. Capa de Datos (Prisma + SQLite)

      Patrón Singleton: Garantiza una única instancia de conexión a la base de datos.

      Esquema Relacional: Trazabilidad completa entre el usuario facultativo y sus archivos/mensajes.

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

El diseño de la base de datos pone especial énfasis en la trazabilidad clínica:

    Entidad Archivo: No solo almacena la ruta del STL, sino también el estado del proceso (pendiente, recibido, completado) y la prioridad.

    Entidad Mensaje: Incluye campos para la gestión administrativa:

        id_admin: Quién ha gestionado la consulta.

        fecha_gestion: Marca de tiempo de la respuesta.

        leido: Flag de control para el flujo de trabajo del laboratorio.

# 5. ⚖️ Cumplimiento Legal (LSSI-CE / RGPD)

Cumplimiento normativo integrado en el diseño:

    RGPD: Implementación de persistencia de datos bajo consentimiento en el registro.

    LSSI-CE: Páginas legales dinámicas que se excluyen del indexado de búsqueda en el Footer si es necesario.

    Cookies: Sistema de identidad basado únicamente en cookies técnicas esenciales.

# 6. 🚀 Estado de la Implementación
Área	                      Estado	          Detalle
Autenticación (RBAC)        ✅ Completado     Registro, Login y Roles operativos.
Dashboards (Admin/User)     ✅ Completado     Paneles funcionales y vinculados a DB.
Seguridad de Archivos       ✅ Completado     Validación de tamaño, tipo y sanitización.
Sistema de Contacto         ✅ Completado     Honeypot + Integración Nodemailer.
Arquitectura Legal          ✅ Completado     Footer condicional y textos legales.
Refinamiento UI             🚧 En proceso     Pulido estético de la landing page.
UX de Transferencia         📅 Planificado     Barras de progreso para subida de STL.

# 📎 Resumen Arquitectónico
Frontend           → Astro (SSR) + Tailwind 4 + TypeScript
Backend            → API Routes (Node.js) + NodeMailer
Auth               → Better Auth + RBAC
Security           → Honeypot + Middlewares
Persistencia       → Prisma ORM + SQLite
```
