# Proposal

## Why

El contenido de Nutrimind del 26 de octubre amplía el prototipo y define un bosque emocional mensual. Necesitamos una base segura sobre el GitHub actual para integrar contenido y código sin perder el trabajo local ni mezclar cuentas.

## What Changes

- Primera entrega de esta propuesta: persistencia verificable, consentimiento real de Sentry, aislamiento entre sesiones, reintentos y borrado recuperables. Conserva Firebase Auth y Firestore opcional.
- Segunda entrega de esta propuesta: recorrido principal del documento, emociones e intensidad, seis especies finales, integración SVG inicial con roble exclusivo de prueba, bosque consultable y sincronización del dominio nuevo. Los recursos finales de las seis especies aún no están entregados.
- Catálogo de contenido con fuente y estado de aprobación; copia de las fuentes originales y mapa del resto de V1 en `docs/PLAN-ACTUALIZACION-V1.md`.
- **BREAKING**: sustituir color libre y crecimiento por puntos por una hoja por día según emoción de mayor intensidad y crecimiento por días con check-in. Migrar sin inventar información histórica.
- Fuera de implementación en este cambio: herramientas nuevas de las secciones 9–11, semana, logros editables, reproductor, editor clínico y recordatorios ampliados. Quedan en el plan V1 como propuestas posteriores con escenarios propios. No se reduce la V1 acordada; se divide en entregas revisables.
- Fuera de V1: organización personal, recetas, tracker, widgets, premios, cápsulas 5–14 y pagos sin definición. No integrar PostgreSQL ni adornos automáticos.

## Capabilities

### New Capabilities

- `persistencia-y-cuentas`: guardado durable, aislamiento, reintentos y borrado local/remoto.
- `privacidad-reportes`: inicialización única, consentimiento y exclusión de datos sensibles en telemetría.
- `incorporacion-y-preferencias`: bienvenida, consentimiento, diagnóstico, derivación y preferencias del documento.
- `check-in-emocional`: emoción, intensidad, necesidad, respuesta de cuidado y registro diario.
- `bosque-mensual`: seis especies, SVG progresivos, hoja diaria, consulta y archivo mensual.
- `contenido-editorial`: procedencia, aprobación, variantes y navegación del recorrido principal.

### Modified Capabilities

- `me-esta-costando`: retirar los puntos de planta; el bosque solo crece con días de check-in. El flujo existente se conserva hasta su propuesta específica posterior.

## Impact

`App.js`, `src/store.js`, `src/firebase.js`, `src/fusion.js`, `src/sync.js`, `src/reportes.js`, pantallas, contenido, rutas nuevas en `src/app/`, reglas Firestore, tests y CI. No hay API propia ni configuración CORS propia; se define al introducir endpoints HTTP, si los hubiera.

Toca principios A1–A8, B9–B13 y C14–C21. Requiere revisión clínica del contenido y de la ampliación de datos de B9; cualquier cambio de constitución requiere acuerdo del equipo clínico y ambas personas de desarrollo. No se presume aprobación por recibir el Markdown. La propuesta no habilita publicación de textos ni despliegue.

La reparación de Sentry coordina con `agregar-observabilidad-sentry`; la evolución del flujo clínico coordinará con `completar-me-esta-costando`, sin archivarlos ni marcarlos completos.
