# 🗄️ DATABASE_DESIGN.md

Diseño integral de la base de datos del proyecto DAW (Laboratorio Dental).

---

# 📦 Tecnología utilizada

| Tecnología       | Motivo                               |
| ---------------- | ------------------------------------ |
| SQLite           | Base de datos relacional portable    |
| Prisma 7.6.0     | ORM con tipado estricto (v7.6.0)     |
| Better Auth 1.5  | Gestión de usuarios, roles y tokens  |
| Prisma Studio    | GUI para administración de datos     |

---

# 🧱 Modelo de Datos (Esquema)

El sistema utiliza un esquema híbrido donde conviven las tablas requeridas por **Better Auth** y las tablas personalizadas del **Laboratorio**.

### Bloque: Autenticación (Managed by Better Auth)
* **usuarios**: Almacena credenciales, perfiles y el ROL activo (`role`).
* **sesiones**: Tokens activos y tiempos de expiración.
* **cuentas**: Vinculación de métodos de acceso (email/password).
* **verificaciones**: Tokens de seguridad para email/pass.

### Bloque: Negocio (Custom Logic)
* **archivos**: Gestión técnica de trabajos dentales (STL), metadatos y estados de fabricación.
* **roles**: Definición maestra de permisos (`admin`, `user`).
* **mensajes**: (Pendiente) Comunicación interna vinculada a cada orden.
* **contactos**: Registro de formularios de contacto externos.

---

# 👤 Tabla: User (usuarios)

Extensión del modelo de Better Auth para soportar el sistema de permisos del laboratorio.

```prisma
model User {
  id        String    @id
  name      String    @map("nombre")
  email     String    @unique
  role      String?   @default("user") // Inyectado en sesión por Better Auth 1.5
  
  // Relación con tabla maestra de roles (Opcional/Legacy)
  roleId    Int?      @map("id_rol")
  roleRel   Role?     @relation(fields: [roleId], references: [id])
  
  // Relación con producción
  archivos  Archivo[]
}

model Archivo {
  id_archivo      Int       @id @default(autoincrement())
  id_usuario      String    // FK vinculada a User.id
  nombre_archivo  String    // Nombre original del fichero
  url_path        String    // Ubicación en /public/uploads/
  estado          String    @default("pendiente") // pendiente, recibido, terminado
  prioridad       String    @default("normal")    // normal, urgente
  descripcion     String?   // Notas técnicas del facultativo
  fecha_subida    DateTime  @default(now())
  fecha_recepcion DateTime? // Fecha en la que el admin inicia el trabajo
}
```
📊 Estado de Implementación de Datos

    [x] Esquema Prisma sincronizado: Actualizado a v7.6.0 con soporte para metadatos de archivos.

    [x] Seed inicial: Roles maestros (admin/user) insertados.

    [x] Persistencia Física: Sistema de subida a /public/uploads operativo.

    [x] Lógica de Identidad: El id_usuario se captura automáticamente de la sesión activa al subir.

    [ ] CRUD de Lectura: Implementar el listado histórico en el Dashboard de Cliente.

    [ ] Gestión de Estados: Crear lógica para que el Admin cambie el estado y asigne fecha_recepcion.
  
  
  🎯 Próximos Pasos (Implementación)

    Vincular la tabla Archivo con la UI del Dashboard (Zona 3).

    Crear el flujo de administración para que el laboratorio gestione los pedidos entrantes.

    Implementar limpieza automática de archivos huérfanos en el servidor (opcional).

