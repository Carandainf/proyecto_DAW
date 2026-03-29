# 🏗️ PROJECT_ARCHITECTURE.md

Arquitectura técnica actual del proyecto DAW.

---

## 📦 Tecnologías utilizadas

| Tecnología       | Uso                                   |
| ---------------- | ------------------------------------- |
| Astro 5.x        | Framework principal                   |
| TypeScript       | Tipado fuerte                         |
| Tailwind CSS     | Estilos                               |
| Prisma 7.5.x     | ORM                                   |
| SQLite           | Base de datos                         |
| Better Auth      | Sistema de autenticación              |
| better-sqlite3   | Driver SQLite                         |
| Node.js >= 20.19 | Runtime requerido                     |
| Prisma Studio    | Explorador visual de la base de datos |

---

## 🧱 Arquitectura general

El proyecto sigue una arquitectura por capas:

```text
UI (Astro + Tailwind)
│
▼
API endpoints de Astro
│
▼
Better Auth
│
▼
Prisma ORM
│
▼
SQLite
```

---

## 🔄 Flujo de autenticación

```text
Usuario
│
▼
/test-auth
│
▼
fetch()
│
▼
/api/auth-test/*
│
▼
Better Auth
│
▼
Prisma
│
▼
SQLite
```

Además existe el endpoint interno principal de Better Auth:

```text
/api/auth/*
```

Gestionado por:

```text
src/pages/api/auth/[...all]/route.ts
```

---

## 📂 Estructura actual del proyecto

```text
proyecto_DAW/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db
│
├── generated/
│   └── prisma/
│
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── prueba-db.astro
│   │   ├── test-auth.astro
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...all]/route.ts
│   │       └── auth-test/
│   │           ├── register.ts
│   │           ├── login.ts
│   │           ├── session.ts
│   │           └── logout.ts
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── auth.ts
│   │
│   └── styles/
│       └── global.css
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Base de datos

Se utiliza SQLite.

Archivo:

```text
prisma/dev.db
```

Tablas principales:

```text
Role
User
Session
Account
Verification
Archivo
Mensaje
Contacto
```

Better Auth utiliza principalmente:

```text
User
Session
Account
Verification
```

---

## 🔗 Prisma ORM

Prisma se encarga de:

* Generar tipos TypeScript.
* Conectar Astro con SQLite.
* Facilitar migraciones y consultas.

Cliente generado:

```text
generated/prisma/
```

Comando principal:

```bash
npx prisma generate
```

---

## 🔌 Cliente Prisma global

Archivo:

```text
src/lib/prisma.ts
```

Responsabilidad:

* Crear una única instancia de Prisma.
* Evitar múltiples conexiones durante hot reload.
* Centralizar el acceso a la base de datos.

---

## 🔐 Better Auth

Archivo principal:

```text
src/lib/auth.ts
```

Configuración actual:

* Prisma Adapter
* Login por email + contraseña
* Sesiones persistentes
* `expiresIn` para duración de sesión

Ejemplo:

```text
session: {
  expiresIn: 60 * 60 * 24 * 7
}
```

Variables necesarias:

```env
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:4321"
```

---

## 👥 Sistema de roles

Roles iniciales:

```text
admin
user
```

Modelo híbrido:

1. Campo rápido `role` en `User`
2. Relación `roleId` → `Role`

Esto permite:

* Acceso rápido para Better Auth
* Gestión avanzada de permisos desde Prisma

---

## 🌐 Endpoints de autenticación

### Endpoint interno de Better Auth

```text
/api/auth/*
```

Rutas soportadas:

```text
POST /api/auth/signUp
POST /api/auth/signIn
GET  /api/auth/session
POST /api/auth/signOut
```

### Endpoints de prueba del proyecto

```text
/api/auth-test/register
/api/auth-test/login
/api/auth-test/session
/api/auth-test/logout
```

Estos endpoints actuarán como capa intermedia entre la UI y Better Auth.

---

## 🧪 Páginas de prueba

### Base de datos

```text
src/pages/prueba-db.astro
```

Objetivo:

* Verificar conexión con Prisma.
* Mostrar roles existentes.

### Panel de autenticación

```text
src/pages/test-auth.astro
```

Objetivo:

* Register
* Login
* Session
* Logout

Decisiones técnicas:

* Formularios HTML nativos de Astro.
* No usar React.
* Uso de `fetch()`.
* Uso de URL absoluta.
* Uso de:

```ts
credentials: "include"
```

para mantener la cookie de sesión.

---

## 🚀 Estado actual

```text
✔ Astro funcionando
✔ Tailwind funcionando
✔ Prisma 7.5.x funcionando
✔ SQLite funcionando
✔ Better Auth funcionando
✔ Seed ejecutado
✔ Roles creados
✔ /prueba-db funcionando
⏳ /test-auth pendiente
```

---

## 🔮 Próximos pasos

1. Crear `/test-auth`.
2. Verificar registro y login.
3. Verificar persistencia de sesión.
4. Añadir protección de rutas.
5. Implementar autorización por roles.
6. Empezar CRUD principal del laboratorio dental.
