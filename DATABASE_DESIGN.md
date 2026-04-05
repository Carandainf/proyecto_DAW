# 🗄️ DATABASE_DESIGN.md

Diseño actual de la base de datos del proyecto DAW.

---

# 📦 Tecnología utilizada

| Tecnología     | Motivo                              |
| -------------- | ----------------------------------- |
| SQLite         | Base de datos relacional portable   |
| Prisma 7.6.0   | ORM con tipado estricto (v7.6.0)    |
| Better Auth    | Gestión de usuarios, roles y tokens |
| Prisma Studio  | GUI para administración de datos    |

---

# 🧱 Modelo de Datos (Esquema)

El sistema utiliza un esquema híbrido donde conviven las tablas requeridas por **Better Auth** y las tablas personalizadas del **Laboratorio Dental**.

### Bloque: Autenticación (Managed by Better Auth)
* **usuarios**: Almacena credenciales, perfiles y el ROL activo (`role`).
* **sesiones**: Tokens activos y tiempos de expiración.
* **cuentas**: Vinculación de métodos de acceso (email/password).
* **verificaciones**: Tokens de seguridad para email/pass.

### Bloque: Negocio (Custom Logic)
* **roles**: Definición maestra de permisos (`admin`, `user`).
* **archivos**: Gestión de trabajos dentales subidos por clientes.
* **mensajes**: Comunicación interna entre admin y clientes.
* **contactos**: Registro de formularios de contacto.

---

# 👤 Tabla: User (usuarios)

Es la tabla central. Se ha extendido para soportar el sistema de roles de Better Auth.

```prisma
model User {
  id            String    @id
  name          String    @map("nombre")
  email         String    @unique
  role          String?   @default("user") // Campo clave para Better Auth 1.5
  
  // Relación opcional con tabla maestra de roles
  roleId        Int?      @map("id_rol")
  roleRel       Role?     @relation(fields: [roleId], references: [id])
  
  // ... resto de campos (archivos, sesiones, etc.)
}

Nota técnica: Actualmente, la lógica de acceso en Astro se basa en el campo role de tipo String, que es inyectado en la sesión por Better Auth.

---

# 📊 Estado de Implementación de Datos

    [x] Esquema Prisma sincronizado (v7.6.0).

    [x] Seed inicial de roles ejecutado.

    [x] Relaciones User -> Session operativas.

    [x] Persistencia de cookies configurada a 7 días.

    [ ] Implementar lógica CRUD para la tabla Archivo.

    [ ] Implementar sistema de mensajería entre roles.

---

# 🎯 Próximos Pasos (Implementación)

1. Crear el formulario de subida de trabajos (Tabla Archivo).
2. Vincular cada archivo subido con el ID del usuario en sesión.
3. Crear vista de "Mis Trabajos" para el rol 'user'.

