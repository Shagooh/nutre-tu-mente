# Calendario del bosque sin conexión

Implementación de la propuesta `conservar-crecimiento-offline`, aprobada por producto el 13 de noviembre de 2026. La aprobación funcional no sustituye revisión clínica ni autoriza producción.

## Contrato

- Cada captura nueva guarda `schemaVersion: 1`, `diaBosque: YYYY-MM-DD` e `instante` UTC ISO con milisegundos, además de `fecha`/`hora` del historial. Usa America/Santiago con referencia monotónica reciente o reloj local. Un reintento del formulario conserva la captura inicial.
- La versión 1 amplía únicamente calendario: conserva ánimo, necesidades y cuidado del formato actual. No activa emoción/intensidad/necesidad V1, diario ni diagnóstico. El resto de las tareas 5.2/5.3/5.7 de V1 permanece pendiente.
- Incremento posterior de esta fecha: el check-in emocional utiliza versión 2, con el mismo calendario offline e identidad visual. Convive con los históricos versión 1 sin convertirlos. Su formulario, colores y límites de validación están documentados en [Check-in → hoja](CHECKIN-HOJA.md); las revisiones clínicas y la publicación continúan pendientes.
- Cada almacenamiento tiene `bosqueId`, un identificador visual sin datos personales. Se guarda antes de publicar una migración. Al sincronizar, una transacción crea o recupera `users/{uid}/bosque/identidad` con `{id, schemaVersion: 1, generacion}`. En una cuenta existente prevalece la identidad ya guardada; en una cuenta nueva se conserva la identidad local. No es una credencial ni permite leer otra cuenta.
- Un día distinto suma un avance, también sin cuenta o con fecha provisional. El máximo gráfico sigue en índice 29; las fechas 30/31 son entradas distintas. El mes actual usa referencia reciente o reloj local; los meses anteriores pueden consultarse desde «Ver días de mi árbol».
- `confirmadoEn` conserva el sello de servidor para capturas recientes. Una fecha solo aparece confirmada si ese sello coincide con `diaBosque`; sincronizado y fecha provisional son estados compatibles. Una recepción tardía no traslada la hoja al día de reconexión. `actualizado` conserva el instante remoto de recepción aunque la captura no tenga confirmación temporal.

## Migración y reglas

La migración usa primero `diaBosque` válido ya guardado. En históricos usa fecha confirmada o, si falta, `fecha` como provisional. No inventa instante, emoción ni intensidad. Mantiene IDs y ánimo; se puede ejecutar dos veces sin cambios. Un blob ilegible, versión desconocida o fecha inválida impide migrar y conserva la copia anterior. Si falla la escritura, no se publica la migración ni se habilitan escrituras con datos vacíos.

La sincronización migra también históricos remotos mediante adición única de `schemaVersion`/`diaBosque` y generación si faltaba. No cambia cuerpo ni sellos. Las reglas restringen los históricos sin confirmación a su fecha original; para los confirmados limitan la fecha a los días posibles según UTC-3/UTC-4. El cliente usa la zona IANA exacta, incluyendo el cambio de hora. Un conflicto de contenido o fecha canónica se informa sin sobrescribir el registro remoto.

La identidad visual es inmutable, queda aislada por UID y generación y se elimina dentro del borrado recuperable. Borrar todo genera después otra identidad local; eliminar cuenta conservando el teléfono mantiene la copia y exige la vinculación explícita ya existente. Las respuestas tardías de otra sesión no aplican ni identidad ni hojas.

Los clientes anteriores no adjuntan el calendario requerido al crear check-ins: **verificar y desplegar reglas y cliente coordinadamente en staging**. No se desplegaron reglas ni se modificó producción. Un rollback debe usar un cliente compatible con estos campos; no borrar fechas para volver al esquema anterior.

## Verificación local

Node 24.12.0 y Java 21 locales. Pruebas de dominio e interfaz: contrato válido/inválido, migración repetida, disco lleno, reinicio, conservación de ánimo, tres días offline, diciembre/enero, días 30/31, cambio de reloj, salto horario de Chile, dos clientes de la misma cuenta, reintentos, aislamiento A/B, respuesta tardía y borrado. Los casos de comparación emocional del cambio V1 siguen pasando; no representan todavía colores V1 visibles.

Resultado: `npm test -- --runInBand` aprobó 16 suites y 131 pruebas. ESLint y `tsc --noEmit` aprobaron el alcance configurado (la comprobación JS sigue siendo gradual). Exportaciones web y Android generadas en `.tools/calendario-offline-web` y `.tools/calendario-offline-android`; no equivalen a pruebas en dispositivo real. OpenSpec estricto aprobó los seis elementos actuales, incluida esta propuesta.

El comando habitual de reglas es `npm run test:rules`. Durante esta revisión el puerto 8089 estaba ocupado por otro proceso; se usó un emulador independiente en 8098, con proyecto demo y configuración temporal ignorada en `.tools/calendario-offline-firebase.json`. Las pruebas siguen leyendo las reglas del repositorio. La ejecución produjo nueve pruebas aprobadas. Los rechazos PERMISSION_DENIED son aserciones negativas esperadas.

## Revisión pendiente

Textos informativos propuestos, siempre marcados como texto en revisión en la consulta:

- «Las fechas provisionales también hacen crecer tu árbol. Se conservan cuando sincronizas.»
- Estados independientes: «Fecha provisional»/«Fecha confirmada» y «Solo en este teléfono»/«Sincronizado».

El equipo clínico debe registrar fecha, responsable y aprobación o correcciones de esos textos y de su lectura accesible. Sin esa evidencia no se cierra la tarea clínica ni la publicación.

La validación de staging en dos teléfonos reales Android/iOS permanece pendiente. Debe registrar versión y modelo, modo avión varios días, reinicio, reconexión, cambio de mes, reloj/zona, lector de pantalla y borrado. Las pruebas automatizadas de dos clientes no sustituyen esta validación.
