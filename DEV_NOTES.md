# 📚 DEV_NOTES.md

Guía técnica detallada del proyecto DAW.

---

# 1. Base de datos con Prisma + SQLite

Se decidió usar SQLite para simplificar el desarrollo local y cumplir los requisitos del proyecto.

## Instalación inicial

```bash
npm install prisma @prisma/client
npm install -D @types/node tsx
```

## Inicialización de Prisma

```bash
npx prisma init --datasource-provider sqlite
```

Archivos creados:

```text
prisma/
├── schema.prisma
.env
```

## Variables de entorno

Archivo `.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET="<secret aleatorio>"
BETTER_AUTH_URL="http://localhost:4321"
```

---

# 2. Prisma 7.x y requisito de Node.js

Prisma 7.x requiere:

```text
Node.js >= 20.19
```

Versión actual usada en el proyecto:

```text
Prisma 7.5.x
```

Después de cualquier cambio en `schema.prisma`:

```bash
npx prisma generate
```

---

# 3. Esquema actual de base de datos

Tablas principales del proyecto:

* `Role`
* `User`
* `Session`
* `Account`
* `Verification`
* `Archivo`
* `Mensaje`
* `Contacto`

Better Auth utiliza especialmente:

* `User`
* `Session`
* `Account`
* `Verification`

Roles iniciales definidos:

* `admin`
* `user`

---

# 4. Cliente Prisma global

Archivo:

```text
src/lib/prisma.ts
```

Código actual:

```ts
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaBetterSqlite3({
  url: connectionString,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Se usa un singleton para evitar múltiples conexiones durante hot reload.

---

# 5. Seed inicial

Archivo:

```text
prisma/seed.ts
```

Objetivo:

* Crear rol `admin`
* Crear rol `user`

Ejecución:

```bash
npx tsx prisma/seed.ts
```

Resultado esperado:

```text
✅ Roles creados
```

---

# 6. Prueba de conexión a la base de datos

Archivo:

```text
src/pages/prueba-db.astro
```

Objetivo:

* Verificar que Astro puede leer desde Prisma.
* Confirmar que los roles seed existen.

URL:

```text
http://localhost:4321/prueba-db
```

Estado:

```text
✔ Funcionando
```

---

# 7. Better Auth

Instalación:

```bash
npm install better-auth
```

Archivo principal:

```text
src/lib/auth.ts
```

Código base:

```ts
import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
});
```

Nota importante:

```text
Better Auth actual usa `expiresIn`, no `maxAge`.
```

---

# 8. Arquitectura actual

Flujo del proyecto:

```text
UI (Astro)
↓
API endpoints de Astro
↓
Better Auth
↓
Prisma
↓
SQLite
```

---

# 9. Tailwind CSS

Tailwind ya está instalado y funcionando.

Archivos relevantes:

```text
src/styles/global.css
src/layouts/Layout.astro
```

VS Code configurado con soporte para Tailwind en archivos `.astro`.

---

# 10. Próxima implementación: `/test-auth`

Página prevista:

```text
src/pages/test-auth.astro
```

Endpoints previstos:

```text
src/pages/api/auth-test/register.ts
src/pages/api/auth-test/login.ts
src/pages/api/auth-test/session.ts
src/pages/api/auth-test/logout.ts
```

Funcionalidades del panel:

* Register
* Login
* Session
* Logout

Decisiones tomadas:

* Usar formularios HTML de Astro.
* No usar eventos React.
* Usar `fetch()`.
* Usar URL absoluta:

```text
http://localhost:4321/api/auth-test/...
```

* Incluir siempre:

```ts
credentials: "include"
```

para que las cookies de sesión funcionen correctamente.

---

# 11. Estado actual

```text
✔ SQLite funcionando
✔ Prisma 7.5.x funcionando
✔ Better Auth funcionando
✔ Tailwind funcionando
✔ Seed ejecutado
✔ Proyecto funcionando en varios equipos
✔ /prueba-db funcionando
⏳ /test-auth pendiente
```
