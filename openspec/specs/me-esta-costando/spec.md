# me-esta-costando Specification

## Purpose
Acompañar a la persona en el momento de desborde con la comida, sin juicio: ayudarla a parar, entender qué necesita y
tratarse con cuidado. Es la función 1 del Lean Canvas y la hipótesis más arriesgada del producto.

## Requirements

### Requirement: Acceso desde la pantalla principal
El sistema SHALL mostrar en "Hoy" un botón principal "Me está costando" que abre el flujo.

#### Scenario: Abrir el flujo
- **WHEN** la persona está en "Hoy" y toca "Me está costando"
- **THEN** se abre el primer paso (calma antes) y el botón "Continuar" está desactivado hasta que elija un valor del 1 al 5

### Requirement: Flujo de seis pasos en orden
El sistema SHALL guiar a la persona por seis pasos, en este orden: calma antes, respiración, tipo de hambre, necesidad,
trato y calma después.

#### Scenario: Avanzar paso a paso
- **WHEN** la persona completa un paso obligatorio y pulsa "Continuar"
- **THEN** avanza al siguiente paso, sin poder saltarse los pasos obligatorios (calma antes, tipo de hambre, necesidad, trato y calma después)

### Requirement: Medición de calma de 1 a 5
El sistema SHALL medir la calma en una escala de 1 a 5, al inicio y al final del flujo, y SHALL exigir un valor en ambos momentos para avanzar.

#### Scenario: Calma obligatoria
- **WHEN** la persona no ha elegido un valor de calma
- **THEN** el botón para continuar permanece desactivado

### Requirement: Respiración guiada opcional
El sistema SHALL ofrecer una respiración guiada de 60 segundos (4 s inhalando y 6 s exhalando) con un círculo animado, y
SHALL permitir saltarla sin penalización.

#### Scenario: Respirar un minuto
- **WHEN** la persona toca el círculo
- **THEN** alterna "Inhala" y "Exhala" y muestra los segundos que faltan

#### Scenario: Saltar la respiración
- **WHEN** la persona toca "Saltar la respiración" sin haber respirado
- **THEN** avanza al siguiente paso y el registro indica que no respiró

### Requirement: Tipo de hambre sin juicio
El sistema SHALL preguntar si es hambre física, emocional o "no lo sé", y SHALL mostrar para cada opción un mensaje cálido y sin juicio.

#### Scenario: Elegir hambre emocional
- **WHEN** la persona elige "Hambre emocional"
- **THEN** ve un mensaje que normaliza lo que siente y la invita a preguntarse qué necesita

### Requirement: Acción de autocuidado según la necesidad
El sistema SHALL ofrecer una lista de necesidades y SHALL mostrar, para la elegida, una acción de autocuidado concreta y pequeña.

#### Scenario: Elegir "Descanso"
- **WHEN** la persona elige la necesidad "Descanso"
- **THEN** ve una acción breve y concreta para descansar

### Requirement: Sin castigo ni culpa
El sistema MUST NOT castigar, juzgar ni culpar a la persona por ninguna de sus decisiones dentro del flujo, y SHALL decir
explícitamente que si igual come, no pasa nada.

#### Scenario: Si igual come
- **WHEN** la persona llega al paso "¿Cómo te quieres tratar ahora?"
- **THEN** el texto le dice que decida lo que decida no hay castigo y que puede comer con presencia

### Requirement: Acceso a contención ("Esto me supera")
El sistema SHALL mostrar en todos los pasos del flujo un acceso "Esto me supera" que abre un mensaje de contención y
recomienda buscar ayuda profesional.

#### Scenario: Pedir apoyo
- **WHEN** la persona toca "Esto me supera" en cualquier paso
- **THEN** ve un mensaje de contención que recomienda contactar a un profesional y puede volver al flujo

### Requirement: Registro al terminar
El sistema SHALL guardar el registro de uso únicamente cuando la persona completa el último paso, con fecha, hora, calma
antes y después, si respiró, tipo de hambre, necesidad y trato. Si sale antes, el sistema MUST NOT guardar ningún registro.

#### Scenario: Completar el flujo
- **WHEN** la persona pulsa "Listo" en el último paso
- **THEN** se guarda un registro con todos esos datos y se cierra el flujo

#### Scenario: Salir a mitad
- **WHEN** la persona sale del flujo antes del último paso
- **THEN** no se guarda ningún registro

### Requirement: Puntos de cuidado con tope diario
El sistema SHALL sumar puntos de cuidado a la planta por cada uso del flujo, con un máximo de 3 puntos por día.

#### Scenario: Más de tres usos en un día
- **WHEN** la persona completa el flujo cinco veces el mismo día
- **THEN** ese día solo suma 3 puntos de cuidado

### Requirement: Apoyo ante uso frecuente
El sistema SHALL mostrar en "Hoy" un mensaje cálido que sugiere hablarlo con un profesional cuando haya 5 o más usos en
los últimos 7 días, y MUST NOT presentarlo como alarma ni como juicio.

#### Scenario: Cinco usos en una semana
- **WHEN** la persona acumula 5 usos en 7 días y abre "Hoy"
- **THEN** ve un mensaje cálido que sugiere conversarlo con un profesional

### Requirement: Cambio de calma presentado con amabilidad
El sistema SHALL mostrar en "Progreso" el cambio promedio de calma antes y después, ignorando los registros incompletos, y
SHALL presentarlo de forma positiva o neutra, nunca como un fracaso.

#### Scenario: La calma subió
- **WHEN** el promedio de calma después es mayor que el de antes
- **THEN** "Progreso" muestra cuántos puntos subió en promedio

#### Scenario: La calma no subió
- **WHEN** el promedio no mejora
- **THEN** "Progreso" muestra un mensaje que valora haber parado, sin tono de fracaso

### Requirement: Funciona sin conexión y sin cuenta
El sistema SHALL permitir usar el flujo completo sin conexión y sin cuenta, guardando el registro en el teléfono, y SHALL
sincronizarlo después solo si la persona tiene una cuenta.

#### Scenario: Sin conexión
- **WHEN** la persona usa el flujo sin internet
- **THEN** el registro se guarda en el teléfono y se sincroniza cuando haya conexión y una cuenta
