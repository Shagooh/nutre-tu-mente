# Design

## Context

Ver `proposal.md`. Hoy `proyectarRoble` exige UID y deriva el mes/días de `_confirmadoMs`. `sincronizar` solo agrega `confirmadoEn` a capturas de la misma sesión con antigüedad máxima de 15 segundos. `relojBosque` conserva referencia monotónica por seis horas; al reiniciar se pierde. El pull descarta metadatos de transporte y el borrado cerca operaciones por UID/generación.

## Goals / Non-Goals

**Goals:** que la captura tenga una fecha de bosque inmutable compartida; incluir provisionales en crecimiento sin modificar las garantías de cuenta, persistencia y borrado.

**Non-Goals:** certificar retrospectivamente un reloj desconectado o inventar emociones históricas. Los catálogos clínicos y datos V1 continúan con sus revisiones propias.

## Decisions

### Fecha de captura canónica y confirmación separada

Añadir `diaBosque` (YYYY-MM-DD) e `instante` (ISO con zona explícita) al contrato versionado del check-in, coordinado con 5.2 del cambio V1. `diaBosque` se fija con America/Santiago desde estimación monotónica reciente o reloj local. Conservar `fecha`/`hora` históricas para compatibilidad. La alternativa de usar la recepción del servidor pierde los días de uso offline; se sustituye tras aprobación.

No recalcular el día después del guardado. `confirmadoEn` sigue siendo timestamp de recepción; confirma temporalmente solo una captura reciente cuyo día de recepción coincide con `diaBosque`. Un registro puede estar sincronizado y ser provisional. No guardar dos copias editables de ese estado: derivarlo del contrato, timestamp y marcas de sync.

### Proyección común con identidad aislada

Agrupar fechas canónicas, ordenar días y usar el selector intensidad/instante/ID ya implementado. Históricos sin emoción cuentan como día y siguen sin emoción asignada. La consulta visual reutilizará esa proyección; la adaptación de colores pertenece a la tarea de UI de V1.

Retirar UID como condición de crecimiento; para semilla visual usar un espacio local persistente en el blob sin datos identificativos. Al vincularlo explícitamente a una cuenta, preservar ese espacio como identidad visual del árbol mediante el contrato de árbol de V1, para no redibujarlo entre dispositivos. Cerrar sesión, cambiar cuenta o borrar sigue el aislamiento existente; no reutilizar ese espacio como credencial. Una identidad local sin persistir no autoriza un mensaje de guardado completo.

El mes de la vista se calcula con referencia reciente o reloj local de America/Santiago, sin dejarlo anclado al último mes confirmado. Es una decisión de navegación; no reasigna fechas guardadas. Un reloj local equivocado afecta capturas nuevas y la vista actual, pero no reconstruye el historial.

### Transporte inmutable y reglas mínimas

Concreción de implementación: `bosqueId` vive en el snapshot local y en el documento inmutable `users/{uid}/bosque/identidad` (`id`, `schemaVersion: 1`, `generacion`). Se crea/recupera en transacción, separado del perfil clínico y borrado con su barrera. Una cuenta nueva conserva el ID local; una cuenta existente conserva el suyo. La versión temporal 1 se limita a calendario; no marca completas las tareas generales de perfil/check-in/árbol V1. Las reglas de migración confirmada limitan el día a UTC-3/UTC-4; el cliente calcula America/Santiago exacto.

`limpiar`, comparación canónica y pull conservan `diaBosque` e `instante`; nunca se derivan de `_confirmadoMs` después de la migración. Las reglas validan formato/versión/campos permitidos y conservan inmutabilidad, ownership y barrera de borrado. No intentan demostrar que un día offline coincide con el servidor. No se añaden dependencias ni servicios ni cambia el soporte de Expo Go; antes de tocar APIs se consultará Expo SDK 57.

### Compatibilidad y recuperación

Migración pura por registro: conservar `diaBosque` si existe; para históricos derivar primero de confirmación, o de `fecha` válida como provisional. No inventar `instante` ni emoción de un histórico que carezca de ellos: no compite en el desempate emocional. Campos inválidos detienen la migración recuperable, sin fabricar un día ni borrar la copia anterior. Guardar esquema e IDs dentro del mismo snapshot durable y coordinarlo con 5.3 de V1. Los históricos remotos inmutables requieren migración de metadatos estrecha y comprobable: solo adición de fecha derivada, sin permitir editar cuerpo o confirmación.

## Risks / Trade-offs

- Reloj offline equivocado → fecha explícitamente provisional; no prometer autenticidad y no modificar fechas guardadas automáticamente.
- Cliente anterior elimina campos nuevos → reglas y versión mínima compatibles antes de habilitar clientes; no volver a un binario que sobrescriba el nuevo esquema.
- Datos locales vinculados a otra cuenta → mantener confirmación explícita de vinculación, cercas de sesión y barrera remota; probar con A/B y respuestas tardías.
- Contradicción con calendario propuesto en V1 → reconciliar documentos tras aprobar esta propuesta y antes de código. No archivar capacidades incompatibles.
- Texto informativo sin revisión → marcar borrador en desarrollo y mantener la publicación pendiente.

## Migration Plan

1. Aprobar propuesta y reconciliar calendario/diseño/tareas de V1. Mantener pendiente su revisión de datos y textos clínicos.
2. Completar contratos versionados compartidos; probar fixtures y migración idempotente con copia original conservada ante fallo.
3. Probar reglas, metadatos históricos y sync con emulador antes del cliente en staging. No desplegar producción.
4. Habilitar crecimiento local y verificar reinicio, meses, reconexión y dos dispositivos reales; registrar resultados.
5. Rollback solo a cliente tolerante al esquema; conservar campos y originales, sin borrar días ni revertir reglas hacia escrituras destructivas.

## Open Questions

El equipo clínico debe aprobar el texto exacto para explicar fecha provisional y sincronización. No cambia el contrato: son dos estados distintos, accesibles y sin obligación de cuenta.
