# Configurar Firebase (login + Firestore)

La app ya está preparada. Sin configuración funciona solo en el teléfono, sin cuentas ni nube.
Cuando pegues los datos de tu proyecto, aparecen automáticamente el login y la sincronización.

Haz esto **primero con un proyecto de pruebas** (`nutre-tu-mente-staging`) y deja el de producción para después.

## 1. Crear el proyecto (gratis, plan Spark)
1. Entra a <https://console.firebase.google.com> con tu cuenta de Google → **Agregar proyecto**.
2. Nombre: `nutre-tu-mente-staging`.
3. Cuando pregunte por **Google Analytics, desactívalo** (la app maneja datos sensibles y no necesita analítica).

## 2. Activar el login
**Compilación → Authentication → Comenzar → Método de acceso → Correo electrónico/contraseña → Habilitar**
(deja desactivado "Vínculo del correo electrónico").

En **Configuración → Dominios autorizados** añade los dominios desde donde se abrirá la versión web
(por ejemplo `nutre-tu-mente.vercel.app`). `localhost` ya viene incluido.

## 3. Crear la base de datos
**Compilación → Firestore Database → Crear base de datos**
- **Ubicación:** elige con calma, **no se puede cambiar después**. Opciones cercanas: `southamerica-west1` (Santiago)
  o `southamerica-east1` (São Paulo). Consulta con asesoría legal si los datos de salud tienen requisitos de ubicación.
- **Modo:** **producción** (bloquea todo hasta que publiques las reglas del paso 4).

## 4. Publicar las reglas de seguridad (muy importante)
Las reglas están en [`firestore.rules`](../firestore.rules). Garantizan que cada persona solo ve sus propios datos y que
no se puede guardar peso, calorías ni fotos.

- **Desde la consola:** Firestore → pestaña **Reglas** → pega el contenido de `firestore.rules` → **Publicar**.
- **O con la línea de comandos:**
  ```bash
  npx firebase-tools login
  npx firebase-tools deploy --only firestore:rules --project TU_PROYECTO
  ```

> Estas reglas no se han probado contra un proyecto real. Pruébalas en **Reglas → Simulador de reglas**
> (ver "Cómo comprobar que funciona").

## 5. Obtener la configuración de la app
**Configuración del proyecto (engranaje) → Tus apps → Web (`</>`)** → registra la app (sin Hosting) y copia el
`firebaseConfig`.

## 6. Probar en tu PC
```bash
cd tareas-app
copy .env.example .env      # en Windows (en Mac/Linux: cp)
```
Abre `.env` y pega los valores:

| Variable | Valor de `firebaseConfig` |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |

Luego `npx expo start --web --clear` (o `npx expo start --clear` y Expo Go). Estos valores **no son secretos**; `.env` no se sube a git de todos modos.

> **Importante:** la primera vez, y cada vez que cambies `.env`, usa `--clear`. Expo guarda en caché el código compilado
> y, sin `--clear`, puede seguir usando la versión anterior sin tus valores (la app se vería sin login, en modo local).

## 7. Publicar con la pipeline (dos proyectos: staging y producción)
La pipeline elige el proyecto según la rama (script `.github/scripts/elegir-firebase.sh`):

| Rama | Proyecto Firebase | Variables de GitHub que usa |
|---|---|---|
| `staging` y Pull Requests | `nutre-tu-mente-stg-…` (pruebas) | `EXPO_PUBLIC_FIREBASE_*` |
| `main` (producción) | `nutre-tu-mente-prod` | `PROD_EXPO_PUBLIC_FIREBASE_*` |

En GitHub: **Settings → Secrets and variables → Actions → pestaña Variables → New repository variable**
(son *variables*, no *secrets*; no llevan espacios al principio ni al final).

**Producción** — crea estas 5:

| Name | Dónde está el valor (Firebase → ⚙ Configuración del proyecto → Tus apps → app web → Config) |
|---|---|
| `PROD_EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
| `PROD_EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `PROD_EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
| `PROD_EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |
| `PROD_EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |

> Los valores concretos **no se guardan en este repositorio**. Se copian desde la consola de Firebase directamente a las
> *Variables* de GitHub. Aunque la clave web de Firebase no es un secreto (va dentro de la app compilada), conviene
> **restringirla** en Google Cloud: *APIs y servicios → Credenciales →* tu clave de API → *Restricciones de API*.

Seguridad: si falta alguna de las variables de producción, la pipeline de `main` **falla** a propósito. Nunca usa en
silencio la configuración de staging para producción (se mezclarían las cuentas y los datos de prueba con los reales).

Sin variables de staging, lo publicado en `staging` funciona en modo local (sin cuentas ni nube).

### Checklist del proyecto de producción
- [ ] Authentication → Método de acceso → **Correo electrónico/contraseña** habilitado.
- [ ] Authentication → Configuración → **Dominios autorizados**: añade `nutre-tu-mente.vercel.app`.
- [ ] Firestore → **Reglas**: publica el contenido de `firestore.rules`.
- [ ] Las 5 variables `PROD_EXPO_PUBLIC_FIREBASE_*` creadas en GitHub.
- [ ] Alerta de presupuesto si algún día se activa el plan Blaze.

## Cómo comprobar que funciona
- [ ] Crear una cuenta desde Ajustes → **Crear cuenta o iniciar sesión**.
- [ ] En Firestore aparece `users/{uid}` con `checkins`, `cuestas`, `mental` al hacer un check-in.
- [ ] En **Reglas → Simulador de reglas**: leer `users/OTRO_UID` con tu usuario debe ser **denegado**.
- [ ] Intentar escribir un campo no permitido (por ejemplo `peso`) debe ser **denegado**.
- [ ] Iniciar sesión en otro navegador/teléfono recupera tu progreso.
- [ ] **Eliminar mi cuenta** borra `users/{uid}` y sus subcolecciones.
- [ ] Sin conexión, la app sigue funcionando y sincroniza al volver.

## Cloud Build (segundo CI/CD, opcional)
El archivo [`cloudbuild.yaml`](../cloudbuild.yaml) prueba, compila y publica en Firebase usando la cuenta de servicio de
Cloud Build (sin claves en el repositorio). **Requiere plan Blaze (facturación activada).**

1. Google Cloud Console (mismo proyecto) → habilita **Cloud Build API**.
2. **Cloud Build → Activadores → Conectar repositorio** (GitHub) → crea dos activadores:
   - Rama `^main$` y rama `^staging$`, configuración: `cloudbuild.yaml`.
   - Sustituciones: `_FIREBASE_PROJECT`, `_FIREBASE_API_KEY`, `_FIREBASE_AUTH_DOMAIN`, `_FIREBASE_APP_ID`, `_FIREBASE_SENDER_ID`.
3. **IAM:** a la cuenta `…@cloudbuild.gserviceaccount.com` dale los roles *Administrador de Firebase Hosting*,
   *Administrador de reglas de Firebase* y *Administrador de índices de Cloud Datastore*.
4. **Evita publicar dos veces:** si Cloud Build publica en Firebase, **no** guardes `FIREBASE_SERVICE_ACCOUNT` en GitHub
   (así la pipeline de GitHub solo prueba y compila, y publica únicamente en Vercel si tiene sus claves).

## Pendiente / siguientes pasos
- **Google y Apple como método de acceso:** requieren una versión de desarrollo (no funcionan en Expo Go) y configurar
  OAuth. Apple lo exige si ofreces Google en iOS.
- **Verificación de correo** y política de contraseñas más estricta.
- **Proyecto de producción** separado (`nutre-tu-mente-prod`) con sus propias reglas y variables.
- **Alerta de presupuesto** si pasas al plan Blaze.
- Declarar el uso de datos en la ficha de privacidad de Google Play y App Store.
