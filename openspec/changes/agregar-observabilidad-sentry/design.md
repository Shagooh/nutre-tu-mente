# Design

## Context

Estado actual, comprobado en el repositorio:

- La app es Expo SDK 57 (JavaScript). El punto de entrada es `index.js` (`registerRootComponent(App)`).
- Los errores solo van a `console.warn` (por ejemplo, la sincronización en `App.js`). No hay ningún servicio de reportes.
- **La publicación real es la versión web** (Firebase Hosting y Vercel). Para Android la pipeline solo hace
  `expo export --platform android` como comprobación. **No hay `eas.json`**, ni compilaciones de tienda en la pipeline.
- La versión de la app sale de `package.json` mediante `app.config.js`, y cada publicación a producción deja la etiqueta
  `vX.Y.Z`.
- La configuración pública de Firebase se elige por entorno con `.github/scripts/elegir-firebase.sh` (variables
  `STG_*` / `PROD_*`) y se inyecta como `EXPO_PUBLIC_*`.
- El consentimiento se guarda al terminar el *onboarding* (`consentimiento: hoyISO()` en `src/screens/Onboarding.js`).

Ver `proposal.md` para el motivo y `specs/reporte-de-errores/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**
- Que un error o una caída llegue al equipo con versión, plataforma y entorno, sin datos personales.
- Que el servicio sea reemplazable: el resto de la app no importa Sentry, solo un módulo propio.
- Que sea fácil de probar sin red (Jest) y que, sin DSN, no haga nada.

**Non-Goals:**
- Migrar a EAS Build/Update. Si en el futuro se adopta, el *release* y los source maps se reconfiguran en ese cambio.
- Una pantalla de ajustes para activar o desactivar los reportes (ver pregunta abierta).

## Decisions

### 1. Sentry (`@sentry/react-native`) y no Crashlytics ni Grafana
- **Por qué:** cubre web, Android e iOS con un solo SDK, entiende los source maps de Expo, y su plan gratuito alcanza.
  Crashlytics solo cubre móvil nativo (no la versión web, que es la que se publica hoy) y exige `@react-native-firebase`.
  Grafana es una capa de visualización de métricas de servidores, y la app no tiene backend propio.
- **Alternativa descartada:** Crashlytics, por no cubrir la web. Se reconsidera si la app pasa a ser solo nativa.
- **Dependencia nueva (principio 18):** una sola, `@sentry/react-native`, instalada con `npx expo install`.

### 2. Un módulo propio `src/reportes.js` envuelve a Sentry
Expone `iniciarReportes()`, `detenerReportes()` y `reportarError(e, contexto)`. Ninguna pantalla importa Sentry.
Así las pruebas sustituyen el módulo y, si el servicio cambia, solo cambia este archivo.

### 3. Privacidad por configuración y por filtro
- `sendDefaultPii: false`; sin `Sentry.setUser`; sin *replay*; `tracesSampleRate` en 0; sin integraciones de migas de
  pan de toques, navegación ni consola; sin capturas de pantalla ni jerarquía de vistas.
- Un `beforeSend` elimina `user`, `request` (cabeceras, cookies, URL con parámetros) y limpia de los mensajes y las
  excepciones los correos y los identificadores de cuenta. Es la segunda barrera: la primera es no mandar esos datos.
- Los errores de Firebase se reportan por su `code` (por ejemplo `auth/network-request-failed`), no con el mensaje
  completo, que puede traer el correo.
- La prueba automática de este filtro es la que hace verificable el requisito "Sin datos personales".

### 4. Consentimiento: se activa después de aceptar
`App.js` llama a `iniciarReportes()` cuando `datos.consentimiento` existe, y a `detenerReportes()` cuando se borra todo.
**Consecuencia asumida:** un fallo durante el *onboarding* (antes de aceptar) no se reporta. Es el coste de cumplir el
principio 10; se acepta porque ese tramo es corto y se puede reproducir.

### 5. Release y entorno
- `release` = `package.json` `version` (`X.Y.Z`), tomada de `app.config.js` y expuesta en `extra`, de modo que la app, la
  etiqueta `vX.Y.Z` y Sentry usan **una sola fuente**. No se escribe la versión en ningún otro archivo (`docs/VERSIONES.md`).
- `environment` = `staging` o `produccion`, que la pipeline ya decide en el job `0 · Destino`; llega a la compilación
  como `EXPO_PUBLIC_ENTORNO`. Si falta, vale `desarrollo` y no se reporta nada.

### 6. DSN por variable de entorno, token como secret
- `EXPO_PUBLIC_SENTRY_DSN` por entorno, como las de Firebase: variables de GitHub (`STG_SENTRY_DSN`,
  `PROD_SENTRY_DSN`) elegidas por `elegir-firebase.sh` (o un script hermano). El DSN identifica el proyecto y solo
  permite *enviar* eventos, pero igual no se escribe en el repositorio ni en los documentos.
- `SENTRY_AUTH_TOKEN` (subida de source maps) es un **secret** de GitHub, nunca una variable ni un archivo.
- Si faltan variables de producción, la pipeline falla (igual que con Firebase); si faltan las de staging, la app se
  compila sin reportes y avisa con un `::notice::`.

### 7. Source maps desde la pipeline, no desde EAS
La petición original mencionaba EAS, pero el repositorio no lo usa. Se suben los mapas en el job `2 · Compilar`, justo
después de `expo export`, con la herramienta de línea de comandos de Sentry y el mismo *release*, solo cuando hay token.
En un Pull Request (sin secrets) se omite el paso. **Esto debe confirmarse con la documentación vigente de Sentry y de
Expo SDK 57 antes de implementar** (tarea 1.1), porque el flujo de subida cambia entre versiones.

### Expo Go
`@sentry/react-native` trae código nativo. En **Expo Go** el SDK arranca en modo reducido (captura errores de JavaScript,
pero no las caídas nativas ni los source maps nativos). Por eso: en desarrollo está desactivado (no se necesita), y las
caídas nativas solo se pueden probar con un *development build*. En la web funciona igual que en cualquier otro navegador.

## Risks / Trade-offs

- **El reporte filtra un dato personal por un mensaje de error inesperado** → doble barrera (no enviar usuario ni
  contexto + `beforeSend` que limpia) y pruebas con mensajes que contienen un correo; revisar los primeros reportes de
  staging antes de producción.
- **No se ven los fallos del *onboarding*** → asumido (decisión 4); se revisa si aparecen quejas.
- **El plan gratuito se agota** → se limita el muestreo de errores repetidos y se eliminan eventos de desarrollo.
- **Dependencia nativa en Expo Go** → no bloquea el desarrollo (decisión de "Expo Go"), pero obliga a un *development
  build* para probar caídas nativas.
- **Sentry es un tercero que recibe datos técnicos de personas** → el texto de consentimiento debe mencionarlo; lo redacta
  el equipo clínico (pregunta abierta 1).

## Migration Plan

1. Crear el proyecto en Sentry y las variables/secret en GitHub (staging primero).
2. Publicar a staging y provocar un error de prueba; comprobar versión, entorno y ausencia de datos personales.
3. Repetir en producción con una versión nueva (`npm version minor --no-git-tag-version`, en un Pull Request aparte).
- **Reversión:** quitar la variable `EXPO_PUBLIC_SENTRY_DSN` apaga los reportes sin tocar el código.

## Open Questions

1. **Texto del consentimiento** (equipo clínico): ¿se amplía para mencionar los reportes de errores, o se considera cubierto
   por el consentimiento actual? No cambia la especificación ni las tareas técnicas, solo el texto.
2. **¿Se ofrecerá un interruptor en Ajustes** para pausar los reportes? Hoy el único corte es borrar los datos. Si se
   quiere, es un cambio aparte.
