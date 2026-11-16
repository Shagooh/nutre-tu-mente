# Spec Delta

## Purpose

Permitir que el bosque acompañe a la persona sin cuenta ni conexión, conservando sus días registrados al recuperar red y sincronizar con otros dispositivos.

## ADDED Requirements

### Requirement: Crecimiento local durable
El bosque SHALL crecer con días distintos de check-in guardados en el teléfono, incluso sin cuenta ni conexión. SHALL incluir fechas provisionales sin castigar ausencias ni exigir confirmación remota.

#### Scenario: Tres días sin cuenta
- **WHEN** guarda check-ins en tres días distintos sin cuenta ni conexión y reinicia la app
- **THEN** conserva tres días de crecimiento y tres hojas, con sus fechas provisionales

#### Scenario: Varios registros y fallo de guardado
- **WHEN** guarda tres check-ins de una misma fecha y falla una cuarta escritura
- **THEN** conserva un avance con los tres registros durables y no anuncia guardada la cuarta captura

### Requirement: Fecha persistida del bosque
La fecha del bosque SHALL fijarse al guardar la captura en America/Santiago, usando referencia monotónica reciente si existe y reloj local si no existe. SHALL conservarse al reiniciar o sincronizar. Un cambio de reloj posterior MUST NOT mover hojas guardadas.

#### Scenario: Reconexión en otro mes
- **WHEN** guarda el 31 de diciembre y el 1 de enero sin red y sincroniza el 3 de enero
- **THEN** conserva una hoja en diciembre y una en enero, sin trasladarlas al 3 de enero

#### Scenario: Reloj y zona modificados
- **WHEN** cambia zona o calendario del teléfono después de guardar una captura
- **THEN** la fecha del bosque de esa captura permanece igual; capturas nuevas sin referencia fiable usan fecha local provisional de America/Santiago

### Requirement: Confirmación independiente del crecimiento
La app SHALL distinguir fecha provisional, confirmación temporal y sincronización. La recepción tardía SHALL conservar su instante de servidor sin confirmar retroactivamente el día capturado. Ningún cambio de estado SHALL reducir el crecimiento guardado.

#### Scenario: Recepción tardía
- **WHEN** una captura provisional del día 10 se recibe en el servidor el día 13
- **THEN** sigue perteneciendo al día 10, aparece sincronizada con fecha provisional y no crea otra hoja el día 13

#### Scenario: Captura reciente confirmada
- **WHEN** una captura reciente se confirma dentro de la ventana fiable existente y la fecha del servidor coincide con su fecha del bosque
- **THEN** se muestra confirmada sin cambiar su hoja ni duplicar su crecimiento

### Requirement: Convergencia y aislamiento
La sincronización SHALL conservar identidad, fecha del bosque e instante de captura. Ambos dispositivos de la misma cuenta SHALL derivar una hoja por fecha, seleccionando mayor intensidad, luego instante y luego ID. MUST NOT mezclar cuentas ni reactivar datos borrados.

#### Scenario: Dos dispositivos y reintento
- **WHEN** dos dispositivos sincronizan en distinto orden tres check-ins de una fecha, dos empatados en intensidad máxima, y se reintenta una escritura
- **THEN** ambos muestran una hoja con el último máximo por instante/ID y tres registros sin duplicados

#### Scenario: Copia local y cambio de cuenta
- **WHEN** vincula explícitamente una copia local a A y después cambia a B
- **THEN** A recupera sus fechas locales en otro dispositivo y B no recibe esos registros ni sus hojas

#### Scenario: Borrado pendiente
- **WHEN** otro dispositivo intenta subir capturas durante o después del borrado remoto antes de una nueva vinculación autorizada
- **THEN** se rechaza la subida y no se reconstruye el bosque borrado

### Requirement: Compatibilidad histórica y retorno mensual
La migración SHALL conservar IDs y ánimo originales; para históricos SHALL usar fecha confirmada existente o, si falta, su fecha de historial como provisional. SHALL ser idempotente y conservar el almacenamiento original ante fallo. Al abrir un mes nuevo SHALL conservar los árboles previos sin inventar hojas.

#### Scenario: Migración repetida
- **WHEN** migra dos veces datos históricos con y sin confirmación
- **THEN** conserva IDs, contenido e historial, sin convertir ánimo a emoción ni duplicar días

#### Scenario: Migración interrumpida
- **WHEN** el blob es ilegible o falla la escritura de la migración
- **THEN** se conserva la copia anterior y se ofrece reintento sin anunciar la migración completa

#### Scenario: Cambio de mes sin red
- **WHEN** abre la app en un mes nuevo sin red ni referencia reciente
- **THEN** usa el mes de America/Santiago según el reloj local para la vista actual y conserva los árboles anteriores sin mover sus hojas

### Requirement: Explicación accesible y revisada
La interfaz SHALL permitir identificar una fecha provisional y el estado de sincronización sin depender solo del color. Los textos SHALL tener revisión clínica antes de publicación y MUST NOT presentar una captura local como fecha verificada por servidor.

#### Scenario: Consulta sin cuenta
- **WHEN** consulta una hoja provisional sin cuenta con lector de pantalla
- **THEN** puede reconocer su fecha y condición provisional sin una invitación obligatoria a crear cuenta

#### Scenario: Texto pendiente
- **WHEN** falta aprobación clínica de los textos informativos
- **THEN** la aceptación de publicación permanece pendiente y las pruebas de desarrollo no se declaran aprobación clínica
