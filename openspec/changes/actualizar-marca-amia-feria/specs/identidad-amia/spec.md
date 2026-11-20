# Spec Delta

## Purpose
Presentar una identidad consistente de Amía en las pantallas de la aplicación y su presentación web móvil.

## ADDED Requirements

### Requirement: Nombre visible de la aplicación
La aplicación SHALL identificarse como Amía en bienvenida, nombre visible de la app, título web y avisos que mencionan el producto. Las referencias a Nutrimind como equipo creador o consulta SHALL conservar su significado.

#### Scenario: Recorrer las pantallas
- **WHEN** una persona recorre bienvenida, Inicio, Ajustes, Cuenta y Me está costando
- **THEN** las referencias al nombre de la aplicación dicen Amía y los avisos conservan su contenido clínico.

### Requirement: Logo de Amía
La aplicación SHALL mostrar el logo proporcionado en bienvenida e Inicio, sin deformarlo ni recortarlo, con identificación accesible.

#### Scenario: Ver desde un teléfono
- **WHEN** se abre bienvenida o Inicio en una pantalla de 320 px de ancho
- **THEN** el logo completo es visible y no provoca desbordamiento horizontal.
