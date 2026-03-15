# proyecto_DAW

> 🦷 Proyecto DAW: Sistema de gestión de laboratorio dental con Astro + TypeScript + SQLite + Prisma + Better-Auth

---

## 🚀 Tecnologías utilizadas

| Tecnología | Propósito |
|-----------|-----------|
| [Astro](https://astro.build/) | Framework principal |
| TypeScript | Tipado estricto y seguridad |
| [Prisma](https://www.prisma.io/) | ORM para SQLite |
| SQLite | Base de datos ligera |
| [Better-Auth](https://better-auth.com/) | Gestión de usuarios y autenticación |
| Node.js 22+ | Runtime del proyecto |

---

## 🗂 Estructura del proyecto

```text
/
├── prisma/                 # Esquema de base de datos y migraciones
├── src/
│   ├── pages/              # Páginas de Astro
│   │   ├── index.astro
│   │   └── prueba-db.astro
│   ├── lib/                # Utilidades, Prisma y Better-Auth
│   │   ├── prisma.ts
│   │   └── auth.ts
│   └── components/         # Componentes UI (Astro/React)
├── generated/              # Prisma Client generado
├── package.json
├── tsconfig.json
├── .env                    # Variables de entorno
└── README.md
````

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
BETTER_AUTH_SECRET="<tu_secreto_256_caracteres>"
BETTER_AUTH_URL="http://localhost:4321"
```

4. Generar Prisma Client:

```bash
npx prisma generate
```

5. Ejecutar servidor de desarrollo:

```bash
npm run dev
```

Visita [http://localhost:4321](http://localhost:4321) para ver la aplicación.

---

## 🔑 Autenticación

* Usuarios gestionados con **Better-Auth**.
* Roles: `admin` y `user`.
* Login por **email + contraseña**.
* Sesiones persistentes en SQLite.

---

## ⚡ Comandos útiles

| Comando                  | Descripción                           |
| ------------------------ | ------------------------------------- |
| `npm run dev`            | Ejecuta el servidor local             |
| `npm run build`          | Genera build de producción            |
| `npm run preview`        | Previsualiza el build generado        |
| `npx prisma studio`      | Explora la base de datos              |
| `npx tsx prisma/seed.ts` | Inserta datos iniciales (roles, etc.) |

---

## 📌 Notas

* Se ha integrado **Prisma Client** con **Better-Auth** usando adaptador SQLite.
* La base de datos inicial contiene los roles: `admin` y `user`.
* Se recomienda **no subir archivos sensibles** (`.env`, `dev.db`) gracias a `.gitignore`.

---

## 📂 Próximos pasos

1. Implementar **inicio de sesión y registro** con Better-Auth.
2. Añadir **permisos por rol** en la aplicación.
3. Completar **interfaz de gestión de usuarios y archivos**.
4. Documentar **Security Model** (pendiente).

---

## 📎 Referencias

* [Astro Docs](https://docs.astro.build)
* [Prisma Docs](https://www.prisma.io/docs/)
* [Better-Auth Docs](https://better-auth.com/)

```
