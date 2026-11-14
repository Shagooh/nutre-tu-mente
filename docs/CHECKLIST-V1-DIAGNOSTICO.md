# Checklist del Canvas y diagnóstico V1

Revisión del **14-11-2026** del código local de `feature/actualizacion-v1-nutrimind`. Este documento registra evidencia técnica y criterios de aceptación; no acredita revisión clínica ni pruebas en teléfonos.

**El diagnóstico V1 no está completo. Ninguna de las 12 preguntas cumple todavía su contrato completo.** `src/screens/Onboarding.js` conserva la encuesta histórica: nombre, objetivo, un momento, recordatorios, un estilo y espacio mental de cinco valores. Mostrar esa encuesta no equivale a implementar las doce preguntas, sus omisiones, perfiles y derivación.

## Fuentes y prioridad

- [Canvas original del 07-10](referencias/lean-canvas-original-2026-10-07.md): los nueve bloques y A–P definen el problema, la encuesta breve, datos mínimos, tono y límites. El ejemplo inicial del documento es ilustrativo, no un requisito del producto. El Canvas no contiene las doce preguntas.
- [Contenido del 26-10](referencias/contenido-desarrollo-2026-10-26.md): §3 detalla diagnóstico; §4 preferencias/edad; §6 funciones por perfil; §14 derivación/datos. Es la fuente de los criterios completos siguientes. Contenido recibido no equivale a aprobación clínica.
- [Constitución](../openspec/constitution.md) y [cambio aprobado](../openspec/changes/actualizar-v1-contenido-y-bosque/tasks.md): controlan implementación, consentimiento, mínimos de datos y tareas. El término diagnóstico designa el cuestionario inicial de acompañamiento; la app no emite un diagnóstico médico.

`[x]` significa implementado y comprobado en el alcance indicado. `[ ]` significa pendiente o parcial. Las casillas del diagnóstico solo se cierran cuando se cumple toda su fila, con prueba y revisión correspondiente.

## Diagnóstico completo: preguntas

| Cierre | Pregunta de §3 | Regla que debe comprobarse | Estado real |
| --- | --- | --- | --- |
| [ ] | 1 · Espacio de la comida en tu cabeza | Selección única de cuatro opciones, omisión y línea base con escala identificada | Hay una pregunta histórica de cinco valores; no es la escala V1 de cuatro opciones. |
| [ ] | 2 · Frases con las que te identificas | Múltiple; Ninguna excluye las otras; se puede omitir | Ausente. |
| [ ] | 3 · Qué has probado | Múltiple con las ocho opciones originales; Nada aún excluye las demás; omisión | Ausente. |
| [ ] | 4 · Momentos de incomodidad | Múltiple con seis opciones; omisión; uso contextual en resultado y sugerencia de tarde | El momento histórico es una selección única; no satisface §3. |
| [ ] | 5 · Qué ocurre al desbordarte | Múltiple con las ocho opciones; omisión y posterior validación intermedia | Ausente. |
| [ ] | 6 · Hambre y saciedad | Única con tres opciones; omisión | Ausente. La pregunta en Me está costando no sustituye la del diagnóstico. |
| [ ] | 7 · Cómo te hablas | Única con cuatro opciones; omisión | Ausente. |
| [ ] | 8 · Tiempo para ti | Única con tres opciones; omisión y posterior validación intermedia | Ausente. |
| [ ] | 9 · Qué te gustaría sentir | Hasta tres de ocho opciones; quitar una permite elegir otra; omisión | El objetivo histórico único no equivale a esta pregunta. |
| [ ] | 10 · Acompañamiento buscado | Única; Conciencia/Hábitos/Bienestar según opción; omisión asigna Conciencia | No existe asignación de esos perfiles. |
| [ ] | 11 · Por qué dejaste otras cosas | Múltiple con seis opciones; alternativa excluyente según especificación; omisión sin inventar respuesta | Ausente. La adaptación de avisos/mensajes requiere además el alcance posterior de recordatorios. |
| [ ] | 12 · Señales en los últimos tres meses | Múltiple obligatoria con cinco opciones; Ninguna excluye riesgo; no permite saltar; cualquier señal abre derivación | Ausente. El aviso general actual no hace evaluación de respuestas ni restringe rutas. |

## Diagnóstico completo: recorrido y contenido

- [x] Cuatro bienvenidas saltables y aceptación obligatoria del consentimiento actual: cubiertas por `onboarding-roble.test.js`. Los textos continúan en revisión; no se cierra por ello 6.3 completo.
- [ ] Catálogo versionado de preguntas/opciones, validaciones, resultados y preferencias, con fuente exacta, estado editorial y variantes; detectar textos/variantes faltantes sin inventarlos. Tarea 5.4.
- [ ] Una pregunta por pantalla y barra de avance específica de las doce preguntas; Atrás conserva selecciones y no duplica respuestas. Tareas 6.4–6.5.
- [ ] Saltar 1–11 conserva omisiones explícitas, no respuestas preseleccionadas; saltar la 10 asigna solo el perfil por defecto, sin inventar su respuesta. Tarea 6.5.
- [ ] Validación intermedia tras 5 y tras 8 con texto de la fuente y aprobación clínica registrada. Tareas 6.4–6.5.
- [ ] Nombre después del cuestionario y antes del resultado; editarlo después en Perfil. Actualmente el nombre se pregunta antes del cuestionario histórico. Tarea 6.7.
- [ ] Resultado exacto por perfil; interpolación de nombre/momento sin huecos; tres funciones del perfil según §6. Tarea 6.7. Falta acordar y registrar texto para omisión o múltiples momentos; no inventar una frase clínica.
- [ ] Preferencias 1–4: trato, edad, situación opcional y máximo dos estilos, editables. Tarea 6.7.
- [ ] Preferencias 5–7: formatos, tiempo y canal opcional; funciones y elección voluntaria de avisos. Tarea 6.8.
- [x] Los avisos históricos empiezan apagados y el guardado del onboarding espera confirmación local, con formulario conservado tras fallo (`onboarding-roble.test.js`).
- [ ] Sugerir tarde a partir de la 4 sin activarla automáticamente ni pedir permisos antes de confirmar. Tarea 6.8. La frecuencia adaptada a la 11 no se declara implementada por tener cuatro horarios históricos.

## Diagnóstico completo: seguridad y datos

- [ ] **Aprobación escrita** de ampliación de datos/consentimiento y modificación separada de B9 según 5.1, antes de activar diagnóstico nuevo. No se encontró evidencia de cierre de esa tarea.
- [ ] Derivación tras una señal de la 12, con textos, enlaces y destinos revisados; posibilidad de continuar solo con funciones de calma. Tarea 6.6.
- [ ] Menores de 18 no pueden continuar; mensaje revisado por el equipo clínico. Tarea 6.6.
- [ ] Restricciones de edad/derivación también al abrir un enlace, aviso, restaurar sesión o cambiar cuenta. La protección actual de Router solo exige perfil; no cubre estas restricciones. Tarea 6.6.
- [ ] Contrato versionado del perfil/diagnóstico, fixtures válidos e inválidos y escala inicial de cuatro opciones separada del seguimiento de cinco. Tarea 5.2.
- [ ] Migración idempotente de perfiles históricos sin inventar respuestas ni forzar otro onboarding; conservar blob anterior si falla lectura/escritura. Tarea 5.3. La migración de calendario ya hecha no cierra la del diagnóstico.
- [ ] Reglas Firestore y sync del diagnóstico: lista cerrada de campos, aislamiento A/B, reintento, conflicto y borrado. Tarea 5.7. Hoy las reglas del perfil solo admiten los campos históricos y rechazan campos nuevos de diagnóstico.
- [ ] Persistencia y reinicio del diagnóstico sin cuenta/red; recuperación de errores y restauración en otro cliente autorizado. Tareas 5.3/5.7 y verificación integrada.
- [ ] Revisión clínica de preguntas, resultados, consentimiento y derivación con fecha/responsable/alcance. Tarea 9.4. Recibir documentos o aprobar desarrollo no sustituye esa validación.
- [ ] Android e iPhone reales: tamaño de texto, TalkBack/VoiceOver, Atrás, cierre/reinicio, modo avión, enlaces directos y cambio de cuenta. Tareas 9.2–9.3.

## Resto del Canvas: checklist de producto

- [x] Check-in emocional con emoción/intensidad/necesidad, guardado durable y crecimiento local conservado al sincronizar; selección de un ganador por día. Borrador clínico y prueba técnica: [check-in](CHECKIN-HOJA.md), [calendario](CALENDARIO-OFFLINE.md).
- [ ] Check-in V1 completo: faltan sugerencias por perfil y recursos de cuidado aún no entregados (7.2). No anunciar audios o herramientas ausentes.
- [x] Navegación Inicio/Herramientas/Aprende/Perfil y rutas verificadas en pruebas; Mi bosque del roble con meses anteriores, top tres y regreso del cuidado (6.2/8.7).
- [ ] Arranque Android real, especies finales, elección mensual y diario asociado a la hoja. La exportación no cierra 6.1; 8.6 mantiene pendiente lector real y diario.
- [x] Me está costando conserva calma antes/después y respiración, sin aportar crecimiento al roble; flujo histórico comprobado.
- [ ] Me está costando V1 completo, tips, salidas y protocolo clínico: coordinar el cambio `completar-me-esta-costando`; no cerrarlo por conservar el flujo anterior.
- [x] Frase por estilo y lecciones históricas disponibles; los textos siguen siendo borradores.
- [ ] Banco V1 de frases y cápsulas 1–4, rotación sin repetición, personalización del cuestionario y audios revisados.
- [x] Cuenta opcional, persistencia local, aislamiento de sesiones y borrado recuperable con pruebas automatizadas. No equivale a prueba de servicios reales/staging.
- [ ] Consentimiento final y todos los textos clínicos aprobados; derivación y ayuda verificadas por el equipo.
- [ ] Recordatorios V1 completos y probados en teléfono: categorías, frecuencias, pausas, silencio y regreso sin culpa.
- [ ] Datos agregados/anónimos y métricas de retención/conversión; no exponer respuestas individuales al equipo editorial.
- [ ] Suscripción, prueba gratuita y acceso TTF: el Canvas deja decisiones de negocio abiertas; no implementar cobros por inferencia.
- [ ] Identidad visual final y recursos: el roble procedural es provisional; no acredita las seis especies.
- [x] Este incremento no introduce peso, calorías, medidas, rachas, comparaciones ni penalizaciones por ausencias.
- [ ] Validación integral con usuarias y equipo clínico: que ayude en la tarde, no se viva como exigencia y permita volver tras un día difícil. No se infiere eficacia clínica de Jest.

Recetas, comunidad, chat, widgets y organización quedan fuera de este incremento; el Canvas los sitúa entre lo que puede esperar. El documento del 26-10 concreta V1/Fase 2 y los cambios OpenSpec delimitan cada entrega.

## Orden para dejar el diagnóstico completo

1. Resolver 5.1 con el equipo clínico y ambas personas de desarrollo; registrar la aprobación necesaria. Preparar en paralelo el catálogo de 5.4 y las decisiones editoriales faltantes.
2. Completar contrato, migración y reglas/sync (5.2–5.3/5.7), con pruebas de compatibilidad y aislamiento.
3. Implementar preguntas 1–5 y 6–12 (6.4–6.5), resultado y preferencias (6.7–6.8), con los escenarios de cada fila.
4. Integrar derivación/edad y protección por rutas (6.6), solo con los textos aprobados. No activar el diagnóstico sin sus salidas de riesgo.
5. Ejecutar verificación integrada y validación clínica (9.1–9.4). Entonces revisar cada casilla con evidencia y declarar el diagnóstico completo.

Verificación de esta revisión: 20 suites/165 pruebas, 10 pruebas de reglas en emulador local, lint, typecheck gradual, OpenSpec estricto y exportaciones web/Android aprobados. **Estas comprobaciones no prueban un diagnóstico que todavía no existe.** El cambio principal queda en 29/55 tareas; no se modificó la versión 1.0.1 ni se autorizó una publicación.
