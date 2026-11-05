# Estudiemos · Frontend

Base del frontend del Sprint 0: React, TypeScript, Vite, Tailwind CSS, rutas, estructura común, pantalla 404 y portada basada en la guía visual compartida. Incluye `/base-tecnica` para mostrar el dato que llega desde la API.

## Requisitos

- Node.js 20 o superior
- npm

## Ejecutar en desarrollo

1. Copia `.env.example` a `.env`.
2. Cuando el equipo publique el endpoint público de la API que devuelve el dato de Firestore, asigna su URL a `VITE_API_URL`.
3. Instala dependencias y ejecuta `npm run dev`.

La pantalla `/base-tecnica` espera un endpoint `GET` público configurado en `VITE_API_URL`. Contrato inicial sugerido: respuesta JSON `{ "message": "Mensaje de bienvenida" }` con estado HTTP 200. La interfaz también muestra respuestas JSON con otro formato para facilitar la integración. Errores deben responder con estado HTTP no exitoso. El backend debe permitir por CORS el origen de Vercel.

La página muestra estados de carga, error con botón **Reintentar** y éxito. Sin `VITE_API_URL`, explica que falta configurar la conexión. No incluyas secretos en `VITE_*`: el valor queda visible en el navegador.

## Compilar y servir con Docker

Desde esta carpeta, ejecuta `docker build -t estudiemos-frontend .` y luego `docker run -p 8080:80 estudiemos-frontend`.

`VITE_API_URL` se incorpora durante la compilación del frontend. Define su valor al ejecutar `docker build` (por ejemplo con `--build-arg VITE_API_URL=https://...`) cuando la API esté disponible.

## Rutas base

`/`, `/base-tecnica`, `/beneficios`, `/como-funciona`, `/ingresar`, `/registro`, `/registro/usuario`, `/panel`, `/perfil`, `/salas`, `/salas/nueva`, `/salas/unirse`, `/salas/:id`, `/ayuda` y `/accesibilidad`. Las pantallas de historias futuras son estructuras de navegación para sus sprints correspondientes.
