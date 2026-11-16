# Spec Delta

## Purpose

Registrar cómo se siente la persona y qué necesita, ofreciendo una respuesta de cuidado y una hoja diaria sin exigencias.

## ADDED Requirements

### Requirement: Emoción e intensidad
El sistema SHALL ofrecer las diez emociones y sus colores de la sección 8, una intensidad poco/medio/mucho y una necesidad; SHALL conservar varios check-ins del día sin permitir elegir color independiente de la emoción.

#### Scenario: Registro completo
- **WHEN** elige una emoción, intensidad y necesidad y confirma
- **THEN** se guarda con identidad estable, fecha y hora; la hoja usa el color asociado a la emoción

### Requirement: Cuidado contextual
El sistema SHALL mostrar la validación y acción del documento, aplicando respuestas especiales antes de la acción normal y ofreciendo Me está costando para intensidad mucho en ansiedad, estrés, tristeza, enojo o soledad.

#### Scenario: Combinación especial
- **WHEN** elige Ansiosa y Comer
- **THEN** se muestra la respuesta especial y la secuencia Respira y luego ¿Tengo hambre?, solo cuando esos destinos estén disponibles y aprobados

#### Scenario: Contenido pendiente
- **WHEN** la respuesta necesita un audio o herramienta todavía no entregado
- **THEN** no aparece un enlace roto ni se anuncia disponible; la aceptación completa de esa ruta queda pendiente

### Requirement: Cierre e historial compatible
El sistema SHALL agradecer solo después del guardado durable, permitir Ahora no en la sugerencia de temas y conservar los registros antiguos sin atribuirles emoción o intensidad nuevas.

#### Scenario: Dato antiguo
- **WHEN** se abre un check-in que solo tenía ánimo numérico
- **THEN** se conserva como histórico sin inventar una emoción nueva o alterar el progreso ya guardado

#### Scenario: Sugerencia por perfil
- **WHEN** termina el check-in
- **THEN** se ofrecen tres temas de su perfil según la sección 8 y enlaces a cápsulas 1–4 disponibles con opción Ahora no
