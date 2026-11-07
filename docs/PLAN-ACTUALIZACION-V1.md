# Actualización V1 de Nutrimind

Estado: propuesta para revisión, 2026-11-07. No declara funciones implementadas.

## Fuentes y decisiones

1. Decisiones del responsable de producto en esta conversación: conservar Firebase Auth y Firestore; seis especies; crecimiento mediante fotogramas SVG de semilla a árbol adulto; seguir el documento de contenido para color, check-ins e interacción.
2. [Contenido del 26 de octubre](referencias/contenido-desarrollo-2026-10-26.md): referencia funcional V1 y Fase 2. Copia íntegra, no implica aprobación clínica automática.
3. [Lean Canvas original](referencias/lean-canvas-original-2026-10-07.md): contexto de negocio. Su ejemplo inicial no describe el producto contratado. El contenido posterior amplía su V1.
4. `openspec/constitution.md`: principios actuales. Las ampliaciones de datos requieren revisión clínica y de ambas personas de desarrollo antes de modificar la constitución.

El SDD local de PostgreSQL queda como antecedente histórico en la rama de respaldo, no como arquitectura vigente. `docs/lean-canvas.md` se conserva como documentación del equipo; las fuentes originales se agregan sin sobrescribirla.

## Respaldo y base

- Base actual: `origin/main`, commit `74ebfec`, versión 1.0.1.
- Respaldo local: `feature/respaldo-jardin-local-20261107`, commit `acda420`. Contiene todo el prototipo del jardín, sus fotos, pruebas, Docker y SDD. No se publicó al remoto.
- Rama de preparación: `feature/actualizacion-v1-nutrimind`.
- No reaplicar el respaldo completo: pisa cuentas, sincronización y reportes incorporados por Shagooh.

## Conservar y sustituir

Conservar Auth, Firestore opcional, Jest, pipeline, versionado y OpenSpec. Reutilizar componentes y respiración tras verificar escenarios. Conservar registros históricos sin inventar emociones ni intensidades que nunca se capturaron.

Sustituir la navegación por estado por Expo Router, onboarding y check-in por los del documento; planta por puntos por bosque mensual; elección libre de color por emoción. Reutilizar lógica mensual y pruebas del prototipo solo cuando expresen las reglas nuevas. No integrar las 12 especies, las fotos, el dibujo procedural ni los adornos automáticos. Docker no forma parte del flujo principal de esta V1.

## Entregas y orden

| Entrega | Resultado comprobable | Dependencias |
| --- | --- | --- |
| 0. Base segura | Sentry tras consentimiento, guardado visible, pruebas de reglas y cuentas, sync y borrado recuperables, runtime compatible | Revisión de propuesta |
| 1. Contratos y contenido | Datos versionados, migración, catálogo con procedencia y estado clínico, rutas | Entrega 0 |
| 2. Recorrido principal | Bienvenida, consentimiento, diagnóstico, preferencias, Inicio, check-in y bosque conectados | Entrega 1; SVG finales para aceptación visual |
| 3. Herramientas | Me está costando, hambre, después de comer, respiración y diario | Contratos, validación clínica |
| 4. Contenido y seguimiento | Audios, Aprende 1–4, frases, semana y logros | Archivos y textos aprobados |
| 5. Recordatorios y operación | Horarios, no molestar, destinos, edición de contenido, validación móvil y staging | Entregas anteriores |

Un PR por tarea o conjunto pequeño; ejecutar pruebas al cerrar cada grupo. No cambiar la versión ni desplegar producción durante la preparación.

## Jardín acordado y puntos pendientes

- Especies: Araucaria, Quillay, Cerezo, Sauce, Olivo y Jacarandá.
- Máximo una hoja por fecha con check-in; color según emoción; gana la mayor intensidad del día.
- Confirmado el 2026-11-07: los 30 SVG son para un roble de prueba; el primero es la semilla antes del primer check-in. Índice visual `min(días con check-in, 29)` sobre recursos 0–29: semilla con cero días, adulto desde el día 29; días 30 y 31 suman hojas sin otro fotograma. Las ausencias conservan el estado.
- Las etapas 1–7, 8–15, 16–23 y 24+ clasifican progreso; no reemplazan los fotogramas diarios.
- Tocar hoja abre fecha, emoción, intensidad, necesidad y nota disponible; leyenda e iconos accesibles.
- Empate confirmado: gana el último check-in de intensidad máxima. Desempate técnico adicional por ID si coincide el instante, para mantener convergencia entre dispositivos.
- El roble se habilita solo como recurso de desarrollo/prueba, no como séptima especie del catálogo final. Los SVG de las seis especies siguen pendientes; no se encargó todavía una serie por especie.
- Especie por defecto al cambiar mes: pendiente de definición. No resolverla en silencio durante implementación.

## Dependencias externas y revisión

Pendientes: SVG y licencia de uso; audios y versiones neutras; cápsulas completas; enlace de agenda; variantes de trato; protocolo y palabras de riesgo; confirmación de líneas de ayuda antes de publicar; texto legal; política para analítica agregada.

El diagnóstico inicial usa 4 respuestas de espacio mental y el seguimiento 5: conservar ambas escalas sin conversión automática hasta acordar la interpretación.

El documento llama V1 a gratitud y audios pero difiere diario completo y otras meditaciones: se aplica la versión simple explícita de V1. No se implementan recetas, organización personal, tracker, widgets, premios ni cápsulas 5–14.

## Hallazgos técnicos para la entrega 0

- `App.js` inicializa Sentry directamente con PII, logs y replay antes del consentimiento; contradice `src/reportes.js`. Debe quedar un solo punto de inicialización.
- `src/store.js` oculta fallos; una lectura fallida puede terminar sobrescribiendo el almacenamiento. El éxito visual debe esperar persistencia.
- `src/sync.js` evita documentos duplicados por ID pero modifica timestamps en cada reintento y permite sobrescritura. Falta contrato verificable de reintento y conflicto.
- Revisar resultados de sync que llegan después de cambiar sesión o iniciar borrado; nunca aplicarlos a otra cuenta ni permitir que resuciten datos.
- Borrado por lotes no atómico: persistir estado de operación y reanudarlo antes de declarar éxito.
- `firestore.rules` no admite el dominio nuevo; requiere pruebas de emulador y despliegue coordinado. No se confirmó la configuración desplegada.
- No existe API HTTP propia ni CORS propio. Si aparece un endpoint HTTP se especificará su autenticación y CORS; CORS no sustituye autorización.
- Firebase instalado declara Node >=24.12.0; local y pipeline usan 22. Resolver compatibilidad y documentar runtime antes de aceptar la base.
- No hay TypeScript ni ESLint configurados. La primera entrega debe incorporar comprobaciones útiles para JavaScript, sin una conversión masiva a TypeScript.

## Cambios existentes de OpenSpec

`completar-me-esta-costando` sigue pendiente: coordinar su validación clínica y reemplazar los requisitos que cambien en el mismo PR de implementación. `agregar-observabilidad-sentry` no está cerrado: la corrección debe añadir pruebas sobre `App.js`, no solo sobre el módulo aislado.

Este plan no archiva ni marca como terminados esos cambios. No amplía automáticamente el acceso a datos para profesionales.

## Verificación de esta preparación (2026-11-07)

Actualización posterior: los grupos 1–4 se implementaron en la misma rama. Evidencia y límites actuales en [BASE-SEGURA.md](BASE-SEGURA.md). Los resultados siguientes describen la preparación inicial, no el estado final de las herramientas.

- `npm ci --no-audit --no-fund`: completado; avisos de engine de Firebase con Node 22.22.2 y dependencias obsoletas. Sin modificación del lockfile.
- `npm test -- --ci --runInBand`: 3 suites, 62 pruebas, todas pasan. Son las pruebas heredadas; no certifican el comportamiento nuevo propuesto.
- OpenSpec 1.14.3 `validate --all --strict --no-interactive`: 4 elementos válidos, cero fallos.
- ESLint y comprobación TypeScript intentados en modo offline: no ejecutables disponibles ni configuración del proyecto; no se declaran aprobados y no se instalaron herramientas para alterar esta entrega documental.
- No se implementó funcionalidad nueva, no se publicaron ramas ni se desplegaron servicios. El respaldo y la propuesta están en ramas locales.
