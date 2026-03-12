# 📚 Notas Técnicas del Proyecto DAW
Guía detallada de configuración y pasos seguidos durante el desarrollo.

Este documento recoge todos los pasos técnicos realizados, incluyendo comandos, decisiones y estructura de archivos.

---

# 🧱 1. Configuración inicial de la base de datos con Prisma

Se decidió usar SQLite para simplificar el desarrollo y cumplir los requisitos del proyecto, además de poder probarlo en local

### Instalación de dependencias

```bash
npm install prisma @types/node @types/better-sqlite3 --save-dev
npm install @prisma/client @prisma/adapter-better-sqlite3 dotenv
````

### Inicialización de Prisma

```bash
npx prisma init --datasource-provider sqlite --output ../generated/prisma
```

Esto crea:

```
prisma/
 ├─ schema.prisma
 ├─ migrations/
.env
prisma.config.ts
generated/prisma/
```

### Configuración del `.env`

```
DATABASE\_URL="file:./prisma/dev.db"
```

---

# 🧬 2. Esquema de Base de Datos

Se creó un esquema personalizado combinando:

* Necesidades del proyecto
* Campos requeridos por **Better Auth**

Tablas principales:

* `Role`
* `User`
* `Session`
* `Account`
* `Verification`
* `Archivo`
* `Mensaje`
* `Contacto`

El esquema usa mapeos (`@map`) para mantener nombres de tablas en español.

Ejemplo:

```prisma
model Role {
  id          Int       @id @default(autoincrement()) @map("id\_rol")
  nombre      String    @unique @map("nombre\_rol")
  descripcion String?
  usuarios    User\[]

  @@map("roles")
}
```

---

# ⚙️ 3. Generación del cliente Prisma

Después de definir el esquema:

```bash
npx prisma generate
```

Esto crea el cliente tipado en:

```
generated/prisma/
```

---

# 🔌 4. Cliente Prisma global

Para evitar **múltiples conexiones a la base de datos**, se creó un cliente global.

Archivo:

```
src/lib/prisma.ts
```

Código:

```ts
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = process.env.DATABASE\_URL!;
const adapter = new PrismaBetterSqlite3({ url: connectionString });

const prisma = new PrismaClient({ adapter });

export { prisma };
```

---

# 🌱 5. Script de inicialización de datos (Seed)

Archivo:

```
prisma/seed.ts
```

Objetivo: crear roles iniciales.

```ts
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {

  await prisma.role.upsert({
    where: { nombre: "admin" },
    update: {},
    create: {
      nombre: "admin",
      descripcion: "Control total del laboratorio dental"
    }
  });

  await prisma.role.upsert({
    where: { nombre: "user" },
    update: {},
    create: {
      nombre: "user",
      descripcion: "Cliente que sube trabajos"
    }
  });

  console.log("✅ Roles creados");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Ejecución:

```bash
npx tsx prisma/seed.ts
```

---

# 🔎 6. Prueba de acceso a base de datos en Astro

Archivo:

```
src/pages/prueba-db.astro
```

Código:

```astro
---
import { prisma } from "@/lib/prisma";
import type { Role } from "../../generated/prisma/client";

let roles: Role\[] = \[];
let errorMensaje: string | null = null;

try {
    roles = await prisma.role.findMany();
} catch (e: any) {
    errorMensaje = e.message;
}
---

<h1>Prueba de Base de Datos</h1>

<ul>
{
roles.map((role) => (
<li>
<strong>{role.nombre}</strong>: {role.descripcion}
</li>
))
}
</ul>

{errorMensaje<p>Error: {errorMensaje}</p>}
```

Servidor:

```
npm run dev
```

URL:

```
http://localhost:4321/prueba-db
```

---

# 🔐 7. Instalación de Better Auth

Instalación:

```bash
npm install better-auth
```

---

# 🔑 8. Variables de entorno para autenticación

Archivo `.env`

```
DATABASE\_URL="file:./prisma/dev.db"

BETTER\_AUTH\_SECRET=<secreto-256-caracteres>
BETTER\_AUTH\_URL=http://localhost:4321
```

### Generar secret de 256 caracteres

En Windows con Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(192).toString('base64'))"
```

---

# 🧠 9. Instancia de Better Auth

Archivo:

```
src/lib/auth.ts
```

Código:

```ts
import "dotenv/config";
import { betterAuth } from "better-auth";
import { prisma } from "@/lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite"
    }),

    emailAndPassword: {
        enabled: true
    },

    roles:\["admin", "user"],

    session: {
        expiresIn: 60 \* 60 \* 24 \* 7
    },

    secret: process.env.BETTER\_AUTH\_SECRET!,
    baseUrl: process.env.BETTER\_AUTH\_URL ?? "http://localhost:4321",
});
```

Nota importante:

Se cambió `maxAge` → `expiresIn` porque la API actual de Better Auth ya no usa `maxAge`.

---

# 🌐 10. Endpoint de autenticación

Archivo:

```
src/pages/api/auth/\[...all]/route.ts
```

Código:

```ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

Este endpoint gestiona automáticamente:

```
/api/auth/signUp
/api/auth/signIn
/api/auth/session
/api/auth/signOut
```

---

# 🖥️ 11. Cliente de autenticación para frontend

Archivo:

```
src/lib/auth-client.ts
```

Código:

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER\_AUTH\_URL ?? "http://localhost:4321",
});

export const { signUp, signIn, signOut, useSession } = authClient;
```

Permite usar desde el frontend:

```
signUp()
signIn()
signOut()
useSession()
```

---

# 📌 Estado actual

✔ Prisma configurado
✔ Base de datos SQLite operativa
✔ Roles iniciales creados
✔ Cliente Prisma global
✔ Página de prueba de DB funcionando
✔ Better Auth instalado
✔ Endpoint `/api/auth` creado
✔ Cliente frontend preparado

---

# 🚀 Próximos pasos

1. Crear `test-auth.astro`
2. Probar registro de usuario
3. Probar login
4. Verificar sesiones en la base de datos
5. Integrar roles personalizados con el sistema de permisos

```

