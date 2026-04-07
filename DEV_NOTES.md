# 📚 DEV_NOTES.md

> Guía técnica detallada del proyecto DAW: Sistema de Laboratorio Dental.
>
> Última actualización: `07/04/2026` · Versión actual: `v0.7.0`

---

# 🗓 Historial y Actualizaciones

| Fecha        | Versión  | Descripción                                                                                                                                                                              |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `07/04/2026` | `v0.7.0` | Documentación y DX. Implementada exportación a PDF corporativo con `jsPDF`, configuración avanzada de entorno (`Prettier` + `Astro`) y resolución de conflictos de tipos en formularios. |
| `05/04/2026` | `v0.6.0` | Gestión de archivos. Implementado endpoint de subida STL, almacenamiento físico en `/public/uploads` y vinculación con ID de usuario.                                                    |
| `03/04/2026` | `v0.5.0` | Middleware y roles. Implementada protección `protectRoute`, navbar dinámico y redirecciones automáticas según rol (`Admin` / `Cliente`).                                                 |
| `01/04/2026` | `v0.4.0` | Bento Grid. Interfaz adaptativa en `/test-auth`, corrección de botones y visualización JSON en tiempo real.                                                                              |

---

# 1. ⚙️ Configuración del Entorno de Desarrollo (DX)

Objetivo: mantener consistencia de formato, evitar conflictos de indentación y asegurar compatibilidad con archivos `.astro`.

## Extensiones Requeridas

- `astro-build.astro-vscode` → Formateador oficial de Astro.
- `esbenp.prettier-vscode` → Motor de reglas y formato.

## Dependencias NPM

```bash
npm install -D prettier prettier-plugin-astro
```

## Configuración recomendada de VS Code / Antigravity

```json
{
  "editor.formatOnSave": true,
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  }
}
```

## Resultado Esperado

- Autoformateo al guardar.
- Compatibilidad total con componentes Astro.
- Eliminación de errores de indentación y formato inconsistentes.

---

# 2. 🗄 Cliente Prisma Global (Singleton)

**Archivo:** `src/lib/prisma.ts`

Se utiliza un patrón Singleton para evitar el agotamiento de conexiones a la base de datos durante el `Hot Reload` en desarrollo.

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

## Beneficios

- Evita múltiples instancias de `PrismaClient`.
- Reduce fugas de memoria y errores de conexión.
- Compatible con SSR y recarga en caliente.

---

# 3. 🔐 Lógica de Autenticación y Roles

## Configuración de Roles Dinámicos

**Archivo:** `src/lib/auth.ts`

Se habilita la entrada del rol desde el frontend para facilitar pruebas de distintos perfiles durante el registro.

```ts
additionalFields: {
  role: {
    type: "string",
    required: false,
    defaultValue: "user",
    input: true
  }
}
```

### Comportamiento

- Si no se envía un rol, se asigna `user`.
- El frontend puede enviar `admin`, `cliente`, etc.
- Útil para pruebas internas y entornos de staging.

---

## Protección de Rutas

La función `protectRoute(request, role)` centraliza la seguridad de acceso.

### Responsabilidades

1. Verificar que exista una sesión activa.
2. Obtener el rol del usuario autenticado.
3. Comparar el rol requerido con el rol actual.
4. Retornar una redirección si el acceso no es válido.

```ts
const result = await protectRoute(request, "admin");

if (result.redirect) {
  return result.redirect;
}
```

### Flujo de Acceso

```text
Usuario → Login → Validación de sesión → Validación de rol
       → Acceso permitido / Redirección automática
```

---

# 4. 📄 Gestión Documental: Generación de PDF

Se implementa la exportación del historial utilizando:

- `jsPDF`
- `jspdf-autotable`

## Arquitectura

La generación del PDF ocurre en el cliente (`client-side`) para reducir carga del servidor.

```ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
```

## Transferencia de Datos

Astro inyecta directamente los datos de la base de datos al navegador mediante:

```astro
define:vars={{ todosLosTrabajos }}
```

Esto evita llamadas API adicionales para construir el documento.

## Diseño Visual del PDF

| Elemento           | Color               |
| ------------------ | ------------------- |
| Acentos            | `#06B6D4`           |
| Cabeceras de tabla | `#020617`           |
| Fondo / Contraste  | Blanco + Gris suave |

## Objetivo

Generar un PDF profesional, alineado con la identidad visual del proyecto y descargable desde el historial de trabajos.

---

# 5. 🌐 Endpoints de API y Flujo de Datos

## Autenticación Oficial

Se utiliza el endpoint catch-all de Better Auth:

```text
src/pages/api/auth/[...all].ts
```

Responsabilidad:

- Login
- Logout
- Registro
- Recuperación de sesión
- Middleware interno de autenticación

---

## Subida de Archivos

**Archivo:** `src/pages/api/upload.ts`

### Flujo

1. Recibe `multipart/form-data`.
2. Renombra el archivo usando un timestamp único.
3. Guarda el fichero en:

```text
/public/uploads
```

4. Vincula el archivo al usuario autenticado.

### Ejemplo de nombre generado

```text
1744012301234-modelo.stl
```

---

## Seguridad en Peticiones Fetch

Todas las peticiones desde el cliente deben incluir:

```ts
fetch("/api/upload", {
  method: "POST",
  credentials: "include",
  body: formData,
});
```

### Motivo

`credentials: "include"` garantiza que las cookies de sesión viajen junto a la petición.

Sin esta opción:

- El backend no detecta la sesión.
- El usuario aparece como no autenticado.
- La petición puede fallar con `401 Unauthorized`.

---

# 6. 🧯 Solución de Errores Críticos (Troubleshooting)

## Error `ts(2345)`

Problema habitual al acceder a `e.target` dentro de formularios.

### Solución

```ts
const target = e.target as HTMLFormElement;
```

---

## Error `ts(18046)`

TypeScript considera `err` como `unknown` dentro de `catch`.

### Solución

```ts
catch (err) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}
```

---

## Detección Incorrecta de Rol Tras Login

Problema:

- El usuario inicia sesión.
- La redirección ocurre antes de que el cliente conozca el rol actualizado.

### Solución Aplicada

Forzar una llamada adicional a `get-session` inmediatamente después del login.

```ts
await authClient.getSession();
```

Esto asegura que el rol ya esté disponible antes de decidir la redirección.

---

# 7. 🚀 Estado Actual del Proyecto

| Módulo                        | Estado |
| ----------------------------- | ------ |
| SSR Mode (`output: "server"`) | ✅     |
| Registro / Login / RBAC       | ✅     |
| Protección de rutas por rol   | ✅     |
| Historial dinámico            | ✅     |
| Exportación PDF profesional   | ✅     |
| DX y autoformateo             | ✅     |

---

# 8. 📌 Próximos Objetivos

## Prioridad Alta

- [ ] Crear una API de descarga segura para servir archivos desde una carpeta protegida.
- [ ] Implementar sistema de mensajería y comentarios por archivo.
- [ ] Desarrollar un panel de administración global para gestión de estados de trabajo.

## Mejoras Futuras

- [ ] Añadir trazabilidad de cambios por usuario.
- [ ] Generar historial de auditoría.
- [ ] Añadir notificaciones en tiempo real.
- [ ] Migrar almacenamiento local a servicio externo (`S3`, `Cloudflare R2`, etc.).

---

# 📎 Resumen Técnico

```text
Frontend: Astro + TypeScript
Auth: Better Auth
ORM: Prisma
Storage: /public/uploads
PDF: jsPDF + jspdf-autotable
SSR: output = "server"
RBAC: protectRoute(request, role)
```
