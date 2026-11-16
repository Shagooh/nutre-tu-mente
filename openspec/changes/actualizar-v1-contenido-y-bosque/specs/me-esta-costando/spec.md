# Spec Delta

## REMOVED Requirements

### Requirement: Puntos de cuidado con tope diario
**Reason**: El bosque del documento crece con días de check-in, no con puntos de uso de herramientas.
**Migration**: Conservar los registros y las mediciones de calma existentes; retirar la suma de puntos para crecimiento al activar el bosque. Usar `bosque-mensual` como contrato de crecimiento, sin borrar historial.
