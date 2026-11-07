# **App Nutrimind — Contenido para desarrollo**

Oct 26, 2026 · @Nutrimind

## **Cómo leer este documento**

Este documento tiene todo el contenido que hay que cargar en la app, pantalla por pantalla y en orden de uso.

* **Texto entre comillas** \= copy exacto que ve la usuaria.  
* **Variables:** \[Nombre\] \= cómo quiere que la llamen · \[mes\] \= mes actual · \[momento\] \= momento del día que más le cuesta (pregunta 4 del diagnóstico) · \[color\] \= color de la emoción del día.  
* **Género:** los textos están en femenino. La usuaria puede elegir trato masculino o neutro (Preferencias, pregunta 1), así que los textos con género necesitan variante. Los audios 1, 3 y 5 ya tienen versión neutra.  
* **Idioma:** español de Chile, trato de tú.  
* **Alcance:** cada sección indica si es **V1** (primera versión) o **Fase 2**.

| Módulo | Versión |
| :---- | :---- |
| Bienvenida, consentimiento, diagnóstico, preferencias, notificaciones, funciones y árbol | V1 |
| Inicio y check-in diario | V1 |
| Me está costando, ¿Tengo hambre?, Acabo de comer | V1 |
| Respira (1 minuto) y audios | V1 |
| Diario emocional (versión simple) | V1 |
| Árbol del mes, bosque, Mi semana y Mis logros | V1 |
| Aprende: cápsulas 1 a 4 | V1 |
| Frase diaria | V1 |
| Derivación, crisis y datos | V1 |
| Aprende: cápsulas 5 a 14 | Fase 2 |
| Widget en pantalla de bloqueo, premios y fondos | Fase 2 |
| Mi organización, recetas, tracker de hábitos | Fase 2 |

Nunca se pide ni se muestra: peso, talla, IMC, calorías, porciones, pasos ni fotos del cuerpo. No hay rachas ni marcas en rojo.

## **1\. Navegación general (V1)**

**Primera vez (onboarding, una sola vez):**

1. Bienvenida (4 pantallas)  
2. Consentimiento  
3. Diagnóstico (12 preguntas) → si hay señales de riesgo en la pregunta 12: pantalla de derivación  
4. Nombre ("¿Cómo quieres que te llamemos?") y resultado del diagnóstico  
5. Preferencias (7 preguntas)  
6. Notificaciones  
7. Funciones  
8. Elegir árbol  
9. Inicio

**Desde ahí, todos los días:** la app abre en Inicio.

**Barra inferior:** Inicio · Herramientas · Aprende · Mi organización (Fase 2\) · Perfil.

* **Herramientas:** Me está costando · ¿Tengo hambre? · Acabo de comer y me siento mal · Respira · Diario.  
* **Perfil:** editar todas las respuestas de Preferencias, Notificaciones y Funciones · Mi bosque · Mi semana · Mis logros · borrar mis datos · link para agendar con Nutrimind.

## **2\. Bienvenida y consentimiento (V1)**

Son 4 pantallas con botón "Siguiente" y opción "Saltar".

1. **Pantalla 1**  
   * "Respira. Estás en el lugar correcto."  
   * "Si llegaste hasta aquí, probablemente ya lo intentaste todo. El problema nunca fuiste tú: te faltó compañía."  
2. **Pantalla 2**  
   * "Esto no es una dieta, ni un plan de comidas, ni una app para contar calorías."  
   * "Es un espacio para acompañarte en los momentos en que más lo necesitas y ayudarte a volver a ti."  
3. **Pantalla 3**  
   * "Creada por Nutrimind: una nutricionista y una psicóloga que trabajan juntas desde 2021 con el Método Cambio²."  
   * "Basada en mindful eating, alimentación intuitiva y regulación emocional."  
4. **Pantalla 4** — 4 íconos, cada uno con su frase:  
   * ¿Cómo estás hoy? → "Un check-in de 1 minuto."  
   * Me está costando → "Un botón para cuando sientas que te desbordas."  
   * Tu bosque → "Cada mes crece un árbol nuevo, con una hoja por día del color de cómo te sentiste."  
   * Aprende → "Cápsulas cortas para entender lo que te pasa."

**Pantalla de consentimiento** (obligatoria, no se puede saltar)

* Checkbox de aceptación de términos y del uso de datos.  
* Aviso: "Esta app acompaña, no reemplaza la atención profesional."  
* Botón: "Acepto y continúo".

**Pantalla de transición:** "Ahora te haremos unas preguntas para conocerte. Toma 3 minutos y puedes cambiar todo después."

## **3\. Diagnóstico (V1)**

Una pregunta por pantalla, con barra de avance. Las preguntas 1 a 11 se pueden saltar; la 12 es obligatoria.

| \# | Pregunta | Tipo | Opciones |
| :---- | :---- | :---- | :---- |
| 1 | ¿Cuánto espacio ocupa la comida en tu cabeza durante el día? | Única | Casi nada · Un poco · Bastante · Casi todo el día |
| 2 | ¿Te identificas con alguna de estas frases? | Varias | "Empiezo súper bien y no lo mantengo" · "Si empiezo, no puedo parar" · "No tengo fuerza de voluntad" · "Me gusta demasiado la comida" · "Como sin darme cuenta, picoteo en automático" · "Después de comer me siento culpable" · Ninguna |
| 3 | ¿Has hecho algo de esto? | Varias | Dietas (sin pan, bajas en carbohidratos, etc.) · Plan con nutricionista · Apps de calorías o pasos · Retos de redes sociales o influencers · Programas de ejercicio · Cirugía bariátrica · Terapia · Nada aún |
| 4 | ¿En qué momento sientes más incomodidad con la comida? | Varias | Mañana · Tarde · Noche · Fines de semana · Eventos, cumpleaños, vacaciones · Cuando estoy cansada o estresada |
| 5 | Cuando te desbordas con la comida, ¿qué suele estar pasando? | Varias | Ansiedad · Estrés · Aburrimiento · Cansancio · Tristeza · Soledad · Me di permiso de comer algo "prohibido" · No sé |
| — | *Pantalla de validación* | — | "Gracias por contarnos. Nada de esto es un fracaso tuyo: es un ciclo que se puede entender y cambiar." |
| 6 | ¿Qué tan conectada te sientes con tu hambre y tu saciedad? | Única | Las reconozco bien · A veces · Casi nunca sé si tengo hambre física |
| 7 | Cuando te equivocas o "fallas", ¿cómo te hablas? | Única | Con cariño · Neutral · Me exijo mucho · Me trato mal |
| 8 | ¿Cuánto tiempo tienes para ti en el día? | Única | Casi nada · Un rato corto · Lo suficiente |
| — | *Pantalla de validación* | — | "Te haces cargo de mucho. Aquí la idea es que tú también estés en tu lista." |
| 9 | ¿Qué te gustaría sentir? | Hasta 3 | Paz mental con la comida · Comer sin culpa · Sentirme acompañada · Confiar en mí · Disfrutar comidas y momentos sociales · Priorizarme · Entender mis emociones · Estar más tranquila |
| 10 | ¿Qué tipo de acompañamiento buscas hoy? | Única | Tomar conciencia de mi relación con la comida y mi conducta alimentaria · Cambiar hábitos de alimentación y salud desde el autoconocimiento · Cuidar solo mi salud mental |
| 11 | ¿Qué te ha hecho dejar otras cosas? | Varias | No vi resultados rápido · Me abrumé · Algo me sacó de la rutina y no supe volver · Me sentí juzgada · Me olvidé · Nada, mantengo hábitos que quiero |
| 12 | En los últimos 3 meses, ¿te ha pasado alguna de estas cosas? | Varias, obligatoria | Vomitar o usar laxantes para compensar lo que comí · Pasar muchas horas o días sin comer a propósito · Sentir que la comida o mi peso controlan toda mi vida · Tener un diagnóstico de trastorno de la conducta alimentaria (TCA) · Ninguna |

**Lógica**

* **Perfil** (pregunta 10): opción 1 → Conciencia · opción 2 → Hábitos · opción 3 → Bienestar. Si la salta: Conciencia.  
* **Derivación** (pregunta 12): cualquier opción distinta de "Ninguna" → pantalla de derivación (sección 14).  
* **\[momento\]** (pregunta 4): se usa en el mensaje de resultado y para activar la notificación de tarde si marcó "Tarde".  
* **Pregunta 11:** uso interno; ajusta la frecuencia de notificaciones y los mensajes de "volver sin culpa".  
* **Pregunta 1:** se guarda como línea base del indicador mensual de espacio mental (sección 12).

**Pantalla de nombre** (justo antes del resultado): "¿Cómo quieres que te llamemos?" (campo de texto). Subtítulo: "Tu nombre aparecerá en tus mensajes y frases." Guarda \[Nombre\], que se usa desde el mensaje de resultado. Editable en Perfil.

**Pantalla de resultado**

| Perfil | Mensaje |
| :---- | :---- |
| Conciencia | "\[Nombre\], lo que nos cuentas tiene mucho sentido. Vives con harto ruido mental y \[momento\] te cuesta más. Vamos a empezar por ahí: entender tu ciclo, sin juicio y a tu ritmo." |
| Hábitos | "\[Nombre\], ya sabes mucho sobre alimentación; lo difícil es sostenerlo. Vamos a construir hábitos pequeños, desde lo que sientes y sin todo o nada." |
| Bienestar | "\[Nombre\], te haces cargo de mucho. Aquí vamos a cuidar primero tu cabeza: pausas, calma y espacio para ti." |

Debajo: "Esto es lo que preparamos para ti", con las 3 funciones principales del perfil (sección 6\) y botón "Empezar".

## **4\. Preferencias (V1)**

Todas se pueden editar después en Perfil.

| \# | Pregunta | Tipo | Opciones / comportamiento |
| :---- | :---- | :---- | :---- |
| 1 | ¿Cómo prefieres que te hablemos? | Única | En femenino ("estás cansada") · En masculino ("estás cansado") · Neutro ("te sientes con cansancio"). Define la variante de género de los textos y audios. |
| 2 | ¿Qué rango de edad tienes? | Única | Menos de 18 · 18–24 · 25–34 · 35–44 · 45–54 · 55+. Si marca menos de 18, la app no continúa y muestra un mensaje amable sugiriendo hablar con un adulto o un profesional. |
| 3 | ¿Cuál es tu situación hoy? | Varias, opcional | Trabajo · Estudio · Soy mamá / cuido a otros · Trabajo y cuido a otros · Otro |
| 4 | ¿Qué estilo de frases te acompaña más? | 1 o 2 | Autocuidado ("Hoy es un buen día para priorizarte…") · Afirmaciones ("Mi cuerpo no define mi valor.") · Motivacional ("Algunos días avanzo, otros hago una pausa. Sigo en el camino.") · Calma ("Esta incomodidad es temporal. Respira.") |
| 5 | ¿Cómo prefieres recibir el contenido? | Varias | Textos cortos · Audios · Ejercicios guiados paso a paso · Videos cortos |
| 6 | ¿Cuánto tiempo al día te gustaría dedicarte aquí? | Única | 1 minuto · 3 minutos · 5–10 minutos. Después de elegir: "Con poco basta. Lo importante es volver, no hacerlo perfecto." |
| 7 | ¿Cómo nos conociste? | Única, opcional | Instagram · TikTok · Facebook · Amiga o familia · Nutrimind (consulta o taller) · Búsqueda en internet · Otro |

El nombre ya se pidió antes del resultado del diagnóstico (sección 3).

## **5\. Notificaciones (V1)**

Pantalla de entrada: "¿Quieres que te acompañemos durante el día? Tú decides cuándo y cuánto."

| Tipo | Horario por defecto | Qué configura la usuaria | Variación 1 | Variación 2 | Variación 3 |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Check-in diario | 1 vez, 9:00 | On/off y hora | "Hola \[Nombre\], ¿cómo estás hoy?" | "¿Cómo amaneciste? Un minuto para mirarte." | "¿Qué necesitas hoy? Cuéntame." |
| Frase del día | 1 vez, 8:00 | Cantidad (1 a 5\) y rango de horas (ej. 8:00–21:00) | Frase del banco, según su estilo (sección 13\) | — | — |
| Pausa / respira | 2 veces: 12:00 y 16:00 | Cantidad y horas | "Haz una pausa. Tres respiraciones y vuelves." | "Suelta los hombros. ¿Cómo estás?" | "¿Tomaste agua?" |
| Tarde | 17:30, solo si marcó "Tarde" en la pregunta 4 | On/off y hora | "Las tardes a veces pesan. Si lo necesitas, estoy aquí." | "Terminó la jornada. ¿Cómo viene tu cuerpo?" | "Si la tarde se pone cuesta arriba, toca 'Me está costando'." |
| Cierre del día | 21:00 | On/off y hora | "¿Qué hiciste hoy por ti, aunque sea pequeño?" | "Antes de dormir: ¿cómo estuvo tu día?" | "Hoy también contó. Descansa." |
| Volver sin culpa | Tras 3 días sin abrir la app | On/off | "Me alegra que vuelvas. ¿Cómo te va hoy?" | "Aquí sigue tu árbol, sin apuro." | "Cuando quieras, aquí estoy." |
| Mi semana | Domingo, 18:00 | On/off | "¿Cómo estuvo tu semana? 1 minuto para mirarla." | — | — |
| Organización (Fase 2\) | Los que ella cree | Libre | "Hoy tienes un rato reservado para ti." (tiempo para mí) | — | — |

**Reglas**

* Las variaciones rotan.  
* Si el total diario supera 6, mostrar: "Menos también está bien. ¿Seguro que quieres tantas?" (sin bloquear).  
* Modo "No molestar" configurable (por defecto 22:00–7:30).  
* Las notificaciones abren la pantalla correspondiente: check-in → check-in, pausa → Respira, tarde → Me está costando, cierre → diario.  
* Nunca usar urgencia ni rachas ("¡no rompas tu racha\!").

## **6\. Funciones y elegir árbol (V1)**

**Pantalla de funciones.** Título: "¿Qué te gustaría usar? Puedes activar o apagar cualquiera cuando quieras." Switches pre-marcados según el perfil (✓ \= activado por defecto). Las 3 primeras con ✓ de cada perfil son las que se muestran en la pantalla de resultado del diagnóstico.

| Función | Descripción | Conciencia | Hábitos | Bienestar |
| :---- | :---- | :---- | :---- | :---- |
| Check-in diario | "¿Cómo estoy? ¿Qué necesito? ¿Cómo me cuido ahora?" | ✓ | ✓ | ✓ |
| Frases diarias | "Frases del estilo que elegiste" | ✓ | ✓ | ✓ |
| Me está costando | "Ayuda guiada cuando sientes que te desbordas" | ✓ | ✓ | ✓ |
| Pausas para respirar | "Recordatorios y ejercicios de 1–3 minutos" | ✓ |  | ✓ |
| ¿Tengo hambre? | "Te ayuda a distinguir hambre física de emocional" | ✓ | ✓ |  |
| Diario emocional | "Escribe lo que sientes y suéltalo" | ✓ |  | ✓ |
| Aprende | "Cápsulas cortas sobre lo que te pasa" | ✓ | ✓ | ✓ |
| Tracker de hábitos (Fase 2\) | "Pequeños hábitos de autocuidado, sin castigo" |  | ✓ |  |
| Mi organización (Fase 2\) | "Comidas, compras, tiempo para mí y pendientes" |  | ✓ |  |
| Recetas (Fase 2\) | "Ideas simples, nutritivas y ricas." |  | ✓ |  |

**Elegir árbol**

1. Texto: "Cada mes vas a cultivar un árbol. Cada día que me cuentes cómo estás, le crece una hoja del color de tu emoción. Mes a mes, tus árboles forman tu bosque: tu vida."  
2. Opciones: Araucaria · Quillay · Cerezo · Sauce · Olivo · Jacarandá (lista provisoria).  
3. Campo opcional: "¿Quieres ponerle nombre?"  
4. Mensaje final: "Listo, \[Nombre\]. Tu árbol de \[mes\] es un brote. No necesitas venir todos los días: cada hoja cuenta." → Inicio.

## **7\. Pantalla de inicio (V1)**

Elementos, de arriba hacia abajo:

1. **Saludo según la hora:** "Buenos días / Buenas tardes / Buenas noches, \[Nombre\]. Respira, estás en el lugar correcto."  
2. **Frase del día**, según su estilo. Al deslizar, muestra otra.  
3. **Árbol del mes** con las hojas que lleva. Al tocarlo abre Mi bosque (sección 12).  
4. **Botón principal "¿Cómo estás hoy?"** → check-in. Solo aparece si aún no hizo el check-in del día.  
5. **Botón fijo y destacado "Me está costando"**, siempre visible.  
6. **Sugerencia del día:** una por día, sin repetir en la semana:  
   * "Hoy es un buen día para priorizarte. Regálate 5 minutos para caminar sin celular."  
   * "Hoy te invito a comer al menos una comida sentada y sin pantalla."  
   * "Hoy, cuando te digas 'debería', cámbialo por 'me gustaría'."  
   * "Hoy toma un vaso de agua cada vez que te levantes."  
   * "Hoy escríbele a alguien que te haga bien."  
   * "Hoy elige ropa en la que te sientas cómoda, no la que 'deberías' usar."  
   * "Hoy busca 10 minutos de sol o aire libre."  
   * "Hoy di que no a algo que no te corresponde."  
   * "Hoy anota un logro en Mis logros, aunque sea pequeño."  
   * "Hoy date permiso de descansar sin culpa."

**Al volver después de 3 días o más sin abrir la app:** antes del inicio, mostrar "Me alegra que hayas vuelto, \[Nombre\]. ¿Cómo te va hoy?" con botón al check-in. No mencionar cuántos días pasaron.

## **8\. Check-in diario (V1)**

**Paso 1 — "¿Cómo estoy?"** Una emoción (con ícono) \+ intensidad (poco · medio · mucho). La emoción define el color de la hoja del día.

| Emoción | Color de la hoja | Frase de validación |
| :---- | :---- | :---- |
| Tranquila | Verde | "Qué rico sentir calma. Este momento también es tuyo." |
| Contenta | Amarillo | "Me alegra que hoy te sientas así. Date un segundo para notarlo." |
| Cansada | Lila | "Has dado mucho. El cansancio también es una señal de tu cuerpo." |
| Ansiosa | Naranjo | "La ansiedad se siente fuerte, pero pasa. No tienes que resolver todo ahora." |
| Estresada | Morado | "Llevas mucho encima. Tiene sentido que te sientas así." |
| Triste | Celeste | "Está bien estar triste. Aquí no tienes que esconderlo." |
| Enojada o frustrada | Rojo | "Tu enojo te está diciendo algo importante. Escuchémoslo sin juzgarlo." |
| Aburrida | Beige | "El aburrimiento también pide algo. Veamos qué." |
| Sola | Azul | "No estás sola en esto. Aquí estoy contigo." |
| No sé | Blanco perla | "No saber también está bien. A veces una pausa ayuda a entender." |

*Los colores son provisorios.*

**Paso 2 — "¿Qué necesito?"** Una opción.

**Paso 3 — "¿Cómo me puedo cuidar ahora?"** Respuesta \= frase de validación (tabla de arriba) \+ acción (tabla de abajo), salvo que la combinación tenga respuesta especial.

| Necesita | Acción | Botón abre |
| :---- | :---- | :---- |
| Descansar | "¿Puedes regalarte 10 minutos sin pantallas? Te acompaño con un audio de relajación." | Audio 4 |
| Hablar con alguien | "¿Hay alguien a quien puedas escribirle hoy? Un mensaje corto basta. Mientras, aquí estoy." | Diario (opcional) |
| Moverme | "¿Qué tal 5 minutos de estiramiento o una vuelta a la cuadra? Moverte por gusto, no por obligación." | Guía de estiramientos |
| Comer | "Si tienes hambre, come. Antes, miremos juntas qué tipo de hambre es." | ¿Tengo hambre? |
| Un momento para mí | "Elige algo pequeño solo para ti: un té, una canción, 5 minutos al sol." | Lista "Ideas para mí" |
| Poner un límite | "¿A qué o a quién necesitas decirle que no hoy? Te ayudo a escribirlo: 'Hoy no puedo \_\_\_, pero sí puedo \_\_\_.'" | Plantilla de límite (campo de texto) |
| No sé | "Partamos por respirar un minuto y después vemos." | Respira 1 min |

**Respuestas especiales** (reemplazan la acción)

| Emoción \+ necesidad | Respuesta | Botón abre |
| :---- | :---- | :---- |
| Ansiosa o estresada \+ comer | "Primero respiremos un minuto. Después, si sigue el hambre, la miramos juntas." | Respira 1 min → ¿Tengo hambre? |
| Cansada \+ comer | "A veces el cansancio se disfraza de hambre. ¿Comiste hace poco?" | ¿Tengo hambre? |
| Aburrida \+ comer | "¿Es hambre o ganas de que pase algo? Probemos con la escala de hambre." | ¿Tengo hambre? |
| Triste \+ hablar con alguien | "¿Quién te hace sentir acompañada? Escríbele. Si prefieres, primero escríbelo aquí." | Diario |
| Enojada \+ moverme | "Saquemos ese enojo del cuerpo: camina rápido 5 minutos o sacude brazos y piernas." | — |
| Enojada \+ poner un límite | "Tu enojo te mostró un límite. Escríbelo: 'Me di cuenta de que \_\_\_. Necesito \_\_\_.'" | Plantilla de límite |
| Sola \+ un momento para mí | "Te dejo un audio corto para que te acompañe mientras te regalas este rato." | Audio 5 |
| Tranquila o contenta \+ cualquiera | Acción normal \+ "¿Qué te ayudó a estar así hoy? Si quieres, anótalo en Mis logros." | Mis logros |

**Regla de intensidad:** si la intensidad es "mucho" y la emoción es ansiosa, estresada, triste, enojada o sola, agregar el botón "Me está costando" con el texto "Si lo necesitas, te acompaño un poco más."

**Al terminar:** "Gracias por mirarte hoy. Tu árbol tiene una hoja nueva." \+ animación de la hoja.

**"¿Qué quieres trabajar hoy?"** (opcional, después del check-in): 3 temas del perfil, priorizando el \[momento\] y las emociones más marcadas. Cada tema abre una cápsula de Aprende. Botón "Ahora no".

| Perfil | Temas (rotan 3 por día) |
| :---- | :---- |
| Conciencia | Las tardes · La culpa · Escuchar mi hambre · Mi ciclo con la comida · Comer con presencia |
| Hábitos | Volver después de un evento · Un hábito pequeño · Comer sin pantalla · Organizar mi semana sin presión · Moverme por gusto |
| Bienestar | Bajar el estrés · Poner límites · Tiempo para mí · Descansar mejor · Hablarme mejor |

**Listas de apoyo**

* **Ideas para mí** (ella puede agregar las suyas): tomar un té sin apuro · escuchar una canción que me guste · 5 minutos al sol · leer unas páginas · una ducha tranquila · cremas o skincare con calma · llamar a alguien querido · dibujar o pintar · bailar una canción · no hacer nada por 10 minutos.  
* **Guía de estiramientos** (3 pantallas de 1 minuto con temporizador): cuello (inclinar la cabeza hacia cada hombro) · espalda (sentada, redondear y estirar la espalda al ritmo de la respiración) · piernas (de pie, apoyada en una pared, estirar las pantorrillas).

## **9\. Me está costando (V1)**

Flujo de máximo 3 minutos. Se abre desde el botón fijo de Inicio, Herramientas, la notificación de tarde y la regla de intensidad del check-in.

1. **Pantalla 1:** "Estoy aquí contigo. No tienes que resolver nada ahora." \+ "¿Qué tan en calma te sientes?" (escala 1 a 5). Guardar como *calma\_antes*.  
2. **Respiración de 1 minuto:** círculo que se expande al inhalar (4 s) y se achica al exhalar (6 s), 6 ciclos, con vibración suave. Audio 1 opcional.  
3. **"¿Qué estás sintiendo?"** (una): Ansiedad · Estrés · Aburrimiento · Cansancio · Tristeza · No sé.  
4. **"¿Qué te pide el cuerpo ahora?"** (una): Comer · Algo dulce o salado específico · Descansar · Salir de aquí · Estirarme · Activarme · No sé.  
5. **Tres opciones:**  
   * **Pausa de 5 minutos** → temporizador; al terminar vuelve al paso 3\.  
   * **Hacer otra cosa que me cuide** → muestra la respuesta de lo que pide el cuerpo \+ los 3 tips de la emoción (tablas de abajo); ella elige uno.  
   * **Comer, con presencia** → "Si eliges comer, está bien. Siéntate, sírvelo en un plato y disfrútalo. ¿Cómo te quieres tratar ahora?" \+ botón al audio 6\.  
6. **Cierre:** "Elegiste mirarte en vez de ir en automático. Eso ya es un cambio." \+ "¿Qué tan en calma te sientes ahora?" (1 a 5). Guardar como *calma\_después*.

**Tips según la emoción**

| Emoción | Tip 1 | Tip 2 | Tip 3 |
| :---- | :---- | :---- | :---- |
| Ansiedad | Técnica 5-4-3-2-1: nombra 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles y 1 que saboreas | Agua fría en las muñecas y la cara, y respira lento | Audio 2 "Calma en 3 minutos" |
| Estrés | Escribe en 1 minuto todo lo que tienes en la cabeza y elige solo 1 cosa para hoy (campo de texto) | Sal de la cocina y camina 5 minutos | Ducha tibia o lavarte la cara con calma |
| Aburrimiento | Elige algo de tu lista "Cosas que me gustan" | Cambia de espacio: sal al balcón o a la calle | Haz algo con las manos: ordenar un cajón, regar plantas, dibujar |
| Cansancio | Acuéstate 10 minutos con los ojos cerrados (audio 4\) | Prepárate un té o una bebida caliente y tómatela sentada | "¿Qué puedo dejar para mañana?" y suéltalo |
| Tristeza | Escríbele a alguien que te quiera | Escribe lo que sientes en el diario, sin corregir | Abrígate con una manta y pon una canción que te acompañe |
| No sé | Escaneo corporal (audio 3\) | Toma un vaso de agua lento y vuelve a preguntarte | Pausa de 5 minutos y vuelve a abrir "Me está costando" |

**Respuesta según lo que pide el cuerpo**

| Pide | Texto | Botón abre |
| :---- | :---- | :---- |
| Comer | "Revisemos qué hambre es." | ¿Tengo hambre? |
| Algo dulce o salado específico | "Ese antojo es válido. Si lo eliges, sírvelo en un plato, siéntate y disfrútalo sin apuro. Si no, ¿qué otra cosa te daría ese mismo alivio?" | — |
| Descansar | "Tu cuerpo pide pausa, no comida. ¿Te puedes recostar 10 minutos?" | Audio 4 |
| Salir de aquí | "Cambia de espacio: sal de la cocina, abre una ventana o camina a la cuadra." | — |
| Estirarme | "Te guío en 3 estiramientos de 1 minuto." | Guía de estiramientos |
| Activarme | "Pon una canción que te guste y muévete como quieras, o camina rápido 5 minutos." | — |
| No sé | "Está bien. Partamos por un vaso de agua y una respiración más." | Respira 1 min |

**Lista "Cosas que me gustan":** la primera vez que elige aburrimiento, se le pide escribir 5 ideas propias. Se guarda y se muestra cada vez. Editable en Perfil.

**Botón de crisis:** visible en este flujo (ver sección 14).

## **10\. Acabo de comer y ¿Tengo hambre? (V1)**

### **Acabo de comer y me siento mal**

1. **Pantalla 1:** "Respira. Comer no es un error y no tienes que arreglar nada."  
2. **"¿Qué te estás diciendo ahora?"** Campo de texto libre o elegir una frase: "Soy un desastre" · "Mañana empiezo de nuevo" · "No tengo voluntad" · "Arruiné todo" · "Tengo que compensar" · "Comí algo que no debía" · "Nunca voy a poder".  
3. **Reformular:** "¿Le dirías eso a una amiga? ¿Qué le dirías tú?" Campo de texto, con la frase amable sugerida ya escrita (editable):

| Si eligió | Frase amable sugerida |
| :---- | :---- |
| "Soy un desastre" | "Tuve un momento difícil. Eso no me define." |
| "Mañana empiezo de nuevo" | "No tengo que empezar de cero. Sigo desde aquí, con la próxima comida." |
| "No tengo voluntad" | "Estaba cansada o desbordada y busqué calmarme con lo que tenía a mano." |
| "Arruiné todo" | "Una comida no borra todo lo que he avanzado." |
| "Tengo que compensar" | "Mi cuerpo no necesita castigo. Necesita que lo cuide." |
| "Comí algo que no debía" | "Ningún alimento está prohibido. Puedo mirar qué necesitaba." |
| "Nunca voy a poder" | "Estoy aprendiendo algo nuevo, y aprender toma tiempo." |
| Texto libre | Sin sugerencia; campo vacío. |

4. **"¿Qué pasó antes?"** (varias): Llevaba mucho rato sin comer · Estaba cansada · Estresada · Aburrida · Triste · Un evento o salida · Tenía muchas ganas de ese alimento · No sé. Según lo marcado, sugerir una cápsula: sin comer → 5 · cansada, estresada, aburrida o triste → 9 · evento → 14 · ganas de ese alimento → 8 · no sé → 5\.  
5. **"¿Cómo te quieres tratar ahora?"** (una): Con calma · Darme un descanso · Tomar agua y seguir mi día · Hablar con alguien · Escribirlo en el diario.  
6. **Cierre:** "La próxima comida es una comida normal. No hay que saltarse nada ni empezar el lunes." \+ botón al audio 7\.  
* Se guarda en el historial emocional, nunca como registro de comida.  
* **Si se repite:** 3 usos o más en 7 días → mostrar "Te ha tocado una semana difícil. ¿Te gustaría conversarlo con una profesional?" \+ botón para agendar con Nutrimind.

### **¿Tengo hambre?**

1. **Escala de hambre** (deslizador del 1 al 10 con dibujos):

| Número | Texto |
| :---- | :---- |
| 1 | Mareada o débil, con muchísima hambre |
| 2 | Muy hambrienta, irritable |
| 3 | Hambre clara, el estómago suena |
| 4 | Empieza el hambre, ganas suaves de comer |
| 5 | Neutra: ni hambre ni llena |
| 6 | Satisfecha, cómoda |
| 7 | Llena, ya no necesito más |
| 8 | Muy llena, algo incómoda |
| 9 | Pesada e incómoda |
| 10 | Demasiado llena, me duele |

2. **Tres preguntas:** "¿Apareció de a poco o de golpe?" (De a poco · De golpe) · "¿Te sirve cualquier comida o solo una en específico?" (Cualquiera · Una en específico) · "¿Cuándo comiste por última vez?" (Hace menos de 3 horas · Hace más de 3 horas).  
3. **Resultado** (se evalúa en este orden):

| Condición | Texto | Botón |
| :---- | :---- | :---- |
| Escala 1 a 4 | "Es hambre física. Mereces comer: elige algo que te nutra y te guste." | Audio 6 (opcional) |
| Escala 5 a 10 \+ "de golpe" o "una en específico" | "Parece hambre emocional. ¿Qué necesitas de verdad?" | Me está costando |
| Escala 5 o 6 \+ más de 3 horas | "Puede ser un hambre suave. Toma agua, espera 10 minutos y vuelve a preguntarte." | Recordar en 10 min |
| Cualquier otro caso | "No hay respuesta incorrecta. Escucha qué te pide el cuerpo y elige con calma." | — |

4. **Siempre al final:** "Si eliges comer, está bien. Hazlo sentada y con presencia."

**Mini guía** (botón "?" en la pantalla): "El hambre física aparece de a poco, se siente en el cuerpo, te sirve cualquier comida y se va al comer. El hambre emocional aparece de golpe, se siente en la cabeza, pide algo específico y a veces sigue después de comer."

## **11\. Respira, audios y diario (V1)**

### **Respira**

| Ejercicio | Contenido en pantalla |
| :---- | :---- |
| Pausa de 3 respiraciones (desde la notificación) | 3 pantallas: "Respira y siente tus pies en el suelo." → "Respira y suelta los hombros." → "Respira y pregúntate: ¿qué necesito ahora?" |
| Respiración de 1 minuto | Círculo: inhalar 4 s (se expande, texto "Inhala") y exhalar 6 s (se achica, texto "Exhala", vibración), 6 ciclos. Cierre: "Exhalar más largo le dice a tu cuerpo que está a salvo." |
| Respiración de 3 minutos | Igual, 18 ciclos. Texto al inicio: "Pon una mano en el pecho y otra en el abdomen." A la mitad: "Si tu mente se va, está bien. Vuelve a tu respiración." |
| Respiración de 5 minutos | 2 minutos de respiración \+ 2 minutos de escaneo en texto (pies, piernas, abdomen, pecho, hombros, mandíbula, frente: "Nota cómo está, sin cambiar nada") \+ cierre: "¿Cómo estás ahora, comparado con hace 5 minutos?" |
| Escaneo corporal | Audio 3 |

En V1 va la respiración de 1 minuto y la pausa de 3 respiraciones; las de 3 y 5 minutos pueden ir en V1 o Fase 2, según tiempo de desarrollo.

### **Audios**

Los graba el equipo Nutrimind y se entregan como archivos. Los guiones están en el documento de contenido.

| \# | Nombre | Duración | Dónde se usa | Versión neutra |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Respira conmigo | 1 min | Respiración de 1 minuto, Me está costando | Sí |
| 2 | Calma en 3 minutos | 3 min | Tip de ansiedad, Respira | No necesita |
| 3 | Escaneo corporal | 5 min | Respira, tip de "No sé" | Sí |
| 4 | Descansar de verdad | 8 min | Check-in "Descansar", tips de cansancio | No necesita |
| 5 | Aquí estoy contigo | 3 min | Check-in "Sola \+ un momento para mí" | Sí |
| 6 | Antes de comer | 2 min | "Comer, con presencia", ¿Tengo hambre? | No necesita |
| 7 | Después de comer, sin culpa | 2 min | Acabo de comer y me siento mal | No necesita |

* Si la usuaria eligió trato masculino o neutro, se reproduce la versión neutra de los audios 1, 3 y 5\.  
* El reproductor necesita: play/pausa, barra de avance, funcionar con la pantalla bloqueada y botón "Terminar" que vuelve a la pantalla anterior.

### **Diario emocional (versión simple)**

* Cada entrada tiene 4 campos opcionales: "¿Cómo me siento?" · "3 cosas que logré hoy, grandes o pequeñas" · "¿Algo me agobia? Escríbelo y déjalo ir" · "¿Por qué me siento agradecida?"  
* Vista en calendario: cada día con el color de la emoción del check-in.  
* Lo escrito en "3 cosas que logré hoy" también aparece en Mis logros.

## **12\. Árbol del mes, bosque, Mi semana y Mis logros (V1)**

### **Árbol del mes**

* Cada mes calendario hay un árbol nuevo. El 1 de cada mes, el árbol anterior pasa al bosque y aparece un brote nuevo.  
* **Cada check-in suma una hoja** del color de la emoción (tabla de la sección 8). Máximo una hoja por día.  
* **Más de un check-in en el día:** la hoja toma la emoción de mayor intensidad (provisorio).  
* **Día sin check-in:** no hay hoja. Nada se seca, se cae ni se marca como faltante.  
* **Etapas según cantidad de hojas:** brote (1 a 7\) → árbol joven (8 a 15\) → árbol con copa (16 a 23\) → árbol frondoso (24 o más).  
* **Tocar una hoja:** muestra la fecha, la emoción, la intensidad, lo que necesitó y la nota del diario si escribió.  
* **Leyenda de colores** siempre visible. Cada hoja lleva un ícono pequeño de la emoción (accesibilidad para daltonismo).  
* Al comenzar un mes nuevo, la usuaria puede elegir otra especie de árbol (provisorio).

### **Mi bosque**

* Vista con todos los árboles de meses anteriores. Ningún árbol se borra (salvo que borre sus datos).  
* **Tocar un árbol:** resumen del mes con las 3 emociones más frecuentes. Texto modelo: "En \[mes\] hubo varios días \[color\]. ¿Quieres mirar qué estaba pasando?" → abre el calendario del diario de ese mes.

### **Mi semana**

* **Domingo (notificación opcional):** 5 preguntas con escala de 1 a 5 con caritas: "¿Cómo estuvo tu ánimo esta semana?" · "¿Cómo descansaste?" · "¿Qué tan clara sentiste tu mente?" · "¿Cómo estuvo tu digestión?" · "¿Cómo estuvo tu energía?"  
* **Pantalla Mi semana:** cuántas veces se cuidó (check-ins \+ pausas \+ usos de Me está costando \+ cápsulas), emociones más frecuentes y los 5 indicadores como línea suave comparada con semanas anteriores.  
* Nunca usar rojo ni textos como "empeoraste". Si un indicador baja: "Fue una semana más pesada. ¿Qué te ayudaría la próxima?"  
* **Una vez al mes:** "¿Cuánto espacio ocupa hoy la comida en tu cabeza?" (1 a 5). Se compara con la pregunta 1 del diagnóstico.

### **Mis logros**

* Lista donde ella anota avances, grandes o pequeños, con fecha.  
* Se alimenta también desde el diario ("3 cosas que logré hoy") y desde el check-in (tranquila o contenta).

### **Métricas internas (no visibles para la usuaria)**

* *calma\_antes* y *calma\_después* de cada uso de Me está costando.  
* Espacio mental mensual (1 a 5).  
* Días de uso por semana (retención: meta de 3 días o más por semana después de 30 días).  
* Todo agregado y anónimo para el equipo Nutrimind.

## **13\. Aprende y banco de frases**

### **Aprende**

* Cada cápsula dura 2 a 3 minutos, en texto corto o audio (según la pregunta 5 de Preferencias), y termina con un bloque "Pruébalo hoy".  
* Dos secciones: **Para ahora** (V1) y **Para entenderte** (Fase 2).  
* Al terminar una cápsula: "¿Te sirvió?" (Sí · Más o menos · No) para uso interno.  
* Los textos completos los redactan Paski y Coty; aquí va el título, la idea central y el "Pruébalo hoy".

| \# | Sección | Título | Idea central | Pruébalo hoy |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Para ahora | Respirar para calmar el cuerpo | Exhalar más largo que inhalar le avisa al cuerpo que puede bajar la alerta. | Respira 4-6 durante 1 minuto antes de tu próxima comida. |
| 2 | Para ahora | Qué hacer en un momento de ansiedad | La ansiedad funciona como una ola: sube, llega a su punto y baja. No hay que pelear con ella. | Cuando aparezca, ponle nombre: "Esto es ansiedad y va a pasar". |
| 3 | Para ahora | Mindful eating en una comida | Comer con atención ayuda a notar el sabor, el hambre y la saciedad. | Come sentada y sin pantalla, y saborea con atención los 3 primeros bocados. |
| 4 | Para ahora | Cómo volver después de un evento o vacaciones | No hay que compensar ni esperar al lunes: la próxima comida es una comida normal. | Elige un solo hábito pequeño para retomar hoy. |
| 5 | Para entenderte | El ciclo control → descontrol → culpa | La restricción aumenta las ganas, las ganas traen desborde y el desborde trae culpa, que vuelve a la restricción. | Identifica en qué parte del ciclo estás hoy. |
| 6 | Para entenderte | Por qué las dietas no se sostienen | El cuerpo responde a la restricción con más hambre y más pensamientos sobre comida. No es falta de constancia. | Anota una regla de dieta que todavía sigues. |
| 7 | Para entenderte | Alimentación intuitiva: qué es y qué no es | No es comer chocolate todo el día: es volver a confiar en tu hambre, tu saciedad y tu satisfacción. | Antes de comer, pon tu hambre en la escala del 1 al 10\. |
| 8 | Para entenderte | Sin alimentos prohibidos | Prohibir aumenta el deseo; permitirse le quita urgencia. | Piensa en un alimento "prohibido" y pregúntate qué crees que pasaría si te lo permites. |
| 9 | Para entenderte | Hambre física y hambre emocional | Las dos son válidas y piden cosas distintas. | Usa "¿Tengo hambre?" una vez hoy. |
| 10 | Para entenderte | Autoexigencia y autocuidado | Cuidarte no es controlarte: es tratarte como tratarías a alguien que quieres. | Cambia un "debería" por un "me gustaría". |
| 11 | Para entenderte | Poner límites | Decir que no a otros a veces es decirte que sí a ti. | Escribe un límite con la plantilla: "Hoy no puedo \_\_\_, pero sí puedo \_\_\_". |
| 12 | Para entenderte | Imagen corporal | Tu cuerpo no es un proyecto por arreglar. Revisarlo todo el tiempo aumenta la ansiedad. | Nombra 3 cosas que tu cuerpo hizo por ti hoy. |
| 13 | Para entenderte | Ciclo menstrual y apetito | Es normal que el apetito y las ganas cambien en distintos momentos del ciclo. | Nota en qué parte de tu ciclo estás y cómo está tu hambre. |
| 14 | Para entenderte | Comer en eventos y salidas | Disfrutar en lo social también es cuidarse. | En tu próxima salida, elige lo que de verdad te apetece y disfrútalo. |

**Temas de "¿Qué quieres trabajar hoy?" → cápsula:** Las tardes → 2 · La culpa → 5 · Escuchar mi hambre → 9 · Mi ciclo con la comida → 5 · Comer con presencia → 3 · Volver después de un evento → 4 · Un hábito pequeño → 4 · Comer sin pantalla → 3 · Organizar mi semana sin presión → 10 · Moverme por gusto → 12 · Bajar el estrés → 1 · Poner límites → 11 · Tiempo para mí → 10 · Descansar mejor → 1 · Hablarme mejor → 10\. En V1, si la cápsula es de Fase 2, usar la cápsula 1 a 4 más cercana.

### **Banco de frases (V1)**

Se muestran en Inicio y en la notificación "Frase del día", según el estilo elegido (1 o 2 estilos). Sin repetir hasta agotar el estilo.

| Estilo | Frases |
| :---- | :---- |
| Autocuidado | "Hoy es un buen día para priorizarte. Te invito a regalarte un momento para ti, aunque sean 5 minutos." · "¿Ya tomaste agua hoy? Tu cuerpo te lo agradece." · "Descansar también es avanzar." · "Hoy puedes decir que no a algo para decirte que sí a ti." · "Siéntate a comer, aunque sea un ratito. Te lo mereces." · "Me permito descansar cuando mi cuerpo me lo pide." |
| Afirmaciones | "Mi cuerpo no define mi valor." · "Estoy haciendo lo mejor que puedo, y eso es suficiente." · "Puedo confiar en las señales de mi cuerpo." · "Ningún alimento me hace buena o mala persona." · "Soy amable y paciente conmigo." · "Está bien poner mis propios límites." · "Agradezco todo lo que mi cuerpo me permite hacer." |
| Motivacional | "Algunos días avanzo, otros retrocedo y otros hago una pausa. Lo importante es seguir en el camino." · "No tienes que empezar de nuevo el lunes. Puedes seguir desde aquí." · "Un día difícil no borra todo lo que has avanzado." · "No te falta nada: estás aprendiendo una forma nueva." · "Mi pasado no define lo que viene." · "Cada vez que te miras con cariño, estás cambiando algo." |
| Calma | "Esta incomodidad es temporal." · "Respira. No tienes que resolverlo todo ahora." · "Está bien sentirse frágil, sensible o triste." · "Observo mis emociones sin juzgarlas." · "Elijo la calma en lugar de la exigencia." · "He pasado por momentos difíciles antes. También voy a pasar este." |

El banco va a crecer: conviene que el equipo Nutrimind pueda agregar frases y cápsulas sin publicar una nueva versión de la app.

## **14\. Derivación, crisis y datos (V1)**

### **Pantalla de derivación**

* **Se activa:** si en la pregunta 12 del diagnóstico marca cualquier opción distinta de "Ninguna".  
* **Texto:** "Gracias por contárnoslo. Lo que describes merece un acompañamiento más cercano que el de una app. Te recomendamos hablar con un equipo especializado."  
* **Botones:** "Agendar con Nutrimind" (link) · "Ver dónde pedir ayuda" · "Seguir con las funciones de calma".  
* **Si sigue:** solo quedan activas Respira, frases y audios. Se desactivan ¿Tengo hambre?, Mi organización y recetas.

### **Ayuda en crisis**

* **Dónde:** enlace visible "Necesito ayuda ahora" dentro de Me está costando, y en Perfil.  
* **También se activa** si en un campo de texto (diario, Acabo de comer, Me está costando) aparecen palabras de riesgo. La lista de palabras la define el equipo clínico.  
* **Pantalla:** mensaje de contención \+ líneas de ayuda en Chile con botón para llamar (Salud Responde y la línea de prevención del suicidio \*4141 del Minsal). Los números se confirman antes del lanzamiento.

### **Otras reglas**

* **Menores de 18:** si marca "Menos de 18" en Preferencias, la app no continúa.  
* **Aviso fijo** (en Perfil y en la pantalla de consentimiento): "Esta app acompaña, no reemplaza a un profesional de salud."  
* **Sin chat** con profesionales. Sí un link "Agendar una sesión con Nutrimind" en Perfil, en la derivación y en el aviso de "Acabo de comer" repetido.

### **Datos**

| Se guarda | No se guarda |
| :---- | :---- |
| Nombre o apodo | Peso, talla, medidas o IMC |
| Respuestas del diagnóstico y preferencias | Fotos del cuerpo |
| Check-ins (emoción, intensidad, necesidad) | Calorías, porciones o registro de comidas |
| Usos de Me está costando (calma antes y después) |  |
| Entradas del diario y de Mis logros |  |
| Horarios de notificaciones |  |
| Árboles y emoción de cada día |  |
| Respuestas de Mi semana y espacio mental |  |

* Son datos sensibles de salud mental y alimentación: requieren consentimiento explícito al inicio.  
* Botón "Borrar todos mis datos" en Perfil, con confirmación.  
* El equipo Nutrimind solo ve datos de uso agregados y anónimos.  
* El equipo Nutrimind necesita poder cargar y editar frases, cápsulas y audios.

## **15\. Fase 2**

### **Mi organización**

Texto fijo al entrar: "Organizarte es para sacarte peso de la cabeza, no para controlarte."

1. **Comidas de la semana**  
   * Vista lunes a domingo, 4 espacios por día: desayuno · almuerzo · once o cena · colación (opcional).  
   * Cada espacio: elegir una receta o escribir texto libre.  
   * Nada es obligatorio. Texto: "Planifica solo lo que te saque peso de encima. El resto se decide en el momento."  
   * Botón "Cambiar" en cada comida, sin confirmación.  
2. **Lista de compras**  
   * Se genera con los ingredientes de las recetas elegidas; se pueden agregar ítems a mano.  
   * Secciones: frutas y verduras · despensa · lácteos y huevos · carnes y proteínas · panadería · otros.  
   * Tachar con un toque. Botón "Compartir por WhatsApp".  
3. **Tiempo para mí**  
   * "¿Cuántos momentos para ti quieres esta semana?" (1, 2 o 3).  
   * Para cada uno: día, hora y actividad de la lista "Ideas para mí".  
   * Notificación: "Hoy tienes un rato reservado para ti."  
4. **Pendientes**  
   * Pestañas: Hoy · Esta semana · Este mes.  
   * En Hoy, sugerir máximo 3 prioridades (marcar con estrella).  
   * Con más de 7 pendientes en Hoy: "Es mucho para un solo día. ¿Qué puede esperar?"  
   * Lo no tachado nunca se marca como atrasado. Al día siguiente: "¿Lo pasamos a hoy o lo soltamos?" (Pasar a hoy · Soltar).

### **Recetas**

Ficha: nombre · momento · tiempo · ingredientes · pasos · "Para disfrutarla". Filtros: desayuno · almuerzo · once · colación · antojo dulce · tardes cansadas (10 minutos o menos). Sin calorías ni porciones.

| Receta | Momento | Tiempo | Ingredientes | Pasos | Para disfrutarla |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Avena de noche con fruta | Desayuno | 5 min \+ refrigerar | ½ taza de avena, ½ taza de leche o bebida vegetal, 2 cucharadas de yogur, fruta picada, canela | Mezcla la avena, la leche y el yogur en un frasco, refrigera toda la noche y en la mañana agrega fruta y canela. | Cómela sentada, aunque sean 10 minutos antes de salir. |
| Huevos revueltos con palta | Desayuno u once | 10 min | 2 huevos, ½ palta, pan que te guste, tomate, sal y orégano | Revuelve los huevos a fuego bajo, tuesta el pan y sirve con palta y tomate. | Nota la mezcla de texturas: lo crujiente del pan y lo cremoso de la palta. |
| Tostadas con hummus y tomate | Once | 5 min | Pan, hummus, tomate, aceite de oliva, sal | Tuesta el pan, unta hummus, agrega tomate en rodajas y un hilo de aceite. | Sírvela en un plato, no de pie en la cocina. |
| Wrap de pollo o atún | Tardes cansadas | 10 min | Tortilla, pollo cocido o atún, lechuga, zanahoria rallada, palta o mayonesa | Rellena la tortilla, enrolla y corta por la mitad. | Antes del primer bocado, revisa en qué número de la escala está tu hambre. |
| Tortilla de zapallo italiano | Almuerzo o cena | 20 min | 2 zapallos italianos, 1 cebolla, 3 huevos, queso rallado, sal y pimienta | Sofríe la cebolla y el zapallo rallado, agrega los huevos batidos con queso y cocina tapado a fuego bajo hasta que cuaje. | Acompáñala con una ensalada de colores. |
| Ensalada tibia de quinoa | Almuerzo | 25 min | 1 taza de quinoa cocida, verduras asadas (pimiento, zapallo, cebolla), queso fresco, limón, aceite de oliva | Asa las verduras 15 minutos, mezcla con la quinoa, agrega queso y aliña. | Deja el celular lejos mientras comes. |
| Pollo al horno con papas y zapallo | Almuerzo | 40 min | Trutros o pechuga, papas, zapallo camote, ajo, aceite, merkén o paprika | Corta todo, aliña en una bandeja y hornea a 200 °C hasta que dore. | Comparte la mesa con alguien, si puedes. |
| Lentejas guisadas | Almuerzo | 35 min | 1 taza de lentejas, cebolla, zanahoria, zapallo, ajo, comino, arroz (opcional) | Sofríe las verduras, agrega las lentejas y agua, y cocina hasta que estén blandas. | Es una comida que reconforta; permítete disfrutarla sin apuro. |
| Yogur con granola y frutos secos | Colación | 3 min | Yogur natural, granola, nueces o almendras, fruta, miel (opcional) | Arma todo en un bowl. | Come despacio y nota cuándo empiezas a sentirte satisfecha. |
| Plátano con mantequilla de maní y cacao | Antojo dulce | 3 min | 1 plátano, mantequilla de maní, cacao amargo o chocolate rallado | Corta el plátano en rodajas, agrega mantequilla de maní y espolvorea el cacao. | Un antojo dulce también merece plato y mesa. |
| Mug cake de chocolate | Antojo dulce | 5 min | 4 cucharadas de harina, 2 de azúcar, 2 de cacao, 1 huevo, 3 de leche, 1 de aceite, polvo de hornear | Mezcla todo en una taza y lleva al microondas 1 minuto y medio. | El chocolate no está prohibido. Cómelo tibio, sentada y saboreando. |

### **Tracker de hábitos**

1. Al activarlo: "Elige 1 a 3 hábitos para empezar. Menos es más." A las 2 semanas: "¿Quieres sumar otro hábito?"  
2. Por cada hábito, ella elige cuántas veces por semana (1 a 7).  
3. Se marca con un toque y aparece una frase corta (ej. "Eso es cuidarte").  
4. Domingo: "Esta semana te cuidaste \[n\] veces". Sin rachas, porcentajes ni días en rojo.

| Categoría | Hábito | Texto "por qué ayuda" |
| :---- | :---- | :---- |
| Cuerpo | Tomar agua durante el día | "A veces la sed se confunde con hambre o cansancio." |
| Cuerpo | Dormir 8 horas o acostarme a una hora fija | "Con sueño, el hambre y la ansiedad se sienten más fuertes." |
| Cuerpo | Moverme por gusto | "Moverte para sentirte bien, no para 'quemar'." |
| Cuerpo | Estirarme 3 minutos | "Suelta la tensión que se acumula en el día." |
| Comida sin juicio | Comer sentada y sin pantalla | "Ayuda a notar el sabor y la saciedad." |
| Comida sin juicio | No saltarme comidas | "Llegar con mucha hambre a la tarde hace más probable el desborde." |
| Comida sin juicio | Revisar mi hambre antes de comer | "Te reconecta con lo que pide tu cuerpo." |
| Comida sin juicio | Incluir algo que disfruto | "El placer también es parte de comer bien." |
| Mente | Hacer una pausa consciente | "Unos segundos para salir del piloto automático." |
| Mente | Escribir en el diario | "Ordena lo que sientes y le baja el volumen." |
| Mente | Hablarme con cariño una vez al día | "Cambia la voz que te exige por una que te acompaña." |
| Mente | Un momento sin celular | "Descanso real para tu cabeza." |
| Vínculos y límites | Decir que no a algo | "Poner límites es cuidarte." |
| Vínculos y límites | Hablar con alguien que me hace bien | "Sentirte acompañada calma." |
| Vínculos y límites | Un rato para mí | "Si tú no estás en tu lista, nadie te va a poner ahí." |
| Otro | Crear mi propio hábito | Campo de texto. Debajo: "Te sugerimos evitar hábitos de peso o restricción." |

### **Otros de Fase 2**

* **Widget** de pantalla de bloqueo con la frase del día.  
* **Premios por volver:** frases o fondos nuevos al cumplir 3, 7 y 21 días de uso (no necesariamente seguidos).  
* **Flores o frutos en el árbol** por otros cuidados (por definir).  
* **Diario completo:** gratitud y registro de ansiedad.  
* Cápsulas 5 a 14 de Aprende y respiraciones de 3 y 5 minutos (si no entran en V1).