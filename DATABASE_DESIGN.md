# 🗄️ DATABASE_DESIGN.md

Diseño actual de la base de datos del proyecto DAW.

---

# 📦 Tecnología utilizada

| Tecnología     | Motivo                          |
| -------------- | ------------------------------- |
| SQLite         | Base de datos ligera y portable |
| Prisma 7.5.x   | ORM con tipado automático       |
| better-sqlite3 | Driver SQLite para Node         |
| Better Auth    | Gestión de usuarios y sesiones  |
| Prisma Studio  | Exploración visual de datos     |

Archivo físico:

```text
prisma/dev.db
```

Requisito:

```text
Node.js >= 20.19
```

---

# 🧱 Modelo general

La base de datos se divide en tres bloques:

```text
Autenticación
Usuarios y roles
Lógica de negocio
```

Relación simplificada:

```text
Role 1 ─── N User
              │
              ├── Session
              ├── Account
              ├── Archivo
              ├── Mensaje
              └── Contacto
```

---

# 👥 Tabla: Role

Tabla física:

```text
roles
```

Modelo:

```prisma
model Role {
  id          Int      @id @default(autoincrement()) @map("id_rol")
  nombre      String   @unique @map("nombre_rol")
  descripcion String?
  usuarios    User[]

  @@map("roles")
}
```

Roles iniciales:

```text
admin
user
```

---

# 👤 Tabla: User

Tabla física:

```text
usuarios
```

Responsabilidades:

* Datos de autenticación
* Datos de negocio
* Relación con roles
* Relación con sesiones y cuentas

Modelo:

```prisma
model User {
  id            String    @id
  name          String    @map("nombre")
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  role          String?   @default("user")

  roleId        Int?      @map("id_rol")
  roleRel       Role?     @relation(fields: [roleId], references: [id])

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

El usuario tiene dos mecanismos de rol:

```text
role    -> rápido, usado por Better Auth
roleId  -> relación real con la tabla Role
```

---

# 🔐 Tabla: Session

Tabla física:

```text
sesiones
```

Modelo:

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

Esta tabla almacena las sesiones persistentes generadas por Better Auth.

`expiresAt` depende de:

```ts
session: {
  expiresIn: 60 * 60 * 24 * 7
}
```

---

# 🔑 Tabla: Account

Tabla física:

```text
cuentas
```

Modelo:

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

Actualmente el proyecto usa principalmente autenticación por email + contraseña.

---

# ✔ Tabla: Verification

Tabla física:

```text
verificaciones
```

Modelo:

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

Se utilizará para:

* Recuperación de contraseña
* Verificación de email

---

# 📁 Tabla: Archivo

Tabla física:

```text
archivos
```

Modelo:

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

# 💬 Tabla: Mensaje

Tabla física:

```text
mensajes
```

Modelo:

```prisma
model Mensaje {
  id_mensaje  Int      @id @default(autoincrement())
  id_emisor   String
  id_receptor String
  contenido   String
  fecha_envio DateTime @default(now())

  emisor      User @relation("Enviados", fields: [id_emisor], references: [id], onDelete: Cascade)
  receptor    User @relation("Recibidos", fields: [id_receptor], references: [id], onDelete: Cascade)

  @@map("mensajes")
}
```

---

# 📬 Tabla: Contacto

Tabla física:

```text
contactos
```

Modelo:

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

```text
Role     1 ─── N User
User     1 ─── N Archivo
User     1 ─── N Mensaje (emisor)
User     1 ─── N Mensaje (receptor)
User     1 ─── N Session
User     1 ─── N Account
User     1 ─── N Contacto
```

---

# 📊 Ventajas del diseño

* Separación entre autenticación y lógica de negocio.
* Compatible con Better Auth.
* Sistema de roles extensible.
* Preparado para permisos futuros.
* Preparado para CRUD y panel de administración.

---

# 🚀 Próximo paso

```text
Implementar /test-auth para probar:
- Register
- Login
- Session
- Logout
```
