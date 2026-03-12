
# 🏗️ Arquitectura del Proyecto DAW

Este documento describe la arquitectura técnica del proyecto, incluyendo tecnologías utilizadas, estructura de carpetas y cómo interactúan los distintos componentes.

---

## 📦 Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| \*\*Astro 5.x\*\* | Framework principal del frontend |
| \*\*TypeScript\*\* | Tipado fuerte y desarrollo más seguro |
| \*\*Prisma ORM\*\* | Acceso a base de datos |
| \*\*SQLite\*\* | Base de datos local |
| \*\*Better Auth\*\* | Sistema de autenticación |
| \*\*better-sqlite3\*\* | Driver SQLite para Node |
| \*\*Node.js\*\* | Entorno de ejecución |
| \*\*Prisma Studio\*\* | Explorador visual de la base de datos |

---

## 🧱 Arquitectura general

El proyecto sigue una arquitectura simple basada en tres capas principales:

```

Frontend (Astro)
│
▼
API / Auth Layer
│
▼
Base de datos (SQLite + Prisma)

```

### Flujo de datos

```

Usuario
│
▼
Página Astro
│
▼
Auth Client (Better Auth)
│
▼
API /api/auth/\*
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

## 📂 Estructura del proyecto

Estructura simplificada:

```

proyecto\_DAW
│
├─ prisma/
│   ├─ schema.prisma
│   ├─ migrations/
│   └─ seed.ts
│
├─ generated/
│   └─ prisma/
│
├─ src/
│   │
│   ├─ pages/
│   │   ├─ index.astro
│   │   ├─ prueba-db.astro
│   │   │
│   │   └─ api/
│   │       └─ auth/
│   │           └─ \[...all]/
│   │               └─ route.ts
│   │
│   ├─ lib/
│   │   ├─ prisma.ts
│   │   ├─ auth.ts
│   │   └─ auth-client.ts
│   │
│   └─ components/
│
├─ .env
├─ package.json
└─ tsconfig.json

```

---

## 🗄️ Base de Datos

Se utiliza \*\*SQLite\*\* como base de datos principal.

Ventajas:

- No requiere servidor
- Archivo portable
- Ideal para desarrollo y proyectos académicos

Archivo de base de datos:

```

prisma/dev.db

```

---

@# 🔗 Prisma ORM

Prisma se encarga de:

- mapear las tablas a modelos TypeScript
- generar consultas tipadas
- facilitar migraciones

Cliente generado en:

```

generated/prisma

```

---

### 🔌 Cliente Prisma global

Archivo:

```

src/lib/prisma.ts

```

Responsabilidad:

- Crear una única conexión a la base de datos
- Evitar múltiples conexiones
- Servir como punto central de acceso a la DB

---

## 🔐 Sistema de Autenticación

Se utiliza \*\*Better Auth\*\* para gestionar:

- registro de usuarios
- login
- sesiones
- tokens

Configuración principal:

```

src/lib/auth.ts

```

Características:

- login con \*\*email y contraseña\*\*
- sesiones persistentes
- soporte de roles

---

## 👥 Sistema de Roles

El sistema de roles combina:

### Roles propios del proyecto

Tabla:

```

roles

```

Campos principales:

```

id\_rol
nombre\_rol
descripcion

```

Roles iniciales:

```

admin
user

```

### Campo de rol en usuario

En la tabla `User` existen dos mecanismos:

1️⃣ `role` → rol rápido usado por Better Auth  
2️⃣ `roleId` → relación con la tabla `Role`

Esto permite mayor flexibilidad en la gestión de permisos.

---

## 🌐 API de Autenticación

Endpoint principal:

```

/api/auth/\*

```

Archivo:

```

src/pages/api/auth/\[...all]/route.ts

```

Este endpoint funciona como \*\*ruta catch-all\*\* y gestiona automáticamente todas las rutas de autenticación.

Ejemplos de rutas manejadas:

```

POST /api/auth/signUp
POST /api/auth/signIn
GET  /api/auth/session
POST /api/auth/signOut

```

---

## 🖥️ Cliente de Autenticación

Archivo:

```

src/lib/auth-client.ts

```

Responsabilidad:

Permitir que el frontend interactúe con el sistema de autenticación.

Funciones disponibles:

```

signUp()
signIn()
signOut()
useSession()

```

---

## 🌱 Inicialización de datos

Script de seed:

```

prisma/seed.ts

```

Responsabilidad:

Crear datos iniciales en la base de datos, como los roles del sistema:

```

admin
user

```

---

## 🧪 Páginas de prueba

Página de prueba de base de datos:

```

src/pages/prueba-db.astro

```

Función:

- verificar conexión con la base de datos
- listar roles existentes
- comprobar funcionamiento de Prisma

---

## 🚀 Estado actual del proyecto

✔ Astro configurado  
✔ Prisma funcionando  
✔ Base de datos SQLite creada  
✔ Roles iniciales generados  
✔ Better Auth configurado  
✔ Endpoint de autenticación activo  
✔ Cliente de autenticación preparado  

---

## 🔮 Próximos pasos

1️⃣ Crear página de registro de usuarios  
2️⃣ Crear página de login  
3️⃣ Gestionar sesiones en el frontend  
4️⃣ Implementar panel de administración  
5️⃣ Integrar sistema de subida de archivos del laboratorio dental
```

---

