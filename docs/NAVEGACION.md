# Navegación y recursos disponibles

Incremento local del 14 de noviembre de 2026 del cambio `actualizar-v1-contenido-y-bosque`. La entrada sigue en `index.js`, que carga `expo-router/entry`. Las rutas y layouts están en `src/app/`; estado, pantallas, contenido y utilidades quedan fuera.

## Recorrido

| Ruta | Destino |
| --- | --- |
| `/` | Inicio, saludo, árbol, check-in y ayuda existentes |
| `/herramientas` | Me está costando, respiración y check-in |
| `/aprende` | Catálogo actual de lecciones |
| `/perfil` | Preferencias actuales, cuenta, datos y acceso a Progreso |
| `/progreso` | Seguimiento existente, con regreso a Perfil |
| `/bosque` | Archivo mensual del roble de prueba, resumen y consulta de hojas |
| `/check-in` | Formulario emocional y cierre guardado |
| `/me-esta-costando` | Flujo de acompañamiento existente |
| `/respira` | Pausa de un minuto existente |
| `/leccion/[id]` | Lección concreta; un ID inexistente ofrece regreso |
| `/bienvenida` | Bienvenida y consentimiento existentes |
| `/cuenta` | Cuenta opcional y recuperación de borrado |

Las cuatro pestañas son Inicio, Herramientas, Aprende y Perfil. El historial lo gestiona Router; ya no hay una barra o modal elegidos con estado local en `App.js`. Cerrar un flujo vuelve al origen y, si se abrió por enlace sin historial, usa un destino conocido. Un enlace de lección no expone un cuerpo vacío ni produce un acceso a un ID arbitrario.

`App.js` conserva una sola instancia de `useStore`/`useNube`, los comandos durables y la política de reportes. Router se monta después de cargar datos. Sus rutas protegidas exigen perfil para entrar al recorrido; la bienvenida sigue exigiendo consentimiento. Cuenta permanece accesible antes del perfil para restaurar una copia. Cambiar a otra cuenta no muestra datos del almacenamiento vinculado anterior.

Un borrado pendiente bloquea también los enlaces directos a herramientas. Cuenta conserva el acceso necesario para reautenticar o recuperar una copia local conforme al contrato de borrado; no se libera la barrera por navegar. La futura restricción por edad/derivación sigue pendiente de la tarea 6.6 y su revisión clínica: esta entrega no la declara implementada.

## Cuidado desde el check-in

Mi bosque se abre desde Inicio y exige perfil; el borrado pendiente bloquea también su enlace directo. Permite seleccionar meses guardados y abrir el cuidado disponible del check-in ganador de una hoja. Al volver desde respiración o Me está costando conserva mes y detalle; no crea otro registro. Al cambiar de almacenamiento reinicia la selección y deja de mostrar el contenido anterior. Una flor histórica conserva su representación, incluso al entrar por enlace directo.

Después del guardado se ofrece «Me está costando» con intensidad mucho en las cinco emociones de §8. Volver desde ese recurso conserva el cierre del check-in guardado. La necesidad «No sé» permite abrir la respiración disponible. Los textos siguen identificados como revisión clínica pendiente.

`cuidado-disponible.js` exige que una acción tenga todos sus destinos implementados antes de anunciarla. Una secuencia Respira → ¿Tengo hambre? no se ofrece como completa si falta la segunda herramienta. Las respuestas que anuncian audio tampoco aparecen cuando falta ese audio. Las acciones autónomas sin destino pueden mostrarse, conservando su texto original.

La tarea 7.2 sigue pendiente: faltan herramientas, audios, plantillas, logros y las tres sugerencias por perfil conectadas con cápsulas aprobadas. La migración de navegación no los convierte en recursos entregados ni asigna perfiles nuevos a datos históricos.

## Recordatorios

Los avisos existentes guardan solamente un destino interno en `content.data.url`:

| Aviso | Destino |
| --- | --- |
| Mañana | `/check-in` |
| Mediodía | `/respira` |
| Tarde | `/me-esta-costando` |
| Noche | `/check-in` |

La respuesta de arranque y el listener usan una lista cerrada de rutas. Esperan a que exista navegación y perfil, limpian la respuesta procesada y evitan repetir una misma entrega. El identificador incluye fecha de recepción para que un aviso diario con el mismo ID siga abriendo al día siguiente. No se añaden notas, respuestas clínicas ni identificadores personales al payload. La web no registra listeners nativos.

Esta entrega no añade categorías, frecuencias, textos rotativos ni ventanas de silencio V1. Esos cambios siguen en la hoja de ruta de recordatorios.

## Dependencias y Expo Go

Se consultaron [Router SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/router/), [instalación](https://docs.expo.dev/router/installation/), rutas protegidas, pestañas y pruebas. Todo se instaló con `expo install`. Se añadieron Router, Screens, Linking y Constants; Reanimated 4.5.1 y Worklets 0.10.1 fijan los peers compatibles del SDK, evitando las versiones transitivas más nuevas incompatibles. Para las pruebas de Router SDK 57 se agregó `@testing-library/react-native` 13 como dependencia de desarrollo.

`expo install --fix` alineó Expo a 57.0.33 y Notifications a 57.0.25 dentro de SDK 57. `expo install --check` no informa incompatibilidades. La versión de la app permanece 1.0.1; no se preparó publicación ni etiqueta.

Las APIs de Router usadas están incluidas en Expo Go. El esquema `nutretumente` se registra en la siguiente build nativa; Expo Go usa su URL de desarrollo. No se generaron ni editaron carpetas `ios/` o `android/`. La prueba nativa de ese esquema, los gestos/atrás de Android, notificaciones reales y Sentry siguen necesitando la validación de desarrollo/staging prevista.

## Evidencia y límites

- Jest: 20 suites y 156 pruebas aprobadas. Las siete de Router usan el navegador real de rutas en memoria: abrir/cerrar check-in, Perfil → Progreso, lista/detalle de Aprende, enlace sin perfil, ID inexistente, borrado pendiente, carga diferida del perfil y notificación pendiente de consentimiento.
- Las pruebas de cuidado comprueban apoyo por intensidad y ausencia de anuncios de herramientas/audios faltantes. Las de notificaciones comprueban destinos, deduplicación por entrega y desuscripción.
- ESLint, typecheck y compatibilidad Expo aprobados. Typecheck conserva el alcance gradual JS existente.
- Exportaciones web y Android generadas en `.tools/router-export`; no equivalen a ejecutar una app Android en un teléfono.
- Verificación web local a 390 × 844 con perfil ficticio y sin cuenta: enlace protegido → bienvenida, cuatro pestañas, Perfil → Progreso → Perfil y check-in guardado → Me está costando → mismo cierre → Herramientas. No se usaron datos personales reales.

No hay `adb` ni dispositivo Android conectado disponible en este entorno. Por eso 6.1 conserva pendiente el arranque nativo Android, aunque dependencias, rutas y exportaciones están listas. También siguen pendientes las pruebas de dos teléfonos reales, ampliación de onboarding/preferencias, aprobación clínica y publicación.

Actualización Mi bosque del 14-11-2026: Jest aprueba 20 suites y 165 pruebas. ESLint, typecheck y OpenSpec estricto aprueban. Las exportaciones actualizadas están en `.tools/bosque-export-web` y `.tools/bosque-export-android`; no se ejecutaron en dispositivos reales. Las nuevas pruebas de Router comprueban archivo mensual, resumen top tres, días 30/31, selección accesible, regreso de cuidado, históricos, ausencia de perfil, borrado y cambio de almacenamiento. No se repitió la inspección visual web descrita arriba para este incremento.
