# Check-in → hoja: avance técnico

Revisión local del 13 de noviembre de 2026. Cambio `actualizar-v1-contenido-y-bosque`, coordinado con el calendario offline aprobado. Este incremento completa el formulario emocional y su conexión al roble de prueba; no equivale al recorrido clínico V1 completo ni a publicación.

## Comportamiento implementado

- El formulario ofrece diez emociones con icono, intensidad poco/medio/mucho y una única necesidad. Sin las tres respuestas no guarda. El cuidado escrito sigue siendo opcional y limitado a 280 caracteres.
- Guarda `schemaVersion: 2`, ID estable, fecha/hora del historial, `diaBosque`, instante UTC canónico, emoción, intensidad, necesidad y cuidado. Conserva captura e identidad cuando falla el disco y agradece solo tras persistir. Una repetición idéntica del ID no duplica el registro; contenido diferente bajo ese ID produce conflicto.
- Los históricos conservan su ánimo y necesidades originales con calendario versión 1. No se convierten en emociones ni intensidades nuevas. Un reinicio reconoce ambas versiones; las desconocidas o inválidas se rechazan sin sobrescribir el blob original.
- Una fecha produce una hoja aunque haya varios registros. Gana la intensidad mayor, después el instante más reciente y, si también coincide, el ID mayor por comparación de cadenas. La proyección es independiente del orden de llegada.
- `tree.emotions` y `leafSymbols` conectan los diez colores e iconos con el SVG. Las seis paletas `moods` del laboratorio permanecen compatibles. Los nuevos HEX son propuestas visuales basadas en los colores de §8, pendientes de revisión; no se presentan como recursos finales aprobados.
- El dibujo mantiene índice `min(días, 29)`. Los días 30/31 tienen grupos propios sobre anclajes adultos deterministas y entradas independientes en la consulta. Meses de 28/29 días no inventan fechas; las ausencias no reducen el crecimiento.
- Se puede tocar una hoja o abrir la lista accesible para ver fecha, emoción, intensidad, necesidad y cuidado del check-in. La leyenda muestra texto, icono y color. El cuidado no se presenta como nota de diario: ese dominio aún falta.
- La consulta permite revisar meses anteriores y sus tres emociones más frecuentes, contando una emoción ganadora por día. El resumen de últimos siete días también reconoce emociones nuevas sin convertirlas a puntajes; mantiene la lectura numérica de los históricos.
- El roble no recibe puntos por herramientas ni lecciones. Las flores históricas conservan su comportamiento anterior. El onboarding ahora explica crecimiento sin cuenta ni conexión.

## Contenido y datos

El catálogo de §8 conserva procedencia, versión, trato, fase y estado de revisión clínica por pieza. El formulario y las paletas se identifican como provisionales. Tras guardar se muestra la validación de la emoción como borrador; no se anuncian audios ni destinos ausentes.

La función editorial `respuestaCheckin` ya resuelve excepciones y apoyo por intensidad; **su conexión completa de acciones, ayuda directa y tres temas por perfil sigue pendiente en 7.2**. No se activó diagnóstico, diario ni ampliación de datos fuera de check-ins. Las tareas generales 5.1–5.3/5.7 conservan sus pendientes para el resto de V1, aunque este incremento define y verifica la parte del check-in.

Las reglas aceptan payloads históricos versión 1 y emocionales versión 2 con listas cerradas de campos/valores. Exigen intensidad entera 1–3, necesidad única e instante; rechazan mezclas con ánimo histórico, campos prohibidos, escrituras cruzadas y cambios de contenido. La migración remota de históricos solo añade calendario versión 1; nunca les atribuye emociones.

La sincronización conserva el contenido inmutable y la identidad visual del bosque. Ver [Calendario offline](CALENDARIO-OFFLINE.md). Estas reglas y clientes requieren verificación y despliegue coordinados en staging; no se desplegó nada a producción.

## Evidencia de verificación

- Jest: 17 suites y 142 pruebas aprobadas. Incluyen formulario incompleto, selección única, disco rechazado y reintento estable; fixtures válidos/inválidos de versión 2; conservación de históricos; meses 28/29/30/31 con colores, iconos y SVG sin coordenadas inválidas; desempate y resumen; respuesta perdida y recuperación en otro cliente; crecimiento independiente de herramientas.
- Reglas: diez pruebas aprobadas contra emulador local independiente en puerto 8098. Comprueban A/B/anónimo, formatos, campos prohibidos, inmutabilidad, metadatos históricos, borrado e identidad visual. `npm run test:rules` sigue siendo el comando habitual; se usó la configuración temporal de `.tools` porque el puerto 8089 estaba ocupado.
- ESLint y `tsc --noEmit` aprobados en su alcance configurado; typecheck incluye el dibujo TypeScript y mantiene la comprobación JS gradual.
- Exportaciones web y Android generadas en `.tools/checkin-emocional-export`. Verificación visual de la versión web a 390 × 844 con perfil ficticio sin cuenta: elegir Ansiosa/mucho/Comer, guardar, volver al roble y abrir el detalle mostró la selección y el cuidado escrito. No se usaron datos personales reales ni cuenta remota.

## Pendientes para cerrar el recorrido

La respuesta de cuidado completa, sugerencias por perfil, notas de diario y acceso a su calendario siguen pendientes. Mi bosque y el resumen mensual del roble de prueba completan 8.7; 8.6 conserva los pendientes del diario y la validación con lector real. Las seis especies finales y sus recursos tampoco se sustituyen por el roble.

Actualización del 14-11-2026: la navegación ya utiliza Expo Router y conecta el cierre con respiración y apoyo de intensidad alta, preservando el regreso al registro guardado. Ver [Navegación](NAVEGACION.md). La respuesta de cuidado completa, sugerencias por perfil, revisión clínica y destinos faltantes continúan pendientes en 7.2.

Faltan aprobación clínica, accesibilidad con lector de pantalla real y pruebas de staging con dos cuentas y dos teléfonos Android/iOS. Las pruebas de dos clientes y el navegador local no equivalen a dos dispositivos físicos. No se marca completo el cambio entero ni se prepara una versión de producción.

## Mi bosque y regreso al cuidado — 14-11-2026

- Inicio abre `/bosque`, una ruta protegida con el archivo mensual del roble de prueba. No añade otra copia de los árboles: cada mes se deriva de los registros conservados. El mes nuevo empieza con semilla; los meses anteriores y los días 30/31 siguen consultables.
- El resumen muestra hasta tres emociones, contando solo el registro ganador de cada día, con iconos y nombres. Los históricos conservan el ánimo original, sin inventar emoción ni intensidad.
- Cada día es un botón con estado expandido/seleccionado y área mínima de 48. El detalle aparece inmediatamente después del botón y agrupa fecha, emoción, intensidad, necesidad y cuidado escrito. La leyenda mantiene diez nombres, iconos y colores provisionales. Los controles de cuidado quedan fuera del grupo accesible de texto.
- El detalle reutiliza la misma respuesta que el cierre del check-in. Ofrece únicamente recursos implementados; volver de respiración o Me está costando conserva mes y hoja. No guarda otro check-in ni anuncia herramientas o audios ausentes. El contenido clínico sigue marcado en revisión.
- Cambiar `bosqueId` reinicia la consulta; el enlace sin perfil conduce a bienvenida y el borrado pendiente impide ver hojas. Las flores históricas permanecen intactas.

Verificación: 20 suites y **165 pruebas aprobadas**, ESLint, typecheck gradual, OpenSpec estricto y exportaciones web/Android. Pruebas nuevas: cambio de mes con la pantalla abierta, recuperación del mes anterior, top tres y desempate, días 30/31, expansión accesible, históricos, vuelta desde cuidado y cambio de almacenamiento. Exportaciones en `.tools/bosque-export-web` y `.tools/bosque-export-android`. No se afirma inspección visual nueva, arranque Android ni validación VoiceOver/TalkBack.

Avance del cambio: **29/55**. 6.1, 7.2, 8.6 y las validaciones clínicas/en dispositivos siguen abiertas. El diagnóstico se audita aparte en [Checklist V1 y diagnóstico](CHECKLIST-V1-DIAGNOSTICO.md).

Reglas verificadas nuevamente el 14-11-2026: `npm run test:rules` con Node 24.12.0 y Java 21 local, proyecto `demo-nutrimind`, emulador Firestore en 127.0.0.1:8089; **10 pruebas aprobadas**, sin servicios de producción. Esta ejecución usa la configuración habitual del repositorio.
