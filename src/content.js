// Contenido editable por el equipo Nutrimind. Tono: de tú, cálido, sin castigos.
// Todos los textos son un borrador inicial: deben ser validados por el equipo clínico.

export const OBJETIVOS = [
  { id: 'paz', texto: 'Tener paz mental con la comida', leccion: 'comer-presente' },
  { id: 'culpa', texto: 'Soltar la culpa después de comer', leccion: 'sin-juicio' },
  { id: 'hambre', texto: 'Entender mejor mi hambre', leccion: 'hambre-emocional' },
  { id: 'acompanada', texto: 'Sentirme acompañada en los momentos difíciles', leccion: 'pausa' },
];

export const MOMENTOS = [
  { id: 'manana', texto: 'En la mañana' },
  { id: 'mediodia', texto: 'Al mediodía' },
  { id: 'tarde', texto: 'En la tarde' },
  { id: 'noche', texto: 'En la noche' },
];

export const ESTILOS = [
  { id: 'motivacional', texto: 'Motivacionales' },
  { id: 'autocuidado', texto: 'De autocuidado' },
  { id: 'afirmaciones', texto: 'Afirmaciones' },
];

export const FLORES = [
  { id: 'girasol', nombre: 'Girasol', final: '🌻' },
  { id: 'rosa', nombre: 'Rosa', final: '🌹' },
  { id: 'tulipan', nombre: 'Tulipán', final: '🌷' },
  { id: 'cerezo', nombre: 'Flor de cerezo', final: '🌸' },
  { id: 'hibisco', nombre: 'Hibisco', final: '🌺' },
];

// "desde" son puntos de cuidado. La planta solo crece, nunca retrocede.
export const ETAPAS = [
  { desde: 0, nombre: 'Semilla', emoji: '🌱', escala: 0.85 },
  { desde: 3, nombre: 'Brote', emoji: '🌿', escala: 1.0 },
  { desde: 8, nombre: 'Creciendo', emoji: '🪴', escala: 1.15 },
  { desde: 15, nombre: 'En flor', emoji: null, escala: 1.3 },
];

export const FRASES = {
  motivacional: [
    'Hoy es un buen día para priorizarte.',
    'Cada pequeño paso cuenta, también los lentos.',
    'Puedes empezar de nuevo en cualquier momento del día, no solo el lunes.',
    'No tienes que hacerlo perfecto para que valga la pena.',
    'Volver a intentarlo también es avanzar.',
    'Lo estás haciendo con lo que tienes hoy, y eso es suficiente.',
    'Tu ritmo es el correcto para ti.',
  ],
  autocuidado: [
    'Respira, estás en el lugar correcto.',
    'Haz una pausa. Tu cuerpo te habla; escúchalo con cariño.',
    'Hoy, ¿qué necesitas para sentirte un poco más en calma?',
    'Tomar agua, estirarte, descansar: cuidarte también se hace en pequeño.',
    'Háblate como le hablarías a alguien que quieres.',
    'Mereces descanso sin tener que ganártelo.',
    'Escuchar tu hambre es una forma de cuidarte.',
  ],
  afirmaciones: [
    'Soy más que lo que como.',
    'Mi cuerpo merece cuidado y respeto.',
    'Puedo sentir lo que siento sin juzgarme.',
    'Puedo parar y respirar.',
    'Estoy aprendiendo a confiar en mi cuerpo.',
    'Un momento difícil no define mi día.',
    'Estoy en paz con mi proceso.',
  ],
};

export const ANIMOS = [
  { valor: 1, emoji: '😔', texto: 'Mal' },
  { valor: 2, emoji: '😕', texto: 'Regular' },
  { valor: 3, emoji: '😐', texto: 'Normal' },
  { valor: 4, emoji: '🙂', texto: 'Bien' },
  { valor: 5, emoji: '😊', texto: 'Muy bien' },
];

export const NECESIDADES = [
  { id: 'descanso', texto: 'Descanso', accion: 'Siéntate o recuéstate 5 minutos sin pantallas. Tu cuerpo te lo agradece.' },
  { id: 'calma', texto: 'Calma', accion: 'Pon una mano en el pecho y respira lento tres veces más.' },
  { id: 'compania', texto: 'Compañía', accion: 'Escríbele a alguien de confianza, aunque sea un "hola, ando cansada".' },
  { id: 'moverme', texto: 'Moverme suave', accion: 'Estira brazos y cuello, o camina un poco por la casa.' },
  { id: 'agua', texto: 'Agua', accion: 'Toma un vaso de agua despacio y nota cómo se siente.' },
  { id: 'espacio', texto: 'Espacio para mí', accion: 'Cambia de lugar: asómate a la ventana o sal al balcón unos minutos.' },
  { id: 'desahogo', texto: 'Desahogarme', accion: 'Escribe en una nota lo que sientes, sin ordenarlo ni corregirlo.' },
  { id: 'comer', texto: 'Comer con calma', accion: 'Siéntate, sin pantallas, y come despacio, notando sabores y texturas.' },
];

export const TIPOS_HAMBRE = [
  {
    id: 'fisica',
    titulo: 'Hambre física',
    detalle: 'Llega de a poco, se siente en el cuerpo.',
    tip: 'Tu cuerpo te está pidiendo comida, y atenderlo es cuidarte. Si puedes, siéntate y come con calma.',
  },
  {
    id: 'emocional',
    titulo: 'Hambre emocional',
    detalle: 'Llega de golpe y busca alivio.',
    tip: 'Parece que hay algo más que hambre, y está bien. Pregúntate con cariño qué necesitas de verdad ahora.',
  },
  {
    id: 'nose',
    titulo: 'No lo sé',
    detalle: 'A veces es una mezcla.',
    tip: 'No hace falta tener la respuesta exacta. Puedes probar una pausa y notar qué cambia.',
  },
];

export const TRATOS = ['Con calma', 'Con cariño', 'Con paciencia', 'Con curiosidad'];

export const SLOTS = [
  { id: 'manana', nombre: 'Mañana', h: 8, m: 30, titulo: 'Buenos días', cuerpo: '¿Qué necesitas hoy? Hoy es un buen día para priorizarte.' },
  { id: 'mediodia', nombre: 'Mediodía', h: 13, m: 0, titulo: 'Haz una pausa', cuerpo: '¿Cómo estás? Respira un momento.' },
  { id: 'tarde', nombre: 'Tarde', h: 18, m: 30, titulo: 'Estoy aquí contigo', cuerpo: 'Si hoy te cuesta, toca "Me está costando".' },
  { id: 'noche', nombre: 'Noche', h: 21, m: 30, titulo: 'Cierra el día con calma', cuerpo: '¿Cómo te fue hoy? Tu planta te espera.' },
];

export const LECCIONES = [
  {
    id: 'hambre-emocional',
    titulo: '¿Hambre física o emocional?',
    tema: 'Hambre y saciedad',
    minutos: 2,
    parrafos: [
      'El hambre física suele llegar de a poco: se siente en el cuerpo, con energía baja o estómago vacío, y acepta distintas opciones.',
      'El hambre emocional suele llegar de golpe, pide algo muy específico y busca alivio: cansancio, estrés, aburrimiento o tristeza.',
      'Ninguna es mala. Las dos te dan información sobre lo que necesitas. Y a veces es una mezcla, y está bien no tener la respuesta exacta.',
    ],
    ejercicio: 'Pon una mano en el pecho y otra en el abdomen. Respira tres veces. Pregúntate: ¿dónde lo siento? ¿qué necesito ahora?',
  },
  {
    id: 'comer-presente',
    titulo: 'Comer con presencia',
    tema: 'Mindful eating',
    minutos: 3,
    parrafos: [
      'Comer con presencia es comer sabiendo que estás comiendo: notar colores, olores, sabores y texturas, sin apuro.',
      'No se trata de hacerlo perfecto ni en todas las comidas. Se trata de volver, con amabilidad, cada vez que te distraes.',
      'Cuando comes con atención, es más fácil notar cuándo tu cuerpo está cómodo.',
    ],
    ejercicio: 'En tu próxima comida, haz tres respiraciones antes del primer bocado y saboréalo despacio. Solo ese bocado.',
  },
  {
    id: 'sin-juicio',
    titulo: 'Soltar el juicio a los alimentos',
    tema: 'Alimentación intuitiva',
    minutos: 3,
    parrafos: [
      'Los alimentos no son buenos ni malos, y tú tampoco lo eres por lo que comes.',
      'Cuando etiquetamos un alimento como "prohibido" o "premio", suele ocupar más espacio en la mente y aparecen la culpa y el "empiezo el lunes".',
      'Soltar el juicio no pasa de un día para otro. Se practica de a poco, con curiosidad.',
    ],
    ejercicio: 'Elige un alimento que sueles juzgar. Descríbelo sin palabras morales: color, textura, sabor, cómo te hace sentir el cuerpo.',
  },
  {
    id: 'hambre-saciedad',
    titulo: 'Escuchar hambre y saciedad',
    tema: 'Hambre y saciedad',
    minutos: 3,
    parrafos: [
      'Tu cuerpo manda señales antes, durante y después de comer: energía, estómago, ánimo, concentración.',
      'No hay un número correcto ni una respuesta perfecta. Es una conversación con tu cuerpo, no un examen.',
      'Con práctica, esas señales se vuelven más claras.',
    ],
    ejercicio: 'En una comida, detente tres veces (al inicio, a la mitad y al terminar) y nota cómo está tu cuerpo. Sin cambiar nada: solo notar.',
  },
  {
    id: 'pausa',
    titulo: 'Una pausa para respirar',
    tema: 'Respiración consciente',
    minutos: 2,
    parrafos: [
      'Exhalar más largo de lo que inhalas ayuda al cuerpo a bajar el ritmo.',
      'Puedes hacerlo en cualquier lugar: frente a la despensa, en el trabajo, en la cama. No necesitas hacerlo "bien".',
      'Una pausa no arregla todo, pero te da un momento para elegir qué necesitas.',
    ],
    ejercicio: 'Inhala contando 4, exhala contando 6. Repite durante un minuto. También puedes usar "Pausa de 1 minuto" en Hoy.',
  },
];
