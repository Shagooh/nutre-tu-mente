# Proposal

## Why

Hoy el equipo no se entera de que la app falla. Si una persona sufre un cierre inesperado o un error al sincronizar
(sobre todo en un momento de desborde, donde un fallo duele más), nadie lo ve: los errores solo llegan a `console.warn`
en el teléfono de ella. Antes de abrir la app a pacientes reales necesitamos saber **qué se rompe, en qué versión y en
qué plataforma**, sin vigilar a nadie ni recoger datos personales.

## What Changes

- Integrar **Sentry** para reportar **errores y caídas** de la app (web, Android e iOS), y nada más.
- **Sin datos personales:** `sendDefaultPii: false`, sin identificar a la persona, sin contenido de pantallas y sin los
  datos de la encuesta, check-ins o "Me está costando" en los reportes.
- **Sin analítica de comportamiento:** sin session replay, sin capturas de pantalla, sin rastro de toques ni de
  navegación, sin trazas de rendimiento.
- Cada reporte lleva la **versión `X.Y.Z` de `package.json`** como *release* y el **entorno** (`staging` o
  `produccion`), para poder decir "este error es de la 1.2.0 en producción".
- **Source maps** subidos a Sentry desde la pipeline en cada publicación, para ver el código legible en los errores.
- El **DSN** se lee de una variable de entorno (`EXPO_PUBLIC_SENTRY_DSN`), nunca escrito en el repositorio. El token de
  subida de source maps es un **secret** de GitHub.
- **Desactivado** en desarrollo, en pruebas (`npm test`) y siempre que no haya DSN: la app funciona igual (principio 11).
- Solo se activa **después del consentimiento** de la persona (ver "Preguntas abiertas").

### Fuera de alcance

- Analítica de producto, embudos, métricas de uso o retención (principio 12: la analítica anónima y agregada es otro
  cambio).
- Session replay, seguimiento de rendimiento (*tracing*), registros (*logs*) o alertas por mensaje.
- Observabilidad del servidor o de Firestore (la consola de Firebase ya la cubre) y paneles con Grafana.
- Cambiar el flujo de publicación a EAS: **hoy el repositorio no usa EAS** (no hay `eas.json`; la pipeline publica la
  versión web y solo compila el paquete de Android como comprobación). Los source maps se suben desde la pipeline actual.
- Redactar el texto del consentimiento (lo hace el equipo clínico).

## Capabilities

### New Capabilities
- `reporte-de-errores`: reporte de errores y caídas al equipo, sin datos personales, con versión y entorno, solo con
  consentimiento y desactivable sin que la app deje de funcionar.

### Modified Capabilities
<!-- Ninguna: no cambia el comportamiento de las capacidades vigentes (me-esta-costando). -->

## Impact

- **Código:** `index.js` (inicialización), un módulo nuevo `src/reportes.js`, `App.js` (activar tras el consentimiento y
  capturar los errores de sincronización que hoy solo van a `console.warn`), `app.config.js` (plugin de Sentry y *release*).
- **Dependencias:** `@sentry/react-native` (instalada con `npx expo install`). Aporta código nativo: **no funciona del
  todo en Expo Go** (ver diseño).
- **Pipeline:** `.github/workflows/pipeline.yml` y `cloudbuild.yaml` (variable del DSN por entorno y subida de source
  maps); nuevo secret `SENTRY_AUTH_TOKEN` y variables `SENTRY_*` en GitHub.
- **Documentación:** `docs/` (cómo configurar Sentry y qué se envía), y `docs/VERSIONES.md` si cambia algo del *release*.
- **Principios afectados:** 9 (datos mínimos), 10 (consentimiento), 11 (la nube y los servicios son opcionales), 12
  (nada identificable), 13 (sin secretos) y 18 (justificar la dependencia).
- **Requiere al equipo clínico:** solo el texto del consentimiento, si se amplía para mencionar los reportes de error.
  No se tocan lecciones, frases ni pantallas sobre comida, cuerpo o emociones.
