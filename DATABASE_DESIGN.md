# 🗄️ DATABASE_DESIGN.md

> Diseño integral de la base de datos del proyecto DAW: Sistema de Laboratorio Dental.
>
> Última actualización: `07/04/2026` · Versión actual: `v0.7.0`

---

# 📦 Stack Tecnológico de Datos

| Tecnología      | Versión | Motivo                                                      |
| --------------- | ------- | ----------------------------------------------------------- |
| `SQLite`        | Última  | Base de datos relacional ligera y portable para entorno DAW |
| `Prisma`        | `7.6.x` | ORM con tipado estricto y sincronización con TypeScript     |
| `Better Auth`   | `1.5.x` | Gestión de identidad con esquema extendido para roles       |
| `Prisma Studio` | Última  | Inspección y depuración visual de registros                 |

---

# 1. 🧱 Arquitectura del Esquema

La base de datos utiliza un esquema híbrido:

- Tablas gestionadas automáticamente por Better Auth.
- Tablas personalizadas para la lógica del laboratorio dental.

```text
┌────────────────────┐
│ AUTHENTICATION     │
├────────────────────┤
│ User               │
│ Session            │
│ Account            │
│ Verification       │
└────────────────────┘
            │
            ▼
┌────────────────────┐
│ BUSINESS LOGIC     │
├────────────────────┤
│ Archivo            │
│ Role               │
└────────────────────┘
```

---

## 🔐 Bloque de Autenticación

Gestionado por Better Auth.

### Tablas Principales

| Tabla          | Función                            |
| -------------- | ---------------------------------- |
| `User`         | Perfil del usuario autenticado     |
| `Session`      | Persistencia de sesión y cookies   |
| `Account`      | Relación con proveedor de login    |
| `Verification` | Flujos de verificación y seguridad |

### Característica Crítica

El campo `role` del usuario está habilitado para enviarse desde el frontend:

```ts
input: true;
```

Esto permite registrar usuarios directamente como `admin` o `user` durante pruebas.

---

## 🦷 Bloque de Producción

Gestiona los trabajos STL y la operativa interna del laboratorio.

### Entidades

| Entidad   | Función                                             |
| --------- | --------------------------------------------------- |
| `Archivo` | Representa un trabajo dental enviado por el usuario |
| `Role`    | Tabla maestra de permisos base                      |

---

# 2. 👤 Modelo `User`

Extiende el modelo estándar de Better Auth para soportar RBAC.

```prisma
model User {
  id            String    @id
  name          String    @map("nombre")
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime

  role          String?   @default("user")

  sessions      Session[]
  accounts      Account[]
  archivos      Archivo[]

  @@map("user")
}
```

## Campos Relevantes

| Campo      | Tipo        | Descripción                        |
| ---------- | ----------- | ---------------------------------- |
| `id`       | `String`    | Identificador único del usuario    |
| `name`     | `String`    | Nombre visible del usuario         |
| `email`    | `String`    | Correo único de acceso             |
| `role`     | `String`    | Rol del sistema (`admin`, `user`)  |
| `archivos` | `Archivo[]` | Relación 1:N con trabajos dentales |

## Reglas de Negocio

- Si no se especifica un rol, se asigna `user`.
- El rol determina el dashboard y permisos disponibles.
- Un usuario puede tener múltiples archivos asociados.

---

# 3. 📂 Modelo `Archivo`

Entidad principal para el seguimiento de trabajos enviados por clientes.

```prisma
model Archivo {
  id              Int       @id @default(autoincrement())
  id_usuario      String
  nombre_archivo  String
  url_path        String
  estado          String    @default("pendiente")
  prioridad       String    @default("normal")
  descripcion     String?
  fecha_subida    DateTime  @default(now())
  fecha_recepcion DateTime?

  usuario         User      @relation(fields: [id_usuario], references: [id])
}
```

## Campos del Modelo

| Campo             | Tipo        | Descripción                           |
| ----------------- | ----------- | ------------------------------------- |
| `id`              | `Int`       | Identificador autoincremental         |
| `id_usuario`      | `String`    | FK vinculada a `User.id`              |
| `nombre_archivo`  | `String`    | Nombre original del STL/OBJ           |
| `url_path`        | `String`    | Ruta física en el servidor            |
| `estado`          | `String`    | `pendiente`, `recibido`, `completado` |
| `prioridad`       | `String`    | `normal` o `urgente`                  |
| `descripcion`     | `String?`   | Observaciones técnicas                |
| `fecha_subida`    | `DateTime`  | Fecha de carga                        |
| `fecha_recepcion` | `DateTime?` | Fecha de inicio de procesamiento      |

---

## Estados Actuales del Trabajo

| Estado       | Significado                                 |
| ------------ | ------------------------------------------- |
| `pendiente`  | Archivo recibido, pendiente de revisión     |
| `recibido`   | El laboratorio ha iniciado el procesamiento |
| `completado` | Trabajo finalizado                          |

## Prioridades Disponibles

| Prioridad | Uso                       |
| --------- | ------------------------- |
| `normal`  | Flujo estándar            |
| `urgente` | Procesamiento prioritario |

---

# 4. 📬 Modelo Contacto (Trazabilidad y Seguridad)

> Modelo clave para cumplimiento RGPD y auditoría interna del laboratorio.

| Campo         | Tipo      | Descripción                                      |
| ------------- | --------- | ------------------------------------------------ |
| id            | Int       | PK autoincremental                               |
| nombre        | String    | Nombre del remitente                             |
| email         | String    | Email de contacto                                |
| mensaje       | String    | Contenido de la consulta                         |
| leido         | Boolean   | Control de estado (`default: false`)             |
| id_admin      | String?   | FK: ID del administrador que atendió la consulta |
| fecha_gestion | DateTime? | Timestamp de cuándo se resolvió la consulta      |

# 5. 🔗 Relaciones entre Tablas

## Relación Principal

```text
User (1) ──────────────── (N) Archivo
```

Un usuario puede tener múltiples trabajos.

Cada `Archivo` pertenece únicamente a un usuario.

## Relación de Auditoría:

// En el modelo Contacto:

```text
admin_gestor  User?  @relation(fields: [id_admin], references: [id])
```

## Relación Prisma

```prisma
usuario User @relation(fields: [id_usuario], references: [id])
```

---

# 6. 🧪 Seed Inicial y Datos Base

Se ha definido una semilla inicial para garantizar los roles mínimos del sistema.

## Roles Iniciales

| Rol     | Función                                   |
| ------- | ----------------------------------------- |
| `admin` | Gestión global del laboratorio            |
| `user`  | Cliente con acceso a sus propios archivos |

## Objetivo del Seed

- Facilitar pruebas rápidas.
- Evitar registros manuales repetitivos.
- Garantizar que existan perfiles administrativos desde el primer arranque.

---

# 7. 🔐 Seguridad y Restricciones de Acceso

La capa de datos debe validar siempre la relación entre sesión y `id_usuario`.

## Regla Crítica

Un usuario sólo puede consultar o descargar archivos cuyo `id_usuario` coincida con su sesión.

```ts
where: {
  id_usuario: session.user.id;
}
```

## Riesgo Evitado

Sin esta validación, un usuario podría acceder a archivos ajenos manipulando el ID desde la URL o la petición.

---

# 8. 🛡️ Integridad y Seguridad de Datos

    Aislamiento de Usuarios: Las consultas siempre filtran por session.user.id. Ningún usuario puede ver registros de Archivo que no le pertenezcan.

    Protección Anti-Spam: Aunque no se guarda en DB, la API valida el campo Honeypot antes de realizar el prisma.contacto.create.

    Tipado Seguro: Se utiliza npx prisma generate para sincronizar los modelos con las interfaces de TypeScript, evitando errores de "campo inexistente" en tiempo de compilación.

---

# 9. 🚀 Estado de Implementación

## 📦 Funcionalidades

| Funcionalidad                                   | Estado |
| ----------------------------------------------- | ------ |
| Migraciones Prisma ejecutadas                   | ✅     |
| Campo `prioridad` añadido                       | ✅     |
| Campo `descripcion` añadido                     | ✅     |
| Roles iniciales (`admin` / `user`)              | ✅     |
| Relación `User → Archivo` funcional             | ✅     |
| Captura automática de `id_usuario` desde sesión | ✅     |
| Datos integrados con exportación PDF            | ✅     |

---

## 🗄️ Modelo de Datos

| Tabla / Atributo | Estado | Notas                                               |
| ---------------- | ------ | --------------------------------------------------- |
| User (Roles)     | ✅     | Funcionando en login y registro                     |
| Archivo (STL)    | ✅     | Vinculado a la subida física de archivos            |
| Contacto         | ✅     | Soporte completo de trazabilidad administrativa     |
| Trazabilidad     | ✅     | Campos `id_admin` y `fecha_gestion` operativos      |
| Enums            | 🚧     | Pendiente migrar `String` a `Enum` nativo en Prisma |

---

# 10. 📌 Próximos Pasos en la Capa de Datos

## Modelo `Mensaje`

Se añadirá una tabla para permitir comentarios técnicos sobre cada archivo.

```text
Archivo (1) ──────────────── (N) Mensaje
```

Campos previstos:

| Campo        | Tipo     |
| ------------ | -------- |
| `id`         | UUID     |
| `id_archivo` | FK       |
| `id_usuario` | FK       |
| `contenido`  | Text     |
| `fecha`      | DateTime |

---

## Automatización de Estados

Se planea actualizar automáticamente `fecha_recepcion` cuando:

```text
estado = "recibido"
```

Opciones previstas:

- Trigger SQL
- Middleware Prisma
- Service Layer en backend

---

## Mejoras Futuras

- [ ] Sustituir campos `String` por `Enum` en `estado` y `prioridad`.
- [ ] Añadir índices en `id_usuario` y `estado`.
- [ ] Añadir borrado lógico (`deletedAt`).
- [ ] Migrar SQLite a PostgreSQL en producción.
- [ ] Incorporar auditoría y trazabilidad.

---

# 📎 Resumen del Modelo

```text
User
 ├── id
 ├── email
 ├── role
 └── archivos[]

Archivo
 ├── id_usuario
 ├── nombre_archivo
 ├── estado
 ├── prioridad
 ├── fecha_subida
 └── fecha_recepcion
```

```text
Tecnologías:
- SQLite
- Prisma
- Better Auth
- Prisma Studio
```

# 📎 Resumen Técnico

```text
    Motor: SQLite (Desarrollo) / Preparado para PostgreSQL.

    ORM: Prisma 7.x.

    Relaciones:

        User (1) ── (N) Archivo (Trabajos dentales)

        User (1) ── (N) Contacto (Auditoría de gestión de mensajes)

```
