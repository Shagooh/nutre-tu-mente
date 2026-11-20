# Spec Delta

## Purpose
Permitir que cada persona elija y cambie cómo se dirige Amía a ella, conservando su sesión y progreso incluso cuando el perfil es anterior a esta preferencia.

## ADDED Requirements

### Requirement: Elección inicial voluntaria
El sistema SHALL ofrecer Él, Ella y Neutro durante la bienvenida, después del consentimiento y antes de las preguntas personalizadas. SHALL permitir continuar sin elegir, sin preseleccionar una opción ni inferirla. SHALL explicar que puede cambiarse desde Ajustes.

#### Scenario: Elegir cada alternativa
- **WHEN** una persona selecciona cualquiera de las tres opciones y termina la bienvenida
- **THEN** se conserva su elección y Ajustes muestra esa misma alternativa.

#### Scenario: Omitir y volver
- **WHEN** continúa sin elegir o retrocede en la bienvenida
- **THEN** omitir usa lenguaje neutro sin registrar una elección explícita, y retroceder conserva cualquier selección ya realizada.

#### Scenario: Saltar la introducción
- **WHEN** pulsa Saltar bienvenida
- **THEN** mantiene el consentimiento y la oportunidad de elegir el trato antes de las preguntas personalizadas.

### Requirement: Edición permanente en Ajustes
El sistema SHALL permitir seleccionar cualquiera de las tres opciones desde Perfil/Ajustes, con o sin cuenta y sin red. SHALL aplicar la elección tras guardarla, sin reiniciar ni cerrar sesión, e informar de los fallos sin afirmar que se guardó.

#### Scenario: Cambio y recarga
- **WHEN** guarda Ella, luego Él y finalmente Neutro desde Ajustes y recarga después de cada cambio
- **THEN** se mantiene la última elección guardada y el lenguaje corresponde a ella.

#### Scenario: Fallo de almacenamiento
- **WHEN** falla la escritura local
- **THEN** permanece la preferencia guardada anteriormente, se explica el fallo y se permite reintentar sin perder los demás datos.

### Requirement: Perfiles antiguos sin interrupciones
El sistema SHALL aceptar perfiles sin esta preferencia y ofrecer su edición en Ajustes. SHALL usar lenguaje neutro mientras no haya elección válida, diferenciando falta de elección de Neutro explícito. MUST NOT reiniciar onboarding, borrar almacenamiento ni cerrar la sesión para añadirla.

#### Scenario: Sesión previa local o autenticada
- **WHEN** abre la versión nueva con un perfil antiguo
- **THEN** accede a Inicio y conserva cuenta, árbol, historial y ajustes; Perfil muestra Sin elegir y permite guardar cualquiera de las alternativas.

#### Scenario: Valor local desconocido
- **WHEN** encuentra un valor de trato no reconocido en un perfil local
- **THEN** usa el estado Sin elegir y lenguaje neutro, conserva los demás campos y permite corregirlo desde Ajustes.

### Requirement: Lenguaje coherente y datos estables
El sistema SHALL adaptar el lenguaje dirigido a la persona según su elección, manteniendo tú. Neutro SHALL usar frases sin género, sin terminaciones en e. MUST NOT cambiar IDs de respuestas, registros históricos, texto libre ni referencias al género de terceros. Las variantes clínicas SHALL publicarse solo tras revisión del equipo clínico.

#### Scenario: Cambiar el trato con historial
- **WHEN** modifica el trato y recorre Inicio, check-in, ayuda, progreso, perfil y contenido de acompañamiento
- **THEN** las etiquetas y mensajes usan las variantes correspondientes y el historial conserva IDs, fechas, notas y resultados originales.

#### Scenario: Atribución del equipo
- **WHEN** se muestra información sobre las creadoras de Amía
- **THEN** esa atribución no se modifica por la preferencia de trato del usuario.

### Requirement: Persistencia segura y sincronización opcional
El sistema SHALL guardar únicamente la preferencia de lenguaje elegida y sincronizarla cuando la cuenta tenga nube habilitada. SHALL aceptar perfiles remotos sin el campo y rechazar valores nuevos fuera del catálogo. SHALL preservar la elección frente a omisiones de clientes antiguos y tratar cambios simultáneos según el mecanismo de conflictos existente.

#### Scenario: Guardado sin red y otro dispositivo
- **WHEN** cambia el trato sin conexión y luego sincroniza con su cuenta
- **THEN** se conserva el cambio local y puede recuperarse en otro dispositivo tras sincronizar, sin afectar otros campos.

#### Scenario: Escrituras simultáneas o antiguas
- **WHEN** otro cliente omite el campo o ambas sesiones modifican explícitamente el trato de forma incompatible
- **THEN** la omisión no borra una elección válida y el conflicto explícito no sobrescribe silenciosamente ninguna elección.

#### Scenario: Validación y borrado
- **WHEN** se intenta guardar un valor remoto ajeno al catálogo o borrar la cuenta
- **THEN** el valor inválido se rechaza y el borrado autorizado elimina también la preferencia, con el aislamiento existente entre cuentas.

### Requirement: Una elección consistente en ambos recorridos
El sistema SHALL usar una sola preferencia efectiva en la bienvenida habitual y en el recorrido de revisión del diagnóstico. SHALL conservar el aislamiento de la sesión de revisión y evitar preguntas o valores contradictorios.

#### Scenario: Preferencia existente del prototipo
- **WHEN** se carga una sesión de revisión con pref-1 válido y sin la preferencia canónica
- **THEN** se interpreta esa elección y Ajustes permite cambiarla sin activar persistencia ni nube de producción.
