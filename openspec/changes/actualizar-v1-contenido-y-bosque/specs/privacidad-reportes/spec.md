# Spec Delta

## Purpose

Permitir diagnosticar fallos técnicos sin transmitir información clínica ni activar telemetría antes del consentimiento.

## ADDED Requirements

### Requirement: Consentimiento previo y único punto de activación
El sistema MUST NOT iniciar reportes antes del consentimiento ni enviarlos tras borrar datos, sin configuración válida o en desarrollo y pruebas.

#### Scenario: Importación antes del consentimiento
- **WHEN** arranca la app y carga sus módulos sin consentimiento
- **THEN** no se inicializa el SDK de reportes ni se envían eventos

#### Scenario: Consentimiento y borrado
- **WHEN** hay consentimiento y configuración válida y después se borran los datos
- **THEN** existe una sola inicialización controlada y los eventos posteriores al borrado se descartan

### Requirement: Exclusión de información sensible
Los reportes SHALL contener solo errores técnicos depurados y MUST NOT incluir usuario, IP, correo, textos del diario, respuestas clínicas, capturas, replay, logs o historial de interacción.

#### Scenario: Error con información sensible
- **WHEN** un error contiene correo, identificadores o texto escrito en un formulario
- **THEN** se envía solo un código técnico permitido y nunca el texto del formulario

#### Scenario: Verificación de integración
- **WHEN** se importa la entrada real de la app y se prueba un error antes y después del consentimiento
- **THEN** el comportamiento satisface la política sin una inicialización alternativa que la omita
