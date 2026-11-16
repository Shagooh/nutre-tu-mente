# Tasks

Cada tarea está acotada a 2 horas como máximo; dividir si la ejecución revela más trabajo. No marcar aprobación clínica, recursos recibidos o pruebas móviles sin evidencia. Los grupos 1–4 son la primera entrega técnica; 5–9 son el recorrido principal y quedan sujetos a las decisiones y recursos indicados. El resto de V1 tiene su mapa en `docs/PLAN-ACTUALIZACION-V1.md` y requerirá propuestas propias.

## 1. Runtime y comprobaciones

- [x] 1.1 Resolver Node 22 frente al requisito >=24.12 de Firebase, documentar versión compatible local/CI y verificar instalación y Jest sin advertencias de engine (2 h).
- [x] 1.2 Configurar ESLint para JavaScript con hooks y no-empty; verificar `npx expo lint` sin instalación implícita y documentar problemas heredados (2 h).
- [x] 1.3 Configurar comprobación JS gradual sin conversión masiva; verificar `npx tsc --noEmit` sobre módulos de dominio incluidos y documentar alcance (2 h).

## 2. Reportes y guardado seguro

- [x] 2.1 Quitar inicialización alternativa de Sentry y conservar un módulo controlado; probar importación de App antes de consentimiento y después del borrado, coordinar con el cambio Sentry abierto (2 h).
- [x] 2.2 Restringir reportes a códigos técnicos y verificar con errores que contienen notas, correo e IDs que no se transmiten textos clínicos ni replay (2 h).
- [x] 2.3 Modelar error de lectura sin escritura automática; probar JSON inválido, rechazo de getItem y reintento conservando el blob (2 h).
- [x] 2.4 Serializar escrituras y devolver confirmación durable; probar fallo y orden invertido de promesas, documentar contrato de actualizar (2 h).
- [x] 2.5 Hacer que check-in y cierre de cuesta esperen persistencia, conservando formulario al fallar; verificar interacción con almacenamiento rechazado y `npm test` (2 h).

## 3. Cuentas y sincronización

- [x] 3.1 Añadir pruebas con Firebase Emulator Suite para usuario A, B y anónimo, sin usar producción; verificar rechazos cruzados y documentar comando reproducible (2 h).
- [x] 3.2 Cercar operaciones por UID y generación, atender sesión restaurada antes de cargar datos; probar respuesta tardía tras salir/cambiar cuenta o empezar borrado (2 h).
- [x] 3.3 Mantener identidad estable de operaciones pendientes tras reinicio; verificar recuperación de la misma operación sin duplicados (2 h).
- [x] 3.4 Implementar comparación de registros inmutables y reglas correspondientes; verificar respuesta perdida, reintento idéntico y conflicto de contenido sin sobrescritura (2 h).
- [x] 3.5 Incorporar revisión de perfil y conflicto visible; probar dos dispositivos editando el mismo campo y campos disjuntos, documentar contrato (2 h).

## 4. Borrado recuperable

- [x] 4.1 Precisar el ciclo de barrera remota y reinicio de datos con cuenta conservada; verificar diagrama y escenarios concurrentes revisados antes de codificar (1 h).
- [x] 4.2 Persistir fase e identidad de borrado y detener sync; probar cierre de app y fallo entre lotes con reanudación (2 h).
- [x] 4.3 Implementar barrera y reglas para impedir resubida desde otro dispositivo; verificar con emulador creación rechazada durante borrado (2 h).
- [x] 4.4 Diferenciar borrar todo y eliminar cuenta conservando copia local; probar reautenticación, fallos remotos y confirmación explícita antes de vincular otra cuenta (2 h).
- [x] 4.5 Ejecutar integración de grupos 1–4 y documentar límites; verificar Jest, emulador, lint, comprobación JS y ninguna modificación remota de producción (2 h).

## 5. Contratos y contenido

Coordinación aprobada el 13-11-2026: las tareas 1.2/2.2/3.1 de `conservar-crecimiento-offline` implementan el contrato temporal, su migración y reglas. 5.2/5.3/5.7 siguen pendientes para el resto del dominio V1; no se marcan completas por resolver solo calendario e identidad visual. El crecimiento por servidor de 8.11–8.12 queda sustituido por la propuesta offline aprobada.

- [ ] 5.1 [Equipo clínico y desarrollo] Revisar ampliación de datos B9 y consentimiento; verificar aprobación escrita y proponer modificación de constitución por separado antes de activar diario/diagnóstico nuevo (1 h de preparación).
- [x] 5.2 Definir esquema versionado de perfil, check-in y árbol; verificar fixtures válidos e inválidos y mantener explícitas las dos escalas de espacio mental (2 h).
- [x] 5.3 Implementar migración local idempotente con IDs históricos; probar dos ejecuciones, blob ilegible y escritura fallida sin pérdida (2 h).
- [x] 5.4 Extraer catálogo de bienvenida, diagnóstico y preferencias con fuente/estado/variante; verificar texto contra secciones 2–4 y detectar faltantes (2 h).
- [x] 5.5 Extraer emociones, necesidades y respuestas especiales; probar precedencia y diez emociones con colores, sin cambios clínicos inventados (2 h).
- [ ] 5.6 Extraer frases y mapa de temas a cápsulas 1–4; probar agotamiento por estilo y sugerencias sin repetición semanal (2 h).
- [ ] 5.7 Extender reglas y sync del nuevo dominio; probar campos nuevos autorizados, campos prohibidos y acceso cruzado antes del cliente de staging (2 h).

## 6. Navegación e incorporación

- [ ] 6.1 Consultar docs Expo SDK 57 e instalar Router mediante expo install; verificar arranque web/Android, rutas fuera del dominio y documentar efecto en Expo Go (2 h).
- [x] 6.2 Implementar barra Inicio/Herramientas/Aprende/Perfil y accesos existentes; probar atrás, enlaces y ausencia de destinos vacíos (2 h).
- [ ] 6.3 Implementar cuatro bienvenidas y consentimiento; probar Saltar y bloqueo sin aceptación, registrar estado editorial (2 h).
- [ ] 6.4 Implementar diagnóstico 1–5 con validación intermedia; probar omisiones, múltiples y exclusión de Ninguna (2 h).
- [ ] 6.5 Implementar diagnóstico 6–12 y asignación de perfil; probar máximo tres en 9, default Conciencia y obligatoriedad de 12 (2 h).
- [ ] 6.6 [Equipo clínico] Implementar derivación y bloqueo de menores solo con textos aprobados; probar que no se accede a herramientas restringidas por ruta directa (2 h).
- [ ] 6.7 Implementar nombre, resultado y preferencias 1–4; probar edición, variante de trato y máximo dos estilos (2 h).
- [ ] 6.8 Implementar preferencias 5–7, selección de funciones y confirmación de notificaciones; probar modo offline, permiso denegado y selección voluntaria (2 h).
- [ ] 6.9 Implementar Inicio con saludo, frase, sugerencia, check-in y regreso; probar ausencia de tres días sin mensaje de culpa y completar `npm test` del grupo (2 h).

## 7. Check-in

- [x] 7.1 Implementar emoción e intensidad y una necesidad; probar formulario incompleto, guardado durable y persistencia sin red (2 h).
- [ ] 7.2 Conectar respuesta de cuidado, regla mucho y sugerencias por perfil; probar combinaciones especiales y destinos disponibles, sin anunciar audios faltantes (2 h).
- [x] 7.3 Implementar desempate confirmado: último check-in de intensidad máxima, orden por instante e ID; verificar convergencia ante distinto orden de llegada (1 h).

## 8. Bosque y recursos SVG

- [x] 8.13 Mostrar «Tu árbol germinó» para roble desde el primer día confirmado de la cuenta y conservar el logro histórico de flores.

- [x] 8.12 Mostrar en Inicio y Progreso el roble del laboratorio según fechas confirmadas del mes en el perfil vinculado. Sin referencia temporal fiable se conserva el último mes confirmado. Validar duplicados, cambio de mes y días provisionales.

- [x] 8.11 Integrar calendario confirmado por recepción del servidor, referencia monotónica de sesión y registros provisionales. Probar cambio de reloj, reconexión e inmutabilidad.

- [x] 8.10 Aplicar la entrega provisional autorizada el 11-11: bellota del laboratorio de roble como única elección del onboarding, conservar la especie al guardar y mostrarla sin sustitución por flores en Inicio/Progreso/Ajustes; probar consentimiento, guardado fallido, reintento y compatibilidad histórica (2 h).
- [ ] 8.1 Recibir y validar los 30 SVG del roble de prueba, con semilla como índice 0 previo al check-in; documentar los recursos pendientes de las seis especies y la selección de especie al cambiar mes (1 h).
- [ ] 8.2 Implementar catálogo de seis especies y nombre opcional; probar lista exacta y compatibilidad de elecciones históricas sin sustitución silenciosa (2 h).
- [x] 8.3 Implementar proyección de hoja diaria y crecimiento mensual con índice de prueba min(días, 29); probar meses 28/29/30/31, semilla con cero días, ausencias y varios check-ins (2 h).
- [ ] 8.4 Definir manifiesto y validación de SVG; verificar cantidad, viewBox, tamaño y ausencia de scripts o referencias remotas con fixtures técnicos (2 h).
- [ ] 8.5 Integrar fotogramas y anclajes del roble solo en desarrollo/prueba; verificar un recurso visible e índices 0/1/29 para 0/1/29–31 días, sin exponerlo como especie final (2 h).
- [ ] 8.9 Registrar entregas gráficas de las seis especies finales y abrir tareas individuales al recibirlas; verificar que ninguna se declara terminada usando el roble como sustituto (1 h).
- [ ] 8.6 Implementar consulta accesible de hoja y leyenda; probar fecha/emoción/intensidad/necesidad/nota, iconos y lector de pantalla (2 h).
- [x] 8.7 Implementar Mi bosque y resumen mensual; probar tres emociones frecuentes, cambio de mes y conservación de árboles previos (2 h).
- [x] 8.8 Retirar puntos de planta y adornos del recorrido nuevo; verificar que Me está costando mantiene registro/calma pero no hace crecer el árbol, actualizar delta y `npm test` (2 h).

## 9. Verificación integrada

- [ ] 9.1 Ejecutar `npm test`, pruebas de reglas, `npx expo lint`, `npx tsc --noEmit` y OpenSpec estricto; documentar resultados sin confundir pendientes con aprobados (2 h).
- [ ] 9.2 Verificar export web y Android, y recorrido principal en Android real con modo avión, reinicio y cambio de cuenta; registrar dispositivo y evidencias (2 h).
- [ ] 9.3 Verificar recorrido principal y accesibilidad en iPhone real y contraste/escala de fuente en ambos sistemas; registrar diferencias y resolver fallos de aceptación (2 h).
- [ ] 9.4 [Equipo clínico] Revisar escenarios y contenido del recorrido principal, consentimientos y derivación; registrar qué se aprobó y qué sigue bloqueado (2 h de preparación).
- [ ] 9.5 Preparar propuesta siguiente de herramientas, diario, audios, semana, logros, recordatorios y edición editorial; verificar cobertura contra secciones 5 y 9–14 sin incluir Fase 2 (2 h).

## Workflow follow-up

- 5.2 y 5.3: contrato de perfil inicial con incorporación versionada, check-in emocional v2 y elección mensual de árbol; fixtures válidos e inválidos. La migración local versiona el contenedor histórico, conserva sus IDs, su flor y la escala de seguimiento y se prueba con doble carga, JSON ilegible y escritura fallida. La sesión de revisión usa memoria y termina en Inicio. 5.1 y 5.7 siguen abiertos.

- Evidencia del 14-11-2026 para 5.4: `catalogo-incorporacion.test.js` coteja la copia y las tablas con la referencia del 26-10. Los faltantes de consentimiento, resultado, edad y trato están registrados en el catálogo y en `docs/CHECKLIST-V1-DIAGNOSTICO.md`. Continúan pendientes la aprobación clínica, 5.1 y el recorrido real de las doce preguntas.

- Evidencia del 14-11-2026 para 8.7: ruta protegida `/bosque`, acceso desde Inicio, resumen de tres emociones ganadoras por día, cambio de diciembre a enero con semilla nueva y recuperación del mes anterior. Pruebas de regreso hoja → cuidado → misma hoja, días 30/31, históricos y cambio de almacenamiento. Jest: 20 suites/165 pruebas; lint, typecheck y exportaciones web/Android aprobados. 8.6 conserva pendiente diario/lector real; 6.1 y 7.2 siguen pendientes. Ver `docs/CHECKIN-HOJA.md` y `docs/CHECKLIST-V1-DIAGNOSTICO.md`.

- Revisar y unir propuestas antes de aplicar comportamiento nuevo, siguiendo `docs/PROCESO-SDD.md`.
- Abrir una tarea de integración de máximo 2 horas por cada especie final al recibir sus recursos; 8.5 solo integra el roble de prueba.
- Actualizar specs vigentes al archivar; coordinar cambios abiertos Sentry y Me está costando, sin darlos por completados.
- Publicar solo tras revisión humana y validación clínica; versión y etiqueta se preparan en un PR propio. No se ha autorizado despliegue.
