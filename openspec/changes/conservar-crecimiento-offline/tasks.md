# Tasks

Todas las tareas tienen un máximo de dos horas. La propuesta debe aprobarse antes de implementar; la revisión clínica no se presume por completar pruebas técnicas.

## 1. Alineación y contrato

- [x] 1.1 Tras aprobación de producto, reconciliar el calendario, diseño y tareas del cambio `actualizar-v1-contenido-y-bosque` con esta propuesta; comprobar que no quedan reglas contradictorias y ejecutar OpenSpec estricto (1 h).
- [x] 1.2 Coordinar con 5.2 de V1 el contrato versionado de `diaBosque`/`instante` e identidad visual de árbol local/vinculado; entregar fixtures válidos e inválidos y pruebas de compatibilidad, sin duplicar esa tarea (2 h).
- [ ] 1.3 [Equipo clínico y desarrollo] Preparar y registrar aprobación de textos para fecha provisional/sincronización y su lectura accesible; contrastar con escenarios de explicación y conservar bloqueada la publicación mientras falte aprobación (1 h de preparación).

## 2. Captura, persistencia y migración

- [x] 2.1 Fijar día e instante al capturar con referencia monotónica o reloj local en America/Santiago; probar cambio de zona, reloj, medianoche y horario de verano de Chile, documentando qué sigue provisional (2 h).
- [x] 2.2 Coordinar con 5.3 de V1 la migración idempotente y la identidad local persistida; probar dos ejecuciones, IDs históricos, ánimo sin conversión, blob inválido y fallo de escritura sin pérdida del original (2 h).
- [x] 2.3 Derivar crecimiento sin UID con una hoja por fecha, conservar desempate y calcular mes actual sin anclaje al último confirmado; probar tres días offline, varios registros, días 30/31 y diciembre/enero, documentar el contrato (2 h).

## 3. Reglas y sincronización

- [x] 3.1 Coordinar con 5.7 de V1 reglas para nuevos campos y adición mínima de metadatos históricos; verificar formatos, versión, campos prohibidos, cuerpo inmutable, A/B/anónimo y barrera de borrado en emulador (2 h).
- [x] 3.2 Preservar fecha/instante/identidad visual entre push, comparación canónica y pull; probar recepción tardía, respuesta perdida, reintento y dos órdenes de llegada, sin duplicación ni traslado de fecha (2 h).
- [x] 3.3 Mantener cercas por cuenta/generación y vinculación explícita de copia local; probar reinicio, salida, cambio A→B, borrado concurrente y recuperación de A en otro cliente, documentar límites (2 h).

## 4. Interfaz

- [x] 4.1 Integrar roble sin cuenta con la misma proyección y mostrar estados de fecha/sync con textos revisados o borrador explícito en desarrollo; probar guardar fallido, reinicio y lectura accesible sin depender del color (2 h).
- [x] 4.2 Conectar identidad visual y consulta de días con la entrega de UI V1, preservando días 30/31 y archivos anteriores; comprobar que otro dispositivo con la misma cuenta deriva las mismas fechas, detalle y dibujo (2 h).

## 5. Verificación integral

- [x] 5.1 Ejecutar `npm test`, `npm run test:rules`, `npm run lint`, `npm run typecheck` y `npx @fission-ai/openspec@1.14.3 validate --all --strict`; revisar todos los escenarios y registrar evidencia y pendientes (2 h).
- [ ] 5.2 Validar staging con dos cuentas y dos dispositivos reales Android/iOS: modo avión varios días, reinicio, reconexión, cambio de mes, reloj/zona, lector de pantalla y borrado; registrar versión, dispositivo y resultado sin publicar producción (2 h).

## Workflow follow-up

- Revisar por Pull Request y coordinar el archivo con `actualizar-v1-contenido-y-bosque` para no dejar contratos de calendario incompatibles en las especificaciones vigentes.
- Mantener pendiente la aprobación clínica o de publicación que no tenga evidencia; no marcar el recorrido V1 completo por cerrar este calendario.
