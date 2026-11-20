# Proposal

## Why
Amía utiliza expresiones en femenino sin una preferencia efectiva del usuario. Se necesita elegir el trato en la bienvenida y cambiarlo desde Ajustes, también en sesiones previas, conservando todos los datos.

## What Changes
- Selector «¿Cómo prefieres que te hablemos?» con Él, Ella y Neutro, durante la bienvenida y siempre disponible en Perfil/Ajustes, sin exigir cuenta.
- Neutro usa frases sin género, según decisión explícita del usuario; no terminaciones en e. Se mantiene el trato de tú.
- Selección opcional, sin opción preseleccionada: si se omite o el perfil es antiguo, se usa lenguaje neutro y Ajustes indica «Sin elegir · usamos lenguaje neutro».
- Guardar una preferencia mínima y aplicar el cambio al lenguaje de la interfaz, etiquetas y acompañamiento; no modificar IDs ni registros históricos.
- Compatibilidad con perfiles locales y nube; preservar sesión, progreso, árbol y credenciales. No repetir onboarding ni pedir borrar cookies.
- Integrar la preferencia pref-1 que ya existe en el diagnóstico de revisión, evitando un segundo valor independiente.

## Capabilities
### New Capabilities
- `trato-personal`: selección, edición, persistencia y aplicación del trato, con compatibilidad de perfiles previos.
### Modified Capabilities
Ninguna especificación principal. El cambio pendiente actualizar-v1-contenido-y-bosque ya propone preferencias amplias; esta entrega extrae solo el trato para el recorrido vigente. Al integrar aquel cambio deberá reutilizar este contrato y evitar duplicar la pregunta o su fuente de verdad.

## Impact
Onboarding, Ajustes, App/store, contrato de revisión, catálogo editorial, pantallas que consumen etiquetas, sincronización y reglas Firestore. No requiere dependencias nuevas. La preferencia es de lenguaje, no un dato de identidad de género; no se infiere por apodo, cuenta ni respuestas ni se envía a analítica.

Principios afectados: 5–7 (revisión clínica, tú y elección), 9–11 (datos mínimos, borrado y nube opcional), 19 y 21 (móvil y coherencia). La lista cerrada del principio 9 debe aclarar expresamente esta única preferencia antes de habilitar su persistencia; documentar esa ampliación acotada para aprobación. El equipo clínico debe revisar las variantes de acompañamiento antes de su publicación; la aprobación de este plan no sustituye esa revisión.

Fuera de alcance: sexo/género/edad, nuevos diagnósticos, expansión completa de V1, versiones de app, cambio de infraestructura y publicación automática. El presente encargo produce únicamente el plan.
