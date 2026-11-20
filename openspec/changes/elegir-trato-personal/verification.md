# Verificación · 2026-11-20

Entrega publicada en Vercel tras la confirmación del usuario: «Autorizado por el equipo clinico y tecnico 🤟🏻». Aprobación de matriz y aclaración mínima de datos registrada en revision-editorial.md. No se cambiaron reglas Firebase remotas; esta demo funciona con almacenamiento local.

## Resultados

- `npm test -- --ci --runInBand`: 25 suites, 198 pruebas aprobadas.
- `npm run lint`: aprobado sin avisos tras corregir orden de import.
- `npm run typecheck`: aprobado. El alcance del tsconfig existente es parcial; los módulos JS nuevos están cubiertos por Jest, lint y compilación web.
- `npm run test:rules`: 11 pruebas aprobadas en emulador demo-nutrimind. Se usó `.tools/java/jdk-21.0.13+9`, porque el Java predeterminado era anterior a 21. No se instaló ni modificó Java global.
- `npx --yes @fission-ai/openspec@1.14.3 validate --all --strict`: 9 elementos válidos.
- `git diff --check`: aprobado.
- Exportación Expo web: `.tools/trato-feria-web`, paquete con configuración estática Vercel preparado.

## Recorrido real local

Edge headless mediante Playwright, viewport 320×740, servidor local puerto 7019:

1. Bienvenida con consentimiento, elección Él, objetivo en masculino, finalización y perfil guardado.
2. Fixture de sesión anterior sobre el mismo origen, sin trato; conserva cookie de sesión de prueba, identidad del bosque e historial con nota libre.
3. Entrada directa en Inicio, sin repetir bienvenida; Perfil indica Sin elegir.
4. Cambios sucesivos Ella → Él → Neutro, guardado y recarga tras cada elección; etiquetas correspondientes en check-in.
5. Guardado sin conexión con la app ya cargada; reconexión y recarga conservan la elección.
6. Selector con texto aumentado a 28 px; sin desbordamiento horizontal. Capturas inspeccionadas visualmente.
7. Cero errores JavaScript de página.

La prueba encontró que React Native Web no exponía `accessibilityState.checked` en el DOM. Se añadió `aria-checked` explícito al selector y se repitió la prueba con `to_be_checked`, que pasó.

Evidencia local: `.tools/trato-qa.py`, `.tools/trato-bienvenida.png`, `.tools/trato-perfil.png`, `.tools/trato-perfil-texto-grande.png`.

## Límites y pendientes

Android/iOS físicos y Expo Go no estuvieron disponibles; pendientes de revisión manual. El recorrido de revisión aislada, ausencia de escrituras reales y compatibilidad pref-1 se probaron con Jest. La nube se probó con transacciones simuladas y reglas en emulador; no se probó contra cuentas Firebase reales. La demo Vercel actual no tiene Firebase configurado.

Las tareas 1.1, 1.3 y 3.5 se completan con la confirmación clínica y técnica comunicada por el usuario. La tarea 4.3 tiene instrucciones, aprobación y despliegue verificado. La tarea 4.2 permanece abierta únicamente por la revisión en Android/iOS físicos o Expo Go; no bloquea la entrega web autorizada. No se modificó la constitución ni se solicitó permiso de despliegue nuevamente.


## Despliegue público verificado

- Dominio estable: https://nutre-tu-mente-feria.vercel.app
- Despliegue: https://nutre-tu-mente-feria-l60xei9yo-von-team1.vercel.app
- ID: dpl_AqeJYDtmLggY7EwcdGD7GRgHFHQ3; estado READY.
- Proyecto/scope: nutre-tu-mente-feria / von-team1.
- Se publicó el mismo paquete web ya verificado; el único cambio posterior del código fuente fue un comentario que registra aprobación editorial.
- Prueba Playwright contra el dominio público en contexto de navegador nuevo, sin sesión Vercel: bienvenida completa, perfil antiguo de prueba, cambios Ella/Él/Neutro, recargas, cookie e historial intactos, guardado offline y reconexión. Viewport 320×740, texto de selector ampliado, cero errores de página. Sin acceso a datos reales de usuarios.
- Resultado: PASS. Se mantiene el origen público para conservar el almacenamiento de quienes ya usaban la demo.
