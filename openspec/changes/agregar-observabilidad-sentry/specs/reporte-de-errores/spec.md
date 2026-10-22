# Spec Delta

## Purpose

Permite al equipo enterarse de los errores y caídas de la app, con la versión y la plataforma donde ocurren, sin recoger
datos personales ni observar el comportamiento de las personas.

## ADDED Requirements

### Requirement: Reporte de errores y caídas
El sistema SHALL enviar al equipo un reporte cuando la app sufra una caída o un error no controlado, y cuando falle la
sincronización con la nube.

#### Scenario: Error no controlado
- **WHEN** ocurre un error no controlado en la app y el reporte está activo
- **THEN** se envía un reporte con el error y su traza, y la persona no ve ningún aviso ni pantalla nueva por ello

#### Scenario: Fallo de sincronización
- **WHEN** la sincronización con la nube falla y el reporte está activo
- **THEN** se envía un reporte con el código del error y la persona sigue viendo el mensaje cálido que ya existe

### Requirement: Sin datos personales
El sistema MUST NOT incluir en un reporte el apodo, el correo, el identificador de cuenta, las respuestas de la
encuesta, los check-ins, el uso de "Me está costando", los horarios de recordatorio ni la dirección IP.

#### Scenario: Reporte sin identidad
- **WHEN** se prepara un reporte de una persona con cuenta y datos guardados
- **THEN** el reporte no contiene usuario, correo, apodo ni dirección IP, y ninguno de sus datos guardados

#### Scenario: Mensajes que contienen datos
- **WHEN** el mensaje de un error incluye un correo electrónico o un identificador de cuenta
- **THEN** ese valor se elimina o se sustituye antes de enviar el reporte

### Requirement: Sin analítica de comportamiento
El sistema MUST NOT registrar capturas de pantalla, grabaciones de sesión, toques, pantallas visitadas, métricas de
rendimiento ni mediciones de uso como parte del reporte de errores.

#### Scenario: Solo el error
- **WHEN** se envía un reporte
- **THEN** no incluye migas de pan de navegación ni de toques, capturas, grabación de sesión ni trazas de rendimiento

### Requirement: Consentimiento previo
El sistema SHALL activar el reporte de errores únicamente después de que la persona haya aceptado el uso de sus datos
al inicio.

#### Scenario: Antes de aceptar
- **WHEN** la persona aún no ha completado el consentimiento inicial y ocurre un error
- **THEN** no se envía ningún reporte

#### Scenario: Después de aceptar
- **WHEN** la persona ha aceptado el consentimiento y ocurre un error
- **THEN** el reporte se envía

#### Scenario: Borrado total
- **WHEN** la persona borra todos sus datos
- **THEN** el reporte de errores deja de enviarse hasta que vuelva a aceptar el consentimiento

### Requirement: Versión y entorno en cada reporte
El sistema SHALL etiquetar cada reporte con la versión `X.Y.Z` de la app, la plataforma y el entorno (`staging` o
`produccion`).

#### Scenario: Versión de la app
- **WHEN** se envía un reporte desde una app con la versión 1.2.0 de `package.json`
- **THEN** el reporte indica la versión 1.2.0, de modo que coincide con la etiqueta `v1.2.0` de producción

#### Scenario: Entorno separado
- **WHEN** se envía un reporte desde una compilación de staging
- **THEN** el reporte se marca como `staging` y nunca como `produccion`

### Requirement: Servicio opcional
El sistema SHALL funcionar igual, sin errores ni avisos para la persona, cuando el reporte de errores no está disponible.

#### Scenario: Sin configuración
- **WHEN** la app se compila sin la dirección (DSN) del servicio
- **THEN** no se envía ningún reporte y la app funciona completa

#### Scenario: Desarrollo y pruebas
- **WHEN** la app corre en modo desarrollo o durante las pruebas automáticas
- **THEN** no se envía ningún reporte

#### Scenario: Sin conexión
- **WHEN** ocurre un error y el teléfono no tiene conexión
- **THEN** la app sigue funcionando y no muestra ningún aviso relacionado con el reporte

### Requirement: Sin secretos en el repositorio
El sistema MUST NOT guardar en el repositorio la dirección (DSN) del servicio ni el token de subida de mapas de código.

#### Scenario: Configuración por entorno
- **WHEN** se revisa el repositorio
- **THEN** el DSN se lee de una variable de entorno y el token existe solo como secret de la pipeline
