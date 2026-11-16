# Proposal

## Why

Aprobación de producto: el 13-11-2026 la persona responsable indicó «apruebo cambios» en esta conversación. Autoriza implementar esta propuesta; no sustituye revisión clínica ni autorización de producción.

El roble actual solo crece con fechas confirmadas por Firestore y exige UID. Esto deja sin crecimiento a quien usa la app sin cuenta o registra varios días sin conexión, pese al principio B11. El 13-11-2026 producto eligió proponer crecimiento local provisional y conservarlo al sincronizar.

## What Changes

- **BREAKING**: la fecha de captura del bosque, persistida en America/Santiago, determina la hoja y el mes. La recepción del servidor conserva su función de confirmación, pero no reasigna ni elimina el día registrado.
- Permitir crecimiento local sin cuenta y sin conexión, con una hoja por fecha y la misma selección por intensidad/instante/ID del check-in emocional.
- Conservar fecha, identidad y estado provisional tras reiniciar, vincular una cuenta y sincronizar desde otro dispositivo. La confirmación tardía no traslada hojas al día de reconexión.
- Separar estado de sincronización y fiabilidad temporal. Una captura tardía puede estar sincronizada y seguir con fecha provisional.
- Migrar históricos sin alterar su ánimo ni sus fechas confirmadas. Conservar el aislamiento y el borrado recuperable existentes.
- Revisar textos informativos de fechas provisionales con el equipo clínico antes de publicar. No prometer verificación de fechas capturadas sin servidor.

Fuera de alcance: herramientas nuevas, audios, diagnóstico, diario, especies finales, archivo anual, cambios de versión y despliegue. No activa por sí sola los datos ni los textos clínicos del check-in V1.

## Capabilities

### New Capabilities

- `calendario-bosque`: fecha persistida, crecimiento offline, confirmación separada y conservación al sincronizar.

### Modified Capabilities

Ninguna capacidad vigente en `openspec/specs/` cubre este calendario. `bosque-mensual` está propuesto en el cambio abierto `actualizar-v1-contenido-y-bosque`: al aprobar esta propuesta se debe reconciliar allí el requisito «Calendario verificable del bosque», el diseño y las tareas afectadas antes de implementar. Esta propuesta no modifica ese acuerdo automáticamente.

## Impact

`src/reloj-bosque.js`, `src/roble-mensual.js`, `src/store.js`, `src/fusion.js`, `src/sync.js`, `src/useNube.js`, componentes del roble, reglas Firestore y pruebas de persistencia, sync, calendario y emulador. Dependencia del contrato versionado del check-in del cambio V1; coordinar las tareas compartidas sin duplicarlas.

Toca A2, A5–A8, B9–B11 y C14–C19/C21. Mantiene datos mínimos y no modifica la constitución: usa fechas del check-in y metadatos técnicos. Requiere aprobación de producto del cambio de calendario y revisión clínica de los textos visibles; no sustituye la aprobación pendiente de ampliación de datos V1. No añade dependencias ni servicios.
