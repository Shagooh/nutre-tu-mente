# Spec Delta

## Purpose

Representar los días registrados como árboles mensuales que crecen sin castigar ausencias y permiten consultar las emociones guardadas.

## ADDED Requirements

### Requirement: Catálogo de seis especies
El catálogo final SHALL ofrecer únicamente Araucaria, Quillay, Cerezo, Sauce, Olivo y Jacarandá y un nombre opcional. El roble SHALL ser un recurso exclusivo de desarrollo y prueba.

#### Scenario: Elegir especie
- **WHEN** abre la elección de árbol
- **THEN** encuentra esas seis especies y puede omitir el nombre personalizado

### Requirement: Una hoja por fecha
El sistema SHALL conservar como máximo una hoja por fecha con check-in y representar la emoción de mayor intensidad de esa fecha.

#### Scenario: Varios check-ins
- **WHEN** registra intensidad poco y luego mucho en la misma fecha
- **THEN** queda una hoja con la emoción del registro de intensidad mucho, conservando ambos check-ins

#### Scenario: Empate de intensidad
- **WHEN** los registros máximos empatan en intensidad
- **THEN** gana el último check-in de intensidad máxima por instante registrado, con ID como desempate si coincide el instante, y ambos dispositivos muestran el mismo resultado

### Requirement: Crecimiento por días registrados
El sistema SHALL crecer por días distintos con check-in y conservar el estado durante ausencias. El roble de prueba SHALL usar 30 SVG: índice 0 semilla sin check-ins e índice min(días registrados, 29). Las etiquetas de etapa SHALL usar 1–7, 8–15, 16–23 y 24+ hojas.

#### Scenario: Ausencia
- **WHEN** transcurren cinco días sin check-in
- **THEN** el árbol no retrocede ni avanza y no hay hojas vacías o marcadas como fallos

#### Scenario: Treinta y un días
- **WHEN** registra 31 fechas distintas de un mes
- **THEN** hay 31 hojas consultables y el árbol conserva el fotograma 30

#### Scenario: Semilla y último avance del roble
- **WHEN** se prueba el roble con 0, 1, 29 y 30 días registrados
- **THEN** se muestran respectivamente los recursos de índice 0, 1, 29 y 29, con 0, 1, 29 y 30 hojas consultables

#### Scenario: Mes corto
- **WHEN** completa un mes de 28 o 29 días
- **THEN** conserva 28 o 29 días registrados y no inventa días para completar 30; en el roble usa el índice 28 o 29 respectivamente

### Requirement: Archivo mensual y consulta accesible
El sistema SHALL iniciar un árbol al cambiar el mes, conservar los anteriores y ofrecer leyenda e iconos de emoción; tocar una hoja SHALL mostrar fecha, emoción, intensidad, necesidad y nota existente del diario.

#### Scenario: Cambio de mes
- **WHEN** abre Inicio el primer día de un mes nuevo
- **THEN** ve el estado inicial del nuevo árbol y el árbol anterior sigue accesible en Mi bosque

#### Scenario: Hoja y resumen
- **WHEN** toca una hoja o un árbol del bosque
- **THEN** consulta los datos de esa hoja o el resumen de las tres emociones más frecuentes del mes; no depende solo del color para entenderlos

### Requirement: Recursos finales verificables
El sistema MUST NOT presentar el dibujo procedural o recursos de otras especies como los fotogramas finales aprobados.

#### Scenario: Falta de SVG
- **WHEN** todavía no se entregan los SVG de una especie
- **THEN** la aceptación visual de esa especie permanece pendiente y cualquier sustituto de desarrollo se identifica como provisional

### Requirement: Calendario verificable del bosque
El bosque SHALL usar la fecha de captura persistida en America/Santiago, incluso sin cuenta ni conexión. La confirmación del servidor SHALL ser independiente del crecimiento y no trasladar fechas. El contrato completo SHALL seguir `calendario-bosque` del cambio aprobado `conservar-crecimiento-offline`.

#### Scenario: Reloj alterado
- **WHEN** cambia el calendario o la zona del dispositivo entre dos registros recibidos el mismo día del bosque
- **THEN** las fechas ya guardadas no cambian; una captura nueva usa la referencia monotónica reciente o una fecha local provisional si no existe

#### Scenario: Sincronización tardía
- **WHEN** una captura pendiente se sube después de perder la referencia de sesión
- **THEN** conserva su fecha del bosque y su crecimiento provisional, sin trasladar la hoja al día de reconexión ni atribuirle confirmación retroactiva
