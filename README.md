# Estudiemos - Frontend

Este es el frontend que estoy preparando para el Sprint 0. Está hecho con React, TypeScript, Vite y Tailwind CSS. Por ahora tiene la página de inicio, la navegación, las rutas iniciales y la pantalla para revisar la conexión con la API.

## Lo que necesito

- Node.js 20 o una versión más reciente
- npm

## Ejecutarlo en mi computador

1. Copia `.env.example` y ponle el nombre `.env`.
2. Cuando esté lista la API, agrega su URL en la variable `VITE_API_URL` del archivo `.env`. Esa URL debe apuntar al endpoint que devuelve el dato guardado en Firestore.
3. Abre una terminal en esta carpeta y ejecuta:

   ```bash
   npm install
   npm run dev
   ```

La pantalla `/base-tecnica` consulta el endpoint con una petición `GET`. Para empezar, propongo que la API responda con estado HTTP 200 y un JSON como este:

```json
{ "message": "Mensaje de bienvenida" }
```

Si el backend usa otro formato, se puede ajustar la lectura de la respuesta en `src/services/baseApi.ts`. Cuando haya un error, la API debe responder con un estado HTTP distinto de 2xx. También debe permitir por CORS el origen donde se publique el frontend en Vercel.

En `/base-tecnica` se ven los estados de carga, error y éxito. Si todavía no se ha configurado `VITE_API_URL`, la pantalla avisa que falta la conexión. No pongas contraseñas ni claves secretas en variables `VITE_*`, porque sus valores quedan visibles en el navegador.

## Ejecutarlo con Docker

Desde esta carpeta, construye la imagen y levántala así:

```bash
docker build -t estudiemos-frontend .
docker run -p 8080:80 estudiemos-frontend
```

La URL de `VITE_API_URL` se incluye al compilar. Cuando la API esté disponible, pásala durante la construcción de la imagen:

```bash
docker build --build-arg VITE_API_URL=https://tu-api.onrender.com/api/estado -t estudiemos-frontend .
```

## Publicarlo en Vercel

Importa el repositorio del frontend en Vercel. El proyecto usa Vite, así que la compilación es `npm run build` y la carpeta generada es `dist`.

En la configuración del proyecto, agrega `VITE_API_URL` con la URL pública de Render seguida de `/api/archetype/data`. Define esa variable para Preview y Production. La URL del backend se debe confirmar con el equipo antes de publicarlo.

Vercel puede generar una vista previa para la rama de esta historia y publicar producción desde `main` cuando se integre el pull request. El archivo `vercel.json` permite que las rutas de React Router, como `/base-tecnica`, sigan abriendo al recargar la página.

## Rutas que dejé creadas

`/`, `/base-tecnica`, `/beneficios`, `/como-funciona`, `/ingresar`, `/registro`, `/registro/usuario`, `/panel`, `/perfil`, `/salas`, `/salas/nueva`, `/salas/unirse`, `/salas/:id`, `/ayuda` y `/accesibilidad`.

Las rutas de las historias que vienen después están creadas como base de navegación. Las completaré en los sprints que correspondan.
