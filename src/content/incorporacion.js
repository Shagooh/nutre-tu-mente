// Catálogo editorial. Fuente, versión, fase y estado se heredan por sección.
const edicion = {
  fuente: 'docs/referencias/contenido-desarrollo-2026-10-26.md',
  version: '2026-10-26',
  fase: 'V1',
  estado: 'pendiente-revision-clinica',
  trato: 'neutro',
};

function opcion(id, texto) {
  return { id, texto };
}

// La fuente solo entrega estas formulaciones en femenino.
function femenino(id, texto) {
  return { id, texto, trato: 'femenino', variantesPendientes: ['masculino', 'neutro'] };
}

export const DIAGNOSTICO = {
  ...edicion,
  seccion: 3,
  preguntas: [
    {
      id: 'diag-1',
      texto: '¿Cuánto espacio ocupa la comida en tu cabeza durante el día?',
      tipo: 'Única',
      omisible: true,
      opciones: [
        opcion('casi-nada', 'Casi nada'),
        opcion('poco', 'Un poco'),
        opcion('bastante', 'Bastante'),
        opcion('casi-todo', 'Casi todo el día'),
      ],
    },
    {
      id: 'diag-2',
      texto: '¿Te identificas con alguna de estas frases?',
      tipo: 'Varias',
      omisible: true,
      opciones: [
        opcion('constancia', 'Empiezo súper bien y no lo mantengo'),
        opcion('parar', 'Si empiezo, no puedo parar'),
        opcion('voluntad', 'No tengo fuerza de voluntad'),
        opcion('gusto', 'Me gusta demasiado la comida'),
        opcion('automatico', 'Como sin darme cuenta, picoteo en automático'),
        opcion('culpa', 'Después de comer me siento culpable'),
        opcion('ninguna', 'Ninguna'),
      ],
    },
    {
      id: 'diag-3',
      texto: '¿Has hecho algo de esto?',
      tipo: 'Varias',
      omisible: true,
      opciones: [
        opcion('dietas', 'Dietas (sin pan, bajas en carbohidratos, etc.)'),
        opcion('nutricionista', 'Plan con nutricionista'),
        opcion('apps', 'Apps de calorías o pasos'),
        opcion('retos', 'Retos de redes sociales o influencers'),
        opcion('ejercicio', 'Programas de ejercicio'),
        opcion('cirugia', 'Cirugía bariátrica'),
        opcion('terapia', 'Terapia'),
        opcion('nada', 'Nada aún'),
      ],
    },
    {
      id: 'diag-4',
      texto: '¿En qué momento sientes más incomodidad con la comida?',
      tipo: 'Varias',
      omisible: true,
      opciones: [
        opcion('manana', 'Mañana'),
        opcion('tarde', 'Tarde'),
        opcion('noche', 'Noche'),
        opcion('fin-de-semana', 'Fines de semana'),
        opcion('eventos', 'Eventos, cumpleaños, vacaciones'),
        femenino('cansancio', 'Cuando estoy cansada o estresada'),
      ],
    },
    {
      id: 'diag-5',
      texto: 'Cuando te desbordas con la comida, ¿qué suele estar pasando?',
      tipo: 'Varias',
      omisible: true,
      opciones: [
        opcion('ansiedad', 'Ansiedad'),
        opcion('estres', 'Estrés'),
        opcion('aburrimiento', 'Aburrimiento'),
        opcion('cansancio', 'Cansancio'),
        opcion('tristeza', 'Tristeza'),
        opcion('soledad', 'Soledad'),
        opcion('permiso', 'Me di permiso de comer algo "prohibido"'),
        opcion('no-se', 'No sé'),
      ],
    },
    {
      id: 'diag-6',
      texto: '¿Qué tan conectada te sientes con tu hambre y tu saciedad?',
      tipo: 'Única',
      omisible: true,
      trato: 'femenino',
      variantesPendientes: ['masculino', 'neutro'],
      opciones: [
        opcion('bien', 'Las reconozco bien'),
        opcion('a-veces', 'A veces'),
        opcion('casi-nunca', 'Casi nunca sé si tengo hambre física'),
      ],
    },
    {
      id: 'diag-7',
      texto: 'Cuando te equivocas o "fallas", ¿cómo te hablas?',
      tipo: 'Única',
      omisible: true,
      opciones: [
        opcion('carino', 'Con cariño'),
        opcion('neutral', 'Neutral'),
        opcion('exigencia', 'Me exijo mucho'),
        opcion('maltrato', 'Me trato mal'),
      ],
    },
    {
      id: 'diag-8',
      texto: '¿Cuánto tiempo tienes para ti en el día?',
      tipo: 'Única',
      omisible: true,
      opciones: [
        opcion('casi-nada', 'Casi nada'),
        opcion('rato', 'Un rato corto'),
        opcion('suficiente', 'Lo suficiente'),
      ],
    },
    {
      id: 'diag-9',
      texto: '¿Qué te gustaría sentir?',
      tipo: 'Hasta 3',
      omisible: true,
      opciones: [
        opcion('paz', 'Paz mental con la comida'),
        opcion('sin-culpa', 'Comer sin culpa'),
        femenino('compania', 'Sentirme acompañada'),
        opcion('confianza', 'Confiar en mí'),
        opcion('disfrutar', 'Disfrutar comidas y momentos sociales'),
        opcion('priorizar', 'Priorizarme'),
        opcion('emociones', 'Entender mis emociones'),
        femenino('tranquilidad', 'Estar más tranquila'),
      ],
    },
    {
      id: 'diag-10',
      texto: '¿Qué tipo de acompañamiento buscas hoy?',
      tipo: 'Única',
      omisible: true,
      opciones: [
        opcion('conciencia', 'Tomar conciencia de mi relación con la comida y mi conducta alimentaria'),
        opcion('habitos', 'Cambiar hábitos de alimentación y salud desde el autoconocimiento'),
        opcion('bienestar', 'Cuidar solo mi salud mental'),
      ],
    },
    {
      id: 'diag-11',
      texto: '¿Qué te ha hecho dejar otras cosas?',
      tipo: 'Varias',
      omisible: true,
      opciones: [
        opcion('resultados', 'No vi resultados rápido'),
        opcion('agobio', 'Me abrumé'),
        opcion('rutina', 'Algo me sacó de la rutina y no supe volver'),
        femenino('juicio', 'Me sentí juzgada'),
        opcion('olvido', 'Me olvidé'),
        opcion('nada', 'Nada, mantengo hábitos que quiero'),
      ],
    },
    {
      id: 'diag-12',
      texto: 'En los últimos 3 meses, ¿te ha pasado alguna de estas cosas?',
      tipo: 'Varias, obligatoria',
      omisible: false,
      opciones: [
        opcion('compensacion', 'Vomitar o usar laxantes para compensar lo que comí'),
        opcion('ayuno', 'Pasar muchas horas o días sin comer a propósito'),
        opcion('control', 'Sentir que la comida o mi peso controlan toda mi vida'),
        opcion('tca', 'Tener un diagnóstico de trastorno de la conducta alimentaria (TCA)'),
        opcion('ninguna', 'Ninguna'),
      ],
    },
  ],
  validaciones: {
    'diag-5': 'Gracias por contarnos. Nada de esto es un fracaso tuyo: es un ciclo que se puede entender y cambiar.',
    'diag-8': 'Te haces cargo de mucho. Aquí la idea es que tú también estés en tu lista.',
  },
  nombre: {
    titulo: '¿Cómo quieres que te llamemos?',
    subtitulo: 'Tu nombre aparecerá en tus mensajes y frases.',
  },
  resultados: {
    Conciencia: '[Nombre], lo que nos cuentas tiene mucho sentido. Vives con harto ruido mental y [momento] te cuesta más. Vamos a empezar por ahí: entender tu ciclo, sin juicio y a tu ritmo.',
    Hábitos: '[Nombre], ya sabes mucho sobre alimentación; lo difícil es sostenerlo. Vamos a construir hábitos pequeños, desde lo que sientes y sin todo o nada.',
    Bienestar: '[Nombre], te haces cargo de mucho. Aquí vamos a cuidar primero tu cabeza: pausas, calma y espacio para ti.',
  },
  tituloFunciones: 'Esto es lo que preparamos para ti',
  botonResultado: 'Empezar',
};

export const PREFERENCIAS = {
  ...edicion,
  seccion: 4,
  preguntas: [
    {
      id: 'pref-1',
      texto: '¿Cómo prefieres que te hablemos?',
      tipo: 'Única',
      opciones: [
        opcion('femenino', 'En femenino ("estás cansada")'),
        opcion('masculino', 'En masculino ("estás cansado")'),
        opcion('neutro', 'Neutro ("te sientes con cansancio")'),
      ],
    },
    {
      id: 'pref-2',
      texto: '¿Qué rango de edad tienes?',
      tipo: 'Única',
      opciones: [
        opcion('menor-18', 'Menos de 18'),
        opcion('18-24', '18–24'),
        opcion('25-34', '25–34'),
        opcion('35-44', '35–44'),
        opcion('45-54', '45–54'),
        opcion('55-mas', '55+'),
      ],
    },
    {
      id: 'pref-3',
      texto: '¿Cuál es tu situación hoy?',
      tipo: 'Varias, opcional',
      opciones: [
        opcion('trabajo', 'Trabajo'),
        opcion('estudio', 'Estudio'),
        femenino('cuidados', 'Soy mamá / cuido a otros'),
        opcion('trabajo-cuidados', 'Trabajo y cuido a otros'),
        opcion('otro', 'Otro'),
      ],
    },
    {
      id: 'pref-4',
      texto: '¿Qué estilo de frases te acompaña más?',
      tipo: '1 o 2',
      opciones: [
        opcion('autocuidado', 'Autocuidado ("Hoy es un buen día para priorizarte…")'),
        opcion('afirmaciones', 'Afirmaciones ("Mi cuerpo no define mi valor.")'),
        opcion('motivacional', 'Motivacional ("Algunos días avanzo, otros hago una pausa. Sigo en el camino.")'),
        opcion('calma', 'Calma ("Esta incomodidad es temporal. Respira.")'),
      ],
    },
    {
      id: 'pref-5',
      texto: '¿Cómo prefieres recibir el contenido?',
      tipo: 'Varias',
      opciones: [
        opcion('textos', 'Textos cortos'),
        opcion('audios', 'Audios'),
        opcion('ejercicios', 'Ejercicios guiados paso a paso'),
        opcion('videos', 'Videos cortos'),
      ],
    },
    {
      id: 'pref-6',
      texto: '¿Cuánto tiempo al día te gustaría dedicarte aquí?',
      tipo: 'Única',
      opciones: [
        opcion('un-minuto', '1 minuto'),
        opcion('tres-minutos', '3 minutos'),
        opcion('cinco-diez', '5–10 minutos'),
      ],
    },
    {
      id: 'pref-7',
      texto: '¿Cómo nos conociste?',
      tipo: 'Única, opcional',
      opciones: [
        opcion('instagram', 'Instagram'),
        opcion('tiktok', 'TikTok'),
        opcion('facebook', 'Facebook'),
        opcion('recomendacion', 'Amiga o familia'),
        opcion('nutrimind', 'Nutrimind (consulta o taller)'),
        opcion('busqueda', 'Búsqueda en internet'),
        opcion('otro', 'Otro'),
      ],
    },
  ],
  mensajeTiempo: 'Con poco basta. Lo importante es volver, no hacerlo perfecto.',
};

// La fuente describe la intención de estas piezas, sin entregar su texto final.
export const PENDIENTES_EDITORIALES = [
  { seccion: 2, id: 'consentimiento-casilla' },
  { seccion: 2, id: 'consentimiento-aviso', motivo: 'Conciliar las redacciones de §2 y §14.' },
  { seccion: 3, id: 'resultado-conciencia-momento-omitido' },
  { seccion: 3, id: 'resultado-conciencia-varios-momentos' },
  { seccion: 4, id: 'orientacion-menor-de-edad' },
];
