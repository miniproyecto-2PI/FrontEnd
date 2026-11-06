# 🚀 Salón de Estudio Colaborativo en Tiempo Real — Frontend

Aplicación web desarrollada con **React**, **TypeScript**, **Vite** y **Tailwind CSS**. Este repositorio contiene la interfaz del Sprint 0: navegación, rutas iniciales, diseño adaptable y la conexión de prueba con el endpoint REST del backend, que lee un dato guardado en Firestore.

La aplicación se publica en **Vercel**. El backend REST se ejecuta en **Render**.

---

## 📋 Tabla de Contenidos

- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración de Variables de Entorno](#-configuración-de-variables-de-entorno)
- [Ejecución en Desarrollo Local](#-ejecución-en-desarrollo-local)
- [Ejecución con Docker](#-ejecución-con-docker)
- [Despliegue en Vercel](#-despliegue-en-vercel)
- [Rutas Disponibles](#-rutas-disponibles)
- [Integración con el Backend](#-integración-con-el-backend)

---

## 🏛️ Arquitectura del Proyecto

El navegador carga la aplicación React y consulta el endpoint HTTP del backend para mostrar los datos leídos desde Firestore.

```text
[ Navegador / React + TypeScript ]
             │
             │ GET VITE_API_URL (JSON)
             ▼
[ Backend REST en Render ]
             │
             ▼
[ Google Cloud Firestore ]
```

1. **Interfaz y rutas (`src/App.tsx`)**: encabezado, navegación, pie de página, pantallas base y página 404.
2. **Integración HTTP (`src/services/baseApi.ts`)**: consulta el endpoint configurado, interpreta la respuesta y muestra el dato recibido.
3. **Estilos (`src/index.css`)**: estilos globales, componentes visuales y adaptación a distintos tamaños de pantalla.
4. **Configuración de Vite (`vite.config.ts`)**: herramientas de desarrollo y Tailwind CSS.

---

## 📦 Requisitos Previos

- **Node.js**: versión 20 o superior.
- **npm**: incluido con Node.js.
- **Docker** (opcional para ejecutar la versión de producción en un contenedor).

---

## 📂 Estructura del Directorio

```text
FrontEnd/
├── .env.example                 # Plantilla de configuración pública, sin credenciales
├── .gitignore                   # Excluye variables locales y archivos generados
├── Dockerfile                   # Imagen de producción servida por Nginx
├── nginx.conf                   # Configuración para servir la SPA y sus rutas
├── vercel.json                  # Reescritura para rutas de React Router
├── package.json
├── index.html
├── src/
│   ├── App.tsx                  # Rutas, estructura común y estados de la API
│   ├── index.css                # Estilos de la aplicación
│   ├── main.tsx                 # Punto de entrada de React
│   └── services/
│       └── baseApi.ts            # Consulta y lectura de la respuesta del backend
└── .github/workflows/           # Despliegue y revisión Lighthouse
```

---

## 🔑 Configuración de Variables de Entorno

Copie `.env.example` como `.env` para trabajar localmente:

```bash
cp .env.example .env
```

Configure la dirección completa del endpoint REST:

```ini
VITE_API_URL=https://tu-api.onrender.com/api/archetype/data
```

Reemplace `tu-api` por el nombre real del servicio en Render. Para ejecutar contra el backend local use `http://localhost:3000/api/archetype/data`. El archivo `.env.example` solo contiene valores de ejemplo; el valor real se configura en el `.env` local y en las variables de Vercel.

Vite incorpora las variables con prefijo `VITE_` al código que recibe el navegador. Esta URL es pública; no almacene contraseñas, tokens ni credenciales en variables `VITE_*`. Los archivos `.env` locales están excluidos de Git; `.env.example` contiene solo el valor público de ejemplo.

En Vercel, cree `VITE_API_URL` como variable de tipo **Config** para los entornos **Production** y **Preview**. Después de crearla o cambiarla, genere un nuevo despliegue: la variable se incorpora durante la compilación y no modifica despliegues ya publicados.

---

## 💻 Ejecución en Desarrollo Local

1. Instale las dependencias:

   ```bash
   npm ci
   ```

2. Inicie Vite:

   ```bash
   npm run dev
   ```

3. Abra la dirección que muestra la terminal, normalmente `http://localhost:5173`.

Para generar una compilación de producción:

```bash
npm run build
npm run preview
```

La compilación queda en `dist/`.

---

## 🐳 Ejecución con Docker

Construya la imagen desde esta carpeta. La URL de la API se define al compilar la aplicación:

```bash
docker build --build-arg VITE_API_URL=https://tu-api.onrender.com/api/archetype/data -t estudiemos-frontend .
docker run --rm -p 8080:80 estudiemos-frontend
```

La aplicación estará disponible en `http://localhost:8080`. Si se cambia el endpoint, vuelva a construir la imagen para incluir el nuevo valor.

---

## ☁️ Despliegue en Vercel

1. Importe este repositorio como proyecto en [Vercel](https://vercel.com/).
2. Configure `VITE_API_URL` con el endpoint REST indicado arriba, en **Settings → Environment Variables**, para **Production** y **Preview**.
3. Use `npm run build` como comando de compilación y `dist` como carpeta de salida; Vercel los detecta automáticamente para Vite.
4. Despliegue la rama de trabajo para obtener una vista previa. La publicación de producción ocurre al integrar cambios en `main`, según los workflows configurados en `.github/workflows/`.

Las rutas de React Router se pueden abrir directamente o recargar gracias a `vercel.json`. Los workflows de GitHub Actions requieren los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`. El token debe ser un Access Token de Vercel; nunca se guarda en el frontend ni en el repositorio.

---

## 🧭 Rutas Disponibles

| Ruta | Pantalla |
|---|---|
| `/` | Inicio |
| `/base-tecnica` | Estado de conexión y dato del backend |
| `/beneficios` | Beneficios |
| `/como-funciona` | Cómo funciona |
| `/ingresar` | Inicio de sesión (pantalla base) |
| `/registro` y `/registro/usuario` | Registro (pantallas base) |
| `/panel`, `/perfil` | Pantallas base de usuario |
| `/salas`, `/salas/nueva`, `/salas/unirse`, `/salas/:id` | Pantallas base de salas |
| `/ayuda`, `/accesibilidad` | Ayuda y declaración de accesibilidad |
| Cualquier ruta desconocida | Página 404 |

Las pantallas señaladas como base son parte del mapa de navegación; sus flujos funcionales se desarrollan en los sprints correspondientes.

---

## 🔌 Integración con el Backend

La ruta `/base-tecnica` envía una petición `GET` a `VITE_API_URL` y desactiva la caché para que al recargar se consulte el dato actual. La respuesta esperada es el JSON del endpoint REST:

```json
{
  "success": true,
  "message": "Dato leído exitosamente desde Firestore",
  "data": {
    "projectName": "Salón de Estudio Colaborativo en Tiempo Real"
  }
}
```

La interfaz muestra el contenido de `data` y contempla los estados **cargando**, **error** (con botón **Reintentar**) y **éxito**. El backend debe permitir por CORS el dominio de Vercel y responder con un estado HTTP no exitoso cuando falle la lectura.

La integración utiliza el servicio **REST** `https://tu-api.onrender.com/api/archetype/data`. La URL `https://tu-backend-realtime.onrender.com` corresponde al servicio Realtime y no es el endpoint HTTP de datos que consume esta pantalla.

Si el despliegue muestra “La conexión con la API aún no está configurada”, compruebe el nombre exacto `VITE_API_URL`, que esté habilitada para el entorno del despliegue (Production o Preview, según corresponda), y que se haya creado un nuevo despliegue después de guardarla. Si aparece un error de carga, revise que el endpoint responda y que CORS permita el origen de Vercel.
