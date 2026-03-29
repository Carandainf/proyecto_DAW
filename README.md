# proyecto_DAW

> 🦷 Proyecto DAW: Sistema de gestión de laboratorio dental con Astro + TypeScript + Tailwind CSS + SQLite + Prisma + Better Auth

---

## 🚀 Tecnologías utilizadas

| Tecnología                               | Propósito                           |
| ---------------------------------------- | ----------------------------------- |
| [Astro](https://astro.build/)            | Framework principal                 |
| TypeScript                               | Tipado estricto y seguridad         |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos de la aplicación            |
| [Prisma 7.x](https://www.prisma.io/)     | ORM para SQLite                     |
| SQLite                                   | Base de datos ligera                |
| [Better Auth](https://better-auth.com/)  | Gestión de usuarios y autenticación |
| Node.js >= 20.19                         | Runtime requerido por Prisma 7.x    |

---

## 🗂 Estructura del proyecto

```text
/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── prueba-db.astro
│   │   └── test-auth.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── auth.ts
│   └── styles/
│       └── global.css
├── generated/
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ Configuración local

1. Clonar el repositorio:

```bash
git clone https://github.com/Carandainf/proyecto_DAW.git
cd proyecto_DAW
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno (`.env`):

```env
DATABASE_URL="file:./prisma/dev.db"
BETTER_AUTH_SECRET="<secret aleatorio>"
BETTER_AUTH_URL="http://localhost:4321"
```

4. Requisitos:

* Node.js >= 20.19
* Prisma Client generado correctamente

5. Generar Prisma Client:

```bash
npx prisma generate
```

6. Ejecutar seed inicial:

```bash
npx tsx prisma/seed.ts
```

7. Ejecutar servidor de desarrollo:

```bash
npm run dev
```

Visita [http://localhost:4321] para ver la aplicación.

---

## 🔑 Autenticación

* Better Auth configurado con Prisma Adapter.
* Registro e inicio de sesión mediante email + contraseña.
* Sesiones persistentes almacenadas en SQLite.
* Better Auth usa `expiresIn` para la duración de sesión.
* Roles iniciales creados mediante seed: `admin` y `user`.

---

## ⚡ Comandos útiles

| Comando                  | Descripción                    |
| ------------------------ | ------------------------------ |
| `npm run dev`            | Ejecuta el servidor local      |
| `npm run build`          | Genera build de producción     |
| `npm run preview`        | Previsualiza el build generado |
| `npx prisma generate`    | Genera Prisma Client           |
| `npx prisma studio`      | Explora la base de datos       |
| `npx tsx prisma/seed.ts` | Inserta datos iniciales        |

---

## 📌 Estado actual

* Conexión a SQLite funcionando.
* Prisma Client generado correctamente.
* Seed ejecutado con roles iniciales.
* Better Auth configurado y conectado a Prisma.
* Página `/prueba-db` funcionando.
* Tailwind CSS configurado.
* Proyecto funcionando correctamente en varios equipos mediante GitHub.

---

## 📌 Notas

* Prisma 7.x requiere Node.js >= 20.19.
* Better Auth está configurado y conectado correctamente con Prisma.
* La conexión a base de datos SQLite ya está verificada.
* Existe una página de prueba (`/prueba-db`) para comprobar acceso a la base de datos.
* La siguiente página en desarrollo es `/test-auth` para probar:

  * Register
  * Login
  * Session
  * Logout
* No subir `.env` ni `prisma/dev.db` al repositorio.

---

## 📂 Próximos pasos

1. Crear `/test-auth` con formularios de:

   * Register
   * Login
   * Session
   * Logout
2. Añadir protección de rutas según sesión.
3. Implementar autorización basada en roles.
4. Comenzar CRUD principal del laboratorio dental.

---

## 📎 Referencias

* [https://docs.astro.build](https://docs.astro.build)
* [https://www.prisma.io/docs/](https://www.prisma.io/docs/)
* [https://better-auth.com/](https://better-auth.com/)
* [https://tailwindcss.com/](https://tailwindcss.com/)

