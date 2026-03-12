
# 🗄️ Diseño de Base de Datos

Este documento describe la estructura de la base de datos utilizada en el proyecto **Laboratorio Dental**, incluyendo el modelo de datos, relaciones entre tablas y decisiones de diseño.

---

# 📦 Tecnología utilizada

| Tecnología | Motivo |
|------------|-------|
| **SQLite** | Base de datos ligera y portable |
| **Prisma ORM** | Tipado automático y consultas seguras |
| **better-sqlite3** | Driver rápido y compatible con Node |
| **Prisma Studio** | Visualización y depuración de datos |

Archivo físico de base de datos:

```

prisma/dev.db

```

---

# 🧱 Modelo general

La base de datos se divide en tres bloques principales:

```

Autenticación
Usuarios y Roles
Lógica de negocio

```

Representación simplificada:

```

User ─── Role
│
├── Session
├── Account
│
├── Archivo
├── Mensaje
└── Contacto

```

---

# 👥 Tabla: Roles

Tabla que define los distintos tipos de usuarios del sistema.

Tabla física:

```

roles

````

## Campos

| Campo | Tipo | Descripción |
|------|------|-------------|
| id_rol | Int | Identificador del rol |
| nombre_rol | String | Nombre del rol |
| descripcion | String | Descripción del rol |

## Modelo Prisma

```prisma
model Role {
  id          Int       @id @default(autoincrement()) @map("id_rol")
  nombre      String    @unique @map("nombre_rol")
  descripcion String?
  usuarios    User[]

  @@map("roles")
}
````

## Roles iniciales

```
admin
user
```

---

# 👤 Tabla: Usuarios

Tabla principal del sistema.

Contiene tanto:

* información de autenticación
* información de negocio

Tabla física:

```
usuarios
```

## Campos principales

| Campo         | Tipo     | Descripción           |
| ------------- | -------- | --------------------- |
| id            | String   | Identificador único   |
| nombre        | String   | Nombre del usuario    |
| email         | String   | Email único           |
| emailVerified | Boolean  | Verificación de email |
| createdAt     | DateTime | Fecha de creación     |
| updatedAt     | DateTime | Última actualización  |

## Gestión de roles

El sistema utiliza dos mecanismos:

| Campo  | Función                          |
| ------ | -------------------------------- |
| role   | Rol rápido usado por Better Auth |
| roleId | Relación con tabla `roles`       |

Esto permite mayor flexibilidad para permisos futuros.

## Modelo Prisma

```prisma
model User {
  id            String    @id
  name          String    @map("nombre")
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  roleId        Int?      @map("id_rol")
  roleRel       Role?     @relation(fields: [roleId], references: [id])

  role          String?   @default("user")
  banned        Boolean?  @default(false)
  banReason     String?
  banExpires    DateTime?

  archivos      Archivo[]
  mensajesEnv   Mensaje[] @relation("Enviados")
  mensajesRec   Mensaje[] @relation("Recibidos")
  contactos     Contacto[]

  sessions      Session[]
  accounts      Account[]

  @@map("usuarios")
}
```

---

# 🔐 Tablas del sistema de autenticación

Estas tablas son necesarias para **Better Auth**.

---

# 📋 Tabla: Session

Gestiona las sesiones activas de los usuarios.

Tabla física:

```
sesiones
```

## Campos

| Campo     | Tipo     | Descripción      |
| --------- | -------- | ---------------- |
| id        | String   | ID de sesión     |
| token     | String   | Token de sesión  |
| expiresAt | DateTime | Expiración       |
| userId    | String   | Usuario asociado |

Modelo Prisma:

```prisma
model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sesiones")
}
```

---

# 🔑 Tabla: Account

Gestiona cuentas de autenticación externas.

Ejemplos:

* OAuth
* login social
* credenciales internas

Tabla física:

```
cuentas
```

Modelo Prisma:

```prisma
model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime
  updatedAt             DateTime

  @@map("cuentas")
}
```

---

# ✔ Tabla: Verification

Tabla utilizada para procesos de verificación:

* verificación de email
* recuperación de contraseña

Tabla física:

```
verificaciones
```

Modelo Prisma:

```prisma
model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@map("verificaciones")
}
```

---

# 📁 Tabla: Archivos

Gestiona los archivos enviados por los clientes del laboratorio dental.

Tabla física:

```
archivos
```

## Campos

| Campo          | Tipo     | Descripción         |
| -------------- | -------- | ------------------- |
| id_archivo     | Int      | Identificador       |
| id_usuario     | String   | Usuario propietario |
| nombre_archivo | String   | Nombre del archivo  |
| estado         | String   | Estado del trabajo  |
| fecha_subida   | DateTime | Fecha de subida     |

Modelo Prisma:

```prisma
model Archivo {
  id_archivo     Int      @id @default(autoincrement())
  id_usuario     String
  nombre_archivo String
  estado         String   @default("pendiente") 
  fecha_subida   DateTime @default(now())
  usuario        User     @relation(fields: [id_usuario], references: [id], onDelete: Cascade)

  @@map("archivos")
}
```

---

# 💬 Tabla: Mensajes

Permite comunicación entre usuarios.

Tabla física:

```
mensajes
```

Modelo Prisma:

```prisma
model Mensaje {
  id_mensaje  Int      @id @default(autoincrement())
  id_emisor   String
  id_receptor String
  contenido   String
  fecha_envio DateTime @default(now())
  emisor      User     @relation("Enviados", fields: [id_emisor], references: [id], onDelete: Cascade)
  receptor    User     @relation("Recibidos", fields: [id_receptor], references: [id], onDelete: Cascade)

  @@map("mensajes")
}
```

---

# 📬 Tabla: Contactos

Formulario de contacto del sitio.

Tabla física:

```
contactos
```

Modelo Prisma:

```prisma
model Contacto {
  id_contacto Int      @id @default(autoincrement())
  nombre      String
  email       String
  mensaje     String
  fecha_envio DateTime @default(now())
  id_admin    String?
  admin       User?    @relation(fields: [id_admin], references: [id], onDelete: SetNull)

  @@map("contactos")
}
```

---

# 🔗 Relaciones principales

Relaciones clave del modelo:

```
Role 1 ─── N User
User 1 ─── N Archivo
User 1 ─── N Mensaje (emisor)
User 1 ─── N Mensaje (receptor)
User 1 ─── N Session
User 1 ─── N Account
User 1 ─── N Contacto
```

---

# 📊 Ventajas del diseño

✔ Separación entre autenticación y lógica de negocio
✔ Sistema de roles extensible
✔ Base preparada para crecimiento
✔ Relaciones claras entre entidades
✔ Integración directa con Prisma

---

# 🚀 Posibles mejoras futuras

* Tabla **Pedidos de laboratorio**
* Sistema de **estados de producción**
* Sistema de **notificaciones**
* Subida de **archivos STL o escaneos dentales**

```

