# 🦷 proyecto_DAW: Sistema de gestión de laboratorio dental

> Proyecto de Ciclo Formativo de Grado Superior (DAW) desarrollado con el stack más moderno: Astro 5 + TypeScript + Tailwind CSS 4 + SQLite + Prisma + Better Auth.

---

## 🚀 Tecnologías utilizadas

| Tecnología        | Propósito                                 |
| ----------------- | ----------------------------------------- |
| Astro 5.x         | Framework principal (SSR Mode)            |
| TypeScript        | Tipado estricto y seguridad               |
| Tailwind CSS 4.x  | Estilos y diseño nativo mediante PostCSS  |
| Prisma 7.x        | ORM para gestión de SQLite                |
| SQLite            | Base de datos relacional ligera           |
| Better Auth 1.5.6 | Autenticación avanzada y gestión de roles |
| Node.js >= 20.19  | Runtime de ejecución                      |

---

## 🗂 Estructura del proyecto

```text
/
├── prisma/
│   ├── schema.prisma      # Definición de tablas (User, Session, Account, etc.)
│   └── dev.db             # Base de datos local (SQLite)
├── src/
│   ├── components/
│   │   └── Navbar.astro   # Navegación dinámica según el ROL del usuario
│   ├── layouts/
│   │   └── Layout.astro   # Estructura base HTML5 + Tailwind 4
│   ├── lib/
│   │   ├── prisma.ts      # Cliente de base de datos
│   │   └── auth.ts        # Configuración de Better Auth + Helpers de Roles
│   ├── pages/
│   │   ├── api/auth/
│   │   │   └── [...all].ts # Endpoint central de autenticación (Handler)
│   │   ├── dashboard/
│   │   │   ├── admin/      # Vistas protegidas para Administradores
│   │   │   └── cliente/    # Vistas protegidas para Clientes/Usuarios
│   │   ├── index.astro
│   │   └── test-auth.astro # Panel de pruebas de autenticación
│   └── styles/
│       └── global.css     # Importación de Tailwind CSS 4
├── astro.config.mjs       # Configuración SSR (Node Adapter)
├── package.json
└── README.md

---

## 🔑 Autenticación y Control de Acceso

El sistema utiliza Better Auth 1.5 con una lógica de persistencia basada en cookies y validación en el servidor.
Funcionalidades implementadas:

    ✅ Registro/Login con validación de credenciales.

    ✅ Gestión de Roles: Soporte para roles admin y user desde la base de datos.

    ✅ Protección de Rutas: Helper protectRoute que verifica sesión y rol antes de renderizar la página.

    ✅ Redirección Automática:

        Login -> /dashboard/admin (si es administrador).

        Login -> /dashboard/cliente (si es usuario estándar).

    ✅ Navbar Dinámico: Muestra enlaces específicos (Panel Admin / Mis Pedidos) basándose en el estado de la sesión.

Endpoints de Autenticación (v1.5.6):
Acción	                Ruta API	              Método
Registro	            /api/auth/sign-up/email	   POST
Login	                /api/auth/sign-in/email	   POST
Sesión	              /api/auth/get-session	     GET
Logout	              /api/auth/sign-out	       POST

---

## 🛠 Instalación y Puesta en Marcha

    Clonar y entrar en la carpeta:
    Bash

    git clone [https://github.com/Carandainf/proyecto_DAW.git](https://github.com/Carandainf/proyecto_DAW.git)
    cd proyecto_DAW

    Instalar dependencias:
    Bash
    npm install

    Configurar variables de entorno (.env):
    Fragmento de código

    DATABASE_URL="file:./prisma/dev.db"
    BETTER_AUTH_SECRET="tu_secreto_aleatorio_aqui"
    BETTER_AUTH_URL="http://localhost:4321"

    Sincronizar Base de Datos:
    Bash
    npx prisma db push
    npx prisma generate

    Lanzar en desarrollo:
    Bash
    npm run dev

---

##⚡ Comandos de Utilidad
Comando	                   Acción
npx prisma studio	         Abre un explorador visual para la base de datos SQLite.
npm run build	             Genera la versión de producción para Node.js.
npx prisma db seed	       Ejecuta el volcado de datos iniciales (si existe seed.ts).

---

## 🎨 Configuración de Tailwind CSS 4

En esta versión ya no se usan los archivos de configuración .js extensos. Se utiliza la directiva de importación nativa en src/styles/global.css:
CSS

@import "tailwindcss";

---

## 🚧 Estado del Desarrollo

    [x] Configuración SSR con Astro 5.

    [x] Integración de Prisma + SQLite.

    [x] Sistema de Autenticación con Roles (Admin/User).

    [x] Middlewares de protección de rutas.

    [x] Navbar dinámico funcional.

    [x] Generación de informes PDF automáticos.

    [x] Sistema de roles Admin/Cliente con dashboards independientes.

    [ ] Implementación de CRUD de pedidos dentales.

    [ ] Diseño final de interfaces del Dashboard.


```
