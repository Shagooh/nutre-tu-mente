# Spec Delta

## Purpose

Conservar los registros en el teléfono y en la cuenta correcta, haciendo visibles los fallos y permitiendo reintentos seguros.

## ADDED Requirements

### Requirement: Guardado confirmado y recuperación
El sistema SHALL confirmar guardado solo después de persistirlo y MUST NOT sobrescribir datos tras una lectura fallida.

#### Scenario: Lectura fallida
- **WHEN** falla la lectura inicial o el contenido no se puede interpretar
- **THEN** se conserva el almacenamiento original, se muestra el fallo y se ofrece reintentar sin escribir datos vacíos

#### Scenario: Escritura fallida
- **WHEN** falla el guardado de un check-in
- **THEN** se conserva el formulario, se muestra el fallo y no se anuncia una hoja guardada

### Requirement: Aislamiento entre sesiones
El sistema MUST NOT aplicar una sincronización de una cuenta sobre otra cuenta o sobre un almacenamiento cuyo borrado ya comenzó.

#### Scenario: Respuesta tardía
- **WHEN** llega una respuesta de la cuenta A después de cerrar sesión o cambiar a B
- **THEN** no modifica los datos actuales ni sus marcas de sincronización

#### Scenario: Acceso cruzado
- **WHEN** un cliente autenticado como B intenta leer o escribir datos de A, o no está autenticado
- **THEN** se rechaza el acceso por reglas, incluidas las nuevas colecciones del bosque

### Requirement: Reintentos sin duplicación ni sobrescritura silenciosa
El sistema SHALL mantener la identidad de cada operación pendiente tras reiniciar y MUST NOT aceptar contenido distinto bajo la misma identidad de registro inmutable.

#### Scenario: Respuesta perdida
- **WHEN** una escritura se confirma en la nube pero se pierde su respuesta y se reintenta
- **THEN** existe un solo registro con el contenido original y la misma fecha de modificación lógica

#### Scenario: Conflicto de identidad
- **WHEN** un reintento usa el ID existente con un contenido diferente
- **THEN** el original permanece intacto y se muestra un conflicto recuperable

### Requirement: Borrado recuperable
El sistema SHALL detener sincronizaciones durante el borrado y reanudar una eliminación interrumpida antes de declarar éxito o permitir nuevas subidas.

#### Scenario: Fallo entre lotes
- **WHEN** falla el borrado remoto después de eliminar solo un lote
- **THEN** se informa que no terminó, se conserva el estado pendiente y el reintento elimina lo restante sin recrear registros

#### Scenario: Borrado total completado
- **WHEN** se confirma borrar todos los datos con cuenta vinculada
- **THEN** se borra primero la copia remota y después la local, sin resultados de sync tardíos que la reconstruyan

#### Scenario: Eliminar cuenta y conservar teléfono
- **WHEN** la usuaria elige eliminar la cuenta en el flujo que informa que los datos locales permanecen
- **THEN** se elimina nube e identidad tras reautenticar y se desvincula la copia local sin atribuirla a otra cuenta automáticamente
