# Revisión de trato personal · 20 de noviembre de 2026

El usuario aprobó explícitamente implementar el plan y subirlo a Vercel. Esa autorización incluye la preferencia opcional de lenguaje; no autoriza otros datos demográficos. El 20 de noviembre de 2026, tras recibir esta matriz concreta, el usuario confirmó: «Autorizado por el equipo clinico y tecnico 🤟🏻». Se registra esa confirmación para todas las variantes de esta matriz y la aclaración mínima de datos, sin extenderla a otros contenidos o funcionalidades.

## Aclaración mínima de datos (principio 9)

La respuesta a «¿Cómo prefieres que te hablemos?» se conserva como `perfil.trato`, exclusivamente `masculino`, `femenino` o `neutro`. Es una respuesta voluntaria de la bienvenida, editable en Perfil. No representa identidad de género ni se infiere de apodo o cuenta. No se envía a analítica. Se borra junto al perfil. Ausencia es distinta de Neutro explícito.

Esta es la única ampliación propuesta a la enumeración del principio 9. La constitución permanece sin modificar: su cambio formal requiere el acuerdo del equipo clínico y las dos personas de desarrollo en PR propio. El usuario confirmó en este chat la autorización de los equipos clínico y técnico para esta aclaración y la publicación. Se conserva esa evidencia aquí.

V1 debe reutilizar este campo. La revisión aislada adapta `pref-1` sin añadir otra pregunta y mantiene ambos formatos coherentes cuando se edita. Nunca se guarda el diagnóstico V1 en el almacén real.

## Matriz de cobertura

La copia exacta de cada variante está en `src/content/trato.js`. Todas las variantes nuevas de acompañamiento de esta matriz tienen **aprobación clínica y técnica comunicada por el usuario el 20 de noviembre de 2026**. Las frases originales conservan su estado editorial previo; no se declaran aprobadas por este cambio.

| Área / clave original | Él | Ella | Neutro | Estado |
|---|---|---|---|---|
| Tranquila | Tranquilo | Tranquila | En calma | Aprobada |
| Contenta | Contento | Contenta | Con alegría | Aprobada |
| Cansada | Cansado | Cansada | Con cansancio | Aprobada |
| Ansiosa | Ansioso | Ansiosa | Con ansiedad | Aprobada |
| Estresada | Estresado | Estresada | Con estrés | Aprobada |
| Enojada o frustrada | Enojado o frustrado | Enojada o frustrada | Con enojo o frustración | Aprobada |
| Aburrida | Aburrido | Aburrida | Con aburrimiento | Aprobada |
| Sola | Solo | Sola | Con soledad | Aprobada |
| Bienvenida: Listo | Listo | Lista | Todo listo | Interfaz |
| Objetivo: Sentirme acompañada en los momentos difíciles | Sentirme acompañado en los momentos difíciles | Original | Sentir compañía en los momentos difíciles | Aprobada |
| Inicio: Respiramos juntas, sin juicio. | Respiramos juntos, sin juicio. | Original | Respiramos sin juicio. | Aprobada |
| Validación: No estás sola en esto. Aquí estoy contigo. | No estás solo en esto. Aquí estoy contigo. | Original | Aquí estoy contigo para acompañarte en esto. | Aprobada |
| Necesidad comer: Si tienes hambre, come. Antes, miremos juntas qué tipo de hambre es. | … miremos juntos … | Original | Si tienes hambre, come. Antes, miremos qué tipo de hambre es. | Aprobada |
| Ansiedad/comer: Primero respiremos un minuto. Después, si sigue el hambre, la miramos juntas. | … la miramos juntos. | Original | Primero respiremos un minuto. Después, si sigue el hambre, la miramos con calma. | Aprobada |
| Tristeza/hablar: ¿Quién te hace sentir acompañada? Escríbele. Si prefieres, primero escríbelo aquí. | ¿Quién te hace sentir acompañado? Escríbele. Si prefieres, primero escríbelo aquí. | Original | ¿Con quién sientes compañía? Escríbele. Si prefieres, primero escríbelo aquí. | Aprobada |
| Ayuda: Escríbele a alguien de confianza, aunque sea un "hola, ando cansada". | … "hola, ando cansado". | Original | Escríbele a alguien de confianza, aunque sea un "hola, hoy siento cansancio". | Aprobada |
| Ayuda: Lo que sientes importa, y no tienes que pasarlo sola. | Lo que sientes importa, y no tienes que pasarlo solo. | Original | Lo que sientes importa, y puedes buscar compañía para atravesarlo. | Aprobada |
| Diagnóstico: Cuando estoy cansada o estresada | Cuando estoy cansado o estresado | Original | Cuando siento cansancio o estrés | Aprobada |
| Diagnóstico: Sentirme acompañada | Sentirme acompañado | Original | Sentir compañía | Aprobada |
| Diagnóstico: Estar más tranquila | Estar más tranquilo | Original | Sentir más calma | Aprobada |

Progreso y bosque reutilizan las etiquetas anteriores, tanto visuales como accesibles. Frases diarias, lecciones, recordatorios, resto de la bienvenida y textos del calendario ya usan lenguaje sin género dirigido a la persona: permanecen iguales. `Listo` del botón de finalizar una acción se refiere a la acción, no a la persona.

La atribución «una nutricionista y una psicóloga que trabajan juntas» describe a las creadoras y no se modifica. IDs como `ansiosa`, `sola`, `acompanada`, colores de hojas, respuestas guardadas y notas libres permanecen idénticos. No hay sustituciones automáticas de terminaciones.

## Publicación

Autorizada por el usuario, con aprobación de los equipos clínico y técnico comunicada en este chat. Se autoriza publicar la entrega web preparada en el Vercel de la feria. Android/iOS físicos siguen pendientes de verificación; no son el destino de esta publicación.
