# Spec Delta

## MODIFIED Requirements

### Requirement: Acceso desde la pantalla principal
El sistema SHALL mostrar en "Hoy" un botón principal "Me está costando" que abre el flujo. SHALL ser circular, centrado horizontalmente, más alto que los botones habituales, con texto legible y sin superponerse al resto del contenido.

#### Scenario: Abrir el flujo
- **WHEN** la persona está en "Hoy" y toca "Me está costando"
- **THEN** se abre el primer paso (calma antes) y el botón "Continuar" está desactivado hasta que elija un valor del 1 al 5

#### Scenario: Presentación móvil
- **WHEN** Inicio se muestra en un teléfono de 320 px de ancho
- **THEN** el botón circular está centrado, muestra su etiqueta completa y permite acceder al resto del contenido mediante desplazamiento.
