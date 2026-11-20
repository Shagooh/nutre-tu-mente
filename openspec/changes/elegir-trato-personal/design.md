# Design

## Context
La app usa AsyncStorage (almacenamiento local en web) bajo nutre-tu-mente:v1; las cookies de autenticación son independientes. App.js ya actualiza parcialmente perfil y marca operaciones pendientes. Ajustes recibe onCambiarPerfil. El flujo habitual de Onboarding no recoge trato; RevisionDiagnostico sí incluye pref-1 con femenino/masculino/neutro, aún aislado de la persistencia de producción. Firestore limita las claves de perfil y actualmente rechazaría trato. contratos-sync implementa fusión de tres versiones por campo.

Hay etiquetas e IDs femeninos en content/checkin.js y cadenas en Hoy, MeCuesta, Onboarding, objetivos y contenido de incorporación. El cambio V1 pendiente ya contempla preferencias generales: este contrato se limita al trato y será la referencia de esa parte.

## Goals / Non-Goals
Goals: elección real, actualización inmediata tras persistencia y compatibilidad de perfiles antiguos, sin cuentas obligatorias.
Non-Goals: inferir identidad, recopilar datos demográficos, migrar historial, activar el diagnóstico completo o publicar en este encargo.

## Decisions
1. Campo opcional perfil.trato: masculino, femenino o neutro, alineado con pref-1. Ausencia significa Sin elegir; el trato efectivo es neutro. No escribir un valor por defecto al cargar perfiles antiguos: evita migraciones destructivas y marcar cambios que el usuario no pidió. Valores locales desconocidos se ignoran en presentación y se retiran de la copia normalizada antes de sincronizar, sin perder otros campos ni atribuir una elección.
2. Selector reutilizable con etiquetas Él, Ella, Neutro, explicación y selección accesible. En el recorrido habitual se sitúa después del consentimiento y antes del nombre/objetivos. Saltar introducción no lo omite; se puede continuar sin elegir. La elección se mantiene en el estado del formulario y se persiste al finalizar.
3. Ajustes muestra el mismo selector, selección guardada y botón Guardar cambios; captura error y espera onCambiarPerfil. El lenguaje se recalcula desde el perfil persistido. Sin confirmaciones de éxito anticipadas ni guardar parcialmente otros campos. Los perfiles antiguos no se redirigen: encuentran el bloque directamente en Perfil.
4. La revisión usa el selector temprano y elimina la segunda pregunta visible pref-1. Un adaptador permite leer pref-1 legado cuando no existe trato canónico y mantiene coherente la respuesta de revisión al editar. Prevalece trato canónico si ambos están presentes. No cambia su almacenamiento efímero ni permite persistir perfiles schemaVersion/diagnóstico hoy rechazados por store y reglas.
5. Resolver textos por claves y variantes explícitas, nunca reemplazando terminaciones automáticamente. Inventario: bienvenida, objetivos, Hoy, CheckIn/CuidadoCheckin, MeCuesta, Progreso/Bosque, frases/lecciones y recordatorios. Conservar IDs como ansiosa, sola y acompanada, así como notas libres y las referencias a las creadoras. Variantes neutras sin género según la decisión del usuario. Añadir matriz de cobertura y estado de revisión editorial; no inventar como definitivas las variantes clínicas faltantes.
6. Reglas Firestore: ampliar exclusivamente la lista de perfil para trato opcional con enum estricto; aceptar documentos antiguos sin campo. Evitar que una actualización elimine una elección existente por omisión. En clientes actuales, normalizar base/local/remoto para que ausencia histórica no sea una eliminación; dos cambios explícitos incompatibles conservan el conflicto existente. Pruebas de reintento, alta de cuenta, carga remota, cierre/cambio de cuenta y borrado. Clientes antiguos que intenten eliminar el campo recibirán error, no pérdida silenciosa.
7. La preferencia no se adjunta a eventos ni reportes. No requiere librerías ni módulos nativos: continúa compatible con Expo Go, Android, iOS y web. Consultar docs correspondientes al SDK instalado antes de implementar APIs.

## Risks / Trade-offs
- Lista cerrada de datos del principio 9 → preparar aclaración acotada de preferencia lingüística para aprobación antes de persistirla; no habilitar otros datos de V1.
- Variantes clínicas sin validar → revisión del equipo clínico como requisito de publicación; mantener las marcas actuales de borrador y no dar textos por aprobados.
- Cambios simultáneos o clientes antiguos → pruebas de tres vías y regla contra eliminación accidental; no elegir por reloj del teléfono.
- Perfiles previos con campo ausente → neutro efectivo, sin atribuir identidad ni forzar elección.
- Cambios V1 en curso → registrar la dependencia del contrato trato-personal al integrar aquel cambio; no duplicar pregunta ni almacenar dos preferencias distintas.

## Migration Plan
1. Aprobar propuesta y aclaración mínima de datos; completar inventario y revisión clínica de variantes.
2. Implementar y verificar con fixtures históricos y sesión autenticada, además de revisión aislada.
3. Para entornos con Firebase, publicar primero reglas compatibles; después cliente. El workflow actual de GitHub solo publica Hosting, por lo que las reglas requieren un paso explícito.
4. Probar staging con recarga, modo sin conexión y sincronización; publicar solo cuando se solicite.
5. Ante rollback mantener reglas compatibles y no eliminar el campo ni cambiar la clave de almacenamiento. El cliente anterior puede ignorar la preferencia; una escritura que la elimine debe fallar, preservando datos.
