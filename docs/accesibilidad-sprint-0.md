# Accesibilidad del frontend en el Sprint 0

Esta guía define cómo revisar la base del frontend para que las personas ciegas puedan orientarse con un lector de pantalla y para que todas las pantallas se puedan usar con teclado. La revisión se repetirá al agregar cada historia. Este documento describe el plan; no reemplaza las pruebas ni sus evidencias.

## Criterios de revisión

| Aspecto | Criterios WCAG 2.2 relacionados | Cómo lo revisaremos |
| --- | --- | --- |
| Idioma y estructura | 3.1.1 Idioma de la página; 1.3.1 Información y relaciones; 2.4.2 Título de página | Comprobar `lang="es"`, títulos únicos, regiones de encabezado, navegación, contenido y pie, y jerarquía de encabezados. |
| Teclado y foco | 2.1.1 Teclado; 2.4.3 Orden del foco; 2.4.7 Foco visible; 2.4.11 Foco no oculto (mínimo) | Recorrer cada pantalla con Tab, Shift+Tab, Enter, Espacio y Escape cuando aplique. Verificar orden lógico y que el foco se vea y no quede cubierto. |
| Contraste | 1.4.3 Contraste mínimo; 1.4.11 Contraste no textual | Medir texto normal a 4.5:1, texto grande a 3:1 y los indicadores visuales necesarios para identificar controles y foco a 3:1. |
| Anuncios | 4.1.3 Mensajes de estado | Comprobar con lector de pantalla que carga, éxito y error se anuncian sin mover el foco. Los errores deben indicar una acción posible, como reintentar. |
| Formularios y autenticación | 3.3.1 Identificación de errores; 3.3.2 Etiquetas o instrucciones; 3.3.8 Autenticación accesible (mínimo) | En los sprints de formularios, revisar etiquetas, errores junto al campo, conservación de los datos y compatibilidad con NVDA. |

## Pruebas del Sprint 0

1. Navegar por la portada y `/base-tecnica` únicamente con teclado y confirmar que el enlace **Saltar al contenido** aparece al recibir foco.
2. Con NVDA, recorrer encabezado, navegación, contenido principal y pie. Confirmar que el idioma, el título y los encabezados ayudan a identificar la página.
3. En `/base-tecnica`, comprobar que el lector anuncia el estado de carga, el resultado o el error. En error, activar **Reintentar** con teclado.
4. Ejecutar axe y Lighthouse en la pantalla base publicada. Registrar hallazgos y evidencia; para el Sprint 0, Lighthouse Accesibilidad debe ser 90 o superior.

## Estado de la evidencia

El build local no demuestra accesibilidad en producción. Para cerrar esta revisión faltan la URL publicada de `/base-tecnica`, el resultado de Lighthouse y evidencia de la navegación con NVDA. Las pantallas y flujos que se implementen en sprints posteriores deben probarse cuando estén disponibles.
