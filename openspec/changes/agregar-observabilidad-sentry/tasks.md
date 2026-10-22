# Tasks

Ninguna tarea requiere al equipo clínico salvo la 5.2 (texto del consentimiento).

## 1. Preparación

- [x] 1.1 Leer la documentación vigente de Sentry para Expo SDK 57 (`https://docs.expo.dev/guides/using-sentry/` y la de Sentry) y anotar en `design.md` el flujo exacto de source maps para web y Android; verificar que la nota quedó escrita.
- [ ] 1.2 Crear los proyectos de Sentry (staging y producción) y guardar `STG_SENTRY_DSN`, `PROD_SENTRY_DSN` como variables de GitHub y `SENTRY_AUTH_TOKEN` como secret; verificar en Settings que existen (sin copiar sus valores a ningún archivo).
- [x] 1.3 Instalar `@sentry/react-native` con `npx expo install @sentry/react-native` y ejecutar `npx expo-doctor` y `npm test`; verificar que no aparecen problemas nuevos.

## 2. Módulo de reportes

- [x] 2.1 Crear `src/reportes.js` con `iniciarReportes`, `detenerReportes` y `reportarError`, sin DSN = no-op y desactivado en desarrollo y en Jest; verificar con pruebas en `src/__tests__/reportes.test.js` (escenarios "Sin configuración" y "Desarrollo y pruebas").
- [x] 2.2 Configurar privacidad: `sendDefaultPii: false`, sin usuario, sin *replay*, sin trazas, sin migas de toques/navegación/consola; verificar con una prueba que la configuración pasada al SDK no activa nada de eso (escenario "Solo el error").
- [x] 2.3 Implementar el filtro `beforeSend` que elimina usuario, IP y cabeceras y limpia correos e identificadores de cuenta de los mensajes; verificar con pruebas de los escenarios "Reporte sin identidad" y "Mensajes que contienen datos".
- [x] 2.4 Añadir `release` (versión de `package.json` vía `app.config.js`/`extra`) y `environment`; verificar con pruebas de "Versión de la app" y "Entorno separado".

## 3. Integración en la app

- [x] 3.1 Llamar a `iniciarReportes()` en `App.js` cuando exista el consentimiento y a `detenerReportes()` al borrar todo; verificar con pruebas de "Antes de aceptar", "Después de aceptar" y "Borrado total".
- [x] 3.2 Reportar con `reportarError` el fallo de sincronización de `App.js` usando solo su `code`, y añadir el captador de errores no controlados; verificar con las pruebas de "Fallo de sincronización" y "Error no controlado".
- [x] 3.3 Comprobar que la app sigue funcionando sin red y sin DSN: arrancar con `npx expo start --web` sin `EXPO_PUBLIC_SENTRY_DSN` y recorrer Hoy, check-in y "Me está costando"; verificar que no hay avisos ni errores en consola (escenario "Sin conexión").

## 4. Pipeline y variables

- [x] 4.1 Extender el script de elección de entorno para inyectar `EXPO_PUBLIC_SENTRY_DSN` y `EXPO_PUBLIC_ENTORNO` (producción falla si falta; staging avisa con `::notice::`); verificar ejecutando el script en local con y sin variables.
- [ ] 4.2 Añadir al job `2 · Compilar` la subida de source maps con el *release* de `package.json`, solo si hay `SENTRY_AUTH_TOKEN` (se omite en Pull Requests); verificar en una ejecución a staging que el release aparece en Sentry con sus mapas.
- [x] 4.3 Replicar las variables en `cloudbuild.yaml` (sustituciones, sin valores); verificar con `grep` que el DSN y el token no aparecen escritos en el repositorio.

## 5. Documentación

- [x] 5.1 Documentar en `docs/` cómo configurar Sentry, qué se envía y qué no, y cómo apagarlo; verificar que los pasos escritos se pueden seguir tal cual y que el documento no contiene claves ni identificadores.
- [ ] 5.2 **(Equipo clínico)** Decidir si el texto del consentimiento en `src/screens/Onboarding.js` menciona los reportes de errores (pregunta abierta 1) y marcarlo como borrador hasta su validación; verificar con la respuesta escrita del equipo.

## 6. Verificación final

- [ ] 6.1 Provocar un error de prueba en staging y comprobar en Sentry: versión correcta, entorno `staging`, sin usuario, sin correo, sin IP, sin migas de pan; repetir en web y en Android con un *development build*. _Avance: la web ya se comprobó en local con un colector propio (versión, entorno, sin datos personales y sin envío antes del consentimiento); falta staging real y Android._
- [x] 6.2 Ejecutar `npm test` y `npx @fission-ai/openspec@1.14.3 validate --all --strict`, y revisar uno a uno los *Scenario* de `specs/reporte-de-errores/spec.md` contra lo implementado.
- [x] 6.3 Ejecutar `npx tsc --noEmit` y `npx expo lint` si el proyecto los tiene configurados; indicar en el Pull Request lo que no aplique. _No aplica: el proyecto no tiene `tsconfig.json` ni configuración de ESLint._

## Workflow follow-up

- Subir la versión (`npm version minor --no-git-tag-version`) en un Pull Request aparte antes de publicar a producción.
- Archivar el cambio cuando el Pull Request esté unido y verificado en staging.
