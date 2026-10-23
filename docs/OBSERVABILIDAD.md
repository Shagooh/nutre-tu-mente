# Reporte de errores (Sentry)

La app avisa al equipo cuando **falla** (una caída, un error no controlado o un fallo de sincronización) para poder
arreglarlo. **Solo errores:** no hay analítica de uso, ni grabación de pantallas, ni seguimiento de rendimiento.

Especificación: `openspec/changes/agregar-observabilidad-sentry/` (después de archivar, `openspec/specs/reporte-de-errores/`).
Código: `src/reportes.js`.

## Qué se envía y qué no

| Se envía | No se envía nunca |
|---|---|
| El error y su traza (con código legible gracias a los source maps) | Apodo, correo, identificador de cuenta, IP |
| Versión de la app (`X.Y.Z` de `package.json`), plataforma y entorno (`staging` / `produccion`) | Respuestas de la encuesta, check-ins, uso de "Me está costando", recordatorios |
| Modelo y sistema operativo del teléfono | Nombre del dispositivo, capturas de pantalla, grabación de sesión |
| El código del fallo de sincronización (por ejemplo `unavailable`) | Toques, pantallas visitadas, métricas de rendimiento |

Además, antes de enviar cada reporte `filtrarEvento` quita usuario, petición, etiquetas ajenas y oculta correos e
identificadores largos que aparezcan en un mensaje de error. Está cubierto por `src/__tests__/reportes.test.js`.

## Cuándo está activo

- **Solo después del consentimiento** del *onboarding*. Si la persona borra todos sus datos, deja de enviarse hasta que
  vuelva a aceptar.
- **Nunca** en desarrollo (`expo start`), en pruebas (`npm test`) ni si no hay DSN.
- Si el servicio falla o no hay conexión, la app sigue igual y no muestra ningún aviso.

## Configurarlo (una vez)

1. En Sentry, crea una organización y **dos proyectos** (staging y producción), plataforma *React Native*.
2. En GitHub → *Settings → Secrets and variables → Actions → **Variables***, crea (los valores se copian de Sentry, nunca se
   escriben en el repositorio ni en documentos):

   | Variable | Qué es |
   |---|---|
   | `SENTRY_ORG` | Slug de la organización |
   | `SENTRY_URL` | Solo si elegiste la región de la UE: `https://de.sentry.io/`. Sin ella se usa `https://sentry.io/` (EE. UU.) |
   | `STG_SENTRY_DSN`, `STG_SENTRY_PROJECT` | DSN y slug del proyecto de staging |
   | `PROD_SENTRY_DSN`, `PROD_SENTRY_PROJECT` | DSN y slug del proyecto de producción |

3. En la pestaña **Secrets**, crea `SENTRY_AUTH_TOKEN` (token de organización con permiso para subir source maps). Es un
   secreto: solo va en GitHub.

La pipeline (`.github/scripts/elegir-sentry.sh`) elige las variables según el destino, igual que con Firebase:

- **Staging sin variables:** la app se compila sin reportes y la pipeline solo avisa.
- **Producción sin `PROD_SENTRY_DSN`:** la pipeline **falla** (a propósito, para no publicar producción sin reportes por descuido).

## Source maps

En `2 · Compilar` la web se exporta con `--source-maps`, se suben a Sentry con `sentry-expo-upload-sourcemaps` (cada
paquete se empareja con su mapa por un *debug id* que añade `metro.config.js`) y **se borran de `dist` antes de publicar**,
para que el código fuente no quede público en la web. Sin token no se suben (por ejemplo, en Pull Requests de ramas
externas) y los errores se verán sin el código legible.

El *release* de cada reporte es la versión de `package.json`, la misma de la etiqueta `vX.Y.Z` (ver `docs/VERSIONES.md`).

Hoy el repositorio **no usa EAS** y Android solo se compila como comprobación, así que no hay subida de mapas nativos.
Si más adelante se compila con EAS, hay que añadir el plugin `@sentry/react-native/expo` y `SENTRY_AUTH_TOKEN` como secreto de EAS.

## Apagarlo

- **Staging:** borra `STG_SENTRY_DSN` y vuelve a publicar; la app se compila sin reportes.
- **Producción:** la pipeline exige `PROD_SENTRY_DSN` a propósito, así que apagarlo allí requiere un cambio en
  `.github/scripts/elegir-sentry.sh` (con Pull Request y revisión).

## Probarlo

- **Expo Go y desarrollo:** desactivado a propósito. Las caídas nativas solo se pueden probar con un *development build*.
- **Web / staging:** en una compilación de staging con DSN, provoca un error desde la consola del navegador
  (`setTimeout(() => { throw new Error('prueba de reporte') })`) con el consentimiento ya aceptado. Debe aparecer en Sentry
  con el entorno `staging`, la versión correcta y **sin** usuario, IP ni migas de pan.
