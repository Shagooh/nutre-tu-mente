# Tasks

Cada tarea técnica se limita a dos horas. Las revisiones externas son sesiones de revisión; su espera no equivale a aprobación. Implementar únicamente después de aprobar la propuesta.

## 1. Contrato y contenido
- [x] 1.1 Documentar la aclaración mínima del principio 9 para la preferencia lingüística y su relación con pref-1 del cambio V1; verificar aprobación explícita antes de habilitar persistencia, sin autorizar otros datos demográficos.
- [x] 1.2 Crear inventario y matriz de variantes por clave para bienvenida, objetivos, Inicio, check-in, ayuda, progreso/bosque, lecciones, frases y recordatorios; verificar que se distinguen textos dirigidos a la persona, terceros e IDs inmutables.
- [x] 1.3 [EQUIPO CLÍNICO] Revisar las variantes de acompañamiento y las reformulaciones neutras de la matriz; registrar aprobación por pieza y pendientes. No publicar variantes clínicas pendientes ni considerarlas definitivas.

## 2. Datos y compatibilidad
- [x] 2.1 Leer documentación del SDK instalado y añadir contrato puro de trato con enum opcional, neutro efectivo y adaptación de pref-1 legado; probar tres valores, ausencia, valor inválido, precedencia canónica y ausencia de inferencia por apodo.
- [x] 2.2 Integrar guardado parcial y compatibilidad en App/store sin cambiar nutre-tu-mente:v1 ni reiniciar perfiles; probar fixture antiguo, recarga, fallo de escritura, historial intacto y sesión aislada de revisión. Ejecutar npm test -- --ci --runInBand.
- [x] 2.3 Ampliar reglas de perfil solo para el enum y preservar elecciones ante omisiones; probar en emulador documento antiguo, tres opciones, valor inválido, intento de eliminación, acceso cruzado y borrado legítimo mediante npm run test:rules.
- [x] 2.4 Integrar la preferencia en fusión de tres vías; probar cambio offline, perfil remoto antiguo, cambios en campos distintos, conflicto explícito, reintento, alta/cambio de cuenta y borrado. Documentar compatibilidad y errores esperados de clientes antiguos.

## 3. Elección y aplicación
- [x] 3.1 Crear selector accesible Él/Ella/Neutro y añadirlo después del consentimiento en bienvenida; probar omisión, selección, retroceso, saltar introducción, finalización y persistencia. Mantener el estado Sin elegir distinto de Neutro.
- [x] 3.2 Reutilizarlo en Perfil/Ajustes con Guardar cambios, estado guardado y error recuperable; probar usuarios antiguos y nuevos, con/sin cuenta, sin red, recarga y actualización inmediata de la interfaz solo después de guardar.
- [x] 3.3 Adaptar el recorrido RevisionDiagnostico y su contrato para una sola pregunta de trato; probar lectura de pref-1, edición consistente e inexistencia de escrituras en almacenamiento o nube reales. Ejecutar npm test -- --ci --runInBand.
- [x] 3.4 Implementar resolver y variantes de bienvenida, objetivos e Inicio según matriz; probar cada elección, omisión, lenguaje neutro sin terminaciones en e y atribución intacta de las creadoras.
- [x] 3.5 Aplicar variantes aprobadas en check-in, CuidadoCheckin y MeCuesta; probar etiquetas, respuestas y validaciones con las tres opciones, manteniendo IDs, acciones e historial idénticos.
- [x] 3.6 Aplicar variantes restantes en Progreso/Bosque, frases, lecciones y recordatorios según inventario; verificar cobertura completa, notas libres intactas y que no se activan recordatorios por cambiar el trato. Ejecutar npm test -- --ci --runInBand y documentar el uso desde Ajustes.

## 4. Verificación integral
- [x] 4.1 Ejecutar npm run lint, npm run typecheck, npm test -- --ci --runInBand, npm run test:rules y npx @fission-ai/openspec@1.14.3 validate --all --strict; registrar resultados y resolver regresiones del cambio.
- [ ] 4.2 Revisar escenarios en web a 320 px con fuente ampliada y en Android/iOS o Expo Go: bienvenida completa, sesión histórica sin limpieza de cookies, cambios sucesivos, recarga, desconexión, reconexión y revisión aislada. Registrar cobertura y cualquier plataforma pendiente sin declarar validación no realizada.
- [x] 4.3 Preparar instrucciones de despliegue con reglas antes que cliente, prueba de staging y rollback sin borrar preferencias; verificar que las variantes clínicas y ampliación mínima de datos tengan aprobación registrada antes de recomendar publicación. Este plan no autoriza un despliegue.
