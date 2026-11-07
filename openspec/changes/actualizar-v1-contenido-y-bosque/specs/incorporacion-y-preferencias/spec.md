# Spec Delta

## Purpose

Presentar el acompañamiento y recoger solo las respuestas necesarias respetando consentimiento, edad y derivación clínica.

## ADDED Requirements

### Requirement: Recorrido inicial
El sistema SHALL seguir las secciones 1–6 del contenido: cuatro bienvenidas saltables, consentimiento obligatorio, diagnóstico, nombre y resultado, preferencias, notificaciones, funciones y elección de árbol; SHALL permitir terminar sin cuenta ni red.

#### Scenario: Saltar bienvenida
- **WHEN** la usuaria salta la introducción
- **THEN** llega al consentimiento y no puede continuar sin aceptarlo

#### Scenario: Diagnóstico y perfil
- **WHEN** omite las preguntas 1–11 y responde Ninguna en la 12
- **THEN** puede continuar con perfil Conciencia, sin inventar respuestas omitidas

#### Scenario: Selecciones del diagnóstico
- **WHEN** responde el diagnóstico
- **THEN** se respetan selección única, múltiple y máximo tres de la pregunta 9; Ninguna excluye otras opciones de su pregunta

### Requirement: Edad y derivación
El sistema SHALL impedir continuar a menores de 18 y ofrecer derivación cuando la pregunta 12 contenga una señal de riesgo, con acceso posterior limitado a calma según la sección 14.

#### Scenario: Menor de edad
- **WHEN** selecciona Menos de 18
- **THEN** no accede al producto y ve el mensaje validado de orientación, sin diagnosticar

#### Scenario: Señal declarada
- **WHEN** marca alguna opción de riesgo en la pregunta 12
- **THEN** ve derivación y si continúa solo accede a Respira, frases y audios disponibles, sin herramientas de hambre

### Requirement: Preferencias editables y decisiones voluntarias
El sistema SHALL guardar trato, rango etario, situación opcional, uno o dos estilos, formatos, tiempo y canal opcional; SHALL permitir editar preferencias, funciones y notificaciones sin activar recordatorios sin confirmación.

#### Scenario: Selección de tarde
- **WHEN** eligió Tarde en el diagnóstico
- **THEN** se presenta el recordatorio sugerido y se programa solo después de confirmar la selección y obtener permiso

#### Scenario: Escalas históricas
- **WHEN** responde la pregunta inicial de cuatro opciones
- **THEN** se conserva su escala original y no se presenta una conversión automática al seguimiento de cinco valores
