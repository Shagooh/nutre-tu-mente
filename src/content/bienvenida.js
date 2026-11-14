// Copy literal del documento; no equivale a aprobación clínica para publicar.
export const BIENVENIDA = {
  fuente: 'docs/referencias/contenido-desarrollo-2026-10-26.md',
  seccion: 2,
  version: '2026-10-26',
  estado: 'pendiente-revision-clinica',
  fase: 'V1',
  trato: 'neutro',
  siguiente: 'Siguiente',
  saltar: 'Saltar',
  consentimiento: {
    aviso: 'Esta app acompaña, no reemplaza la atención profesional.',
    boton: 'Acepto y continúo',
  },
  transicion: 'Ahora te haremos unas preguntas para conocerte. Toma 3 minutos y puedes cambiar todo después.',
  pantallas: [
    {
      titulo: 'Respira. Estás en el lugar correcto.',
      texto: 'Si llegaste hasta aquí, probablemente ya lo intentaste todo. El problema nunca fuiste tú: te faltó compañía.',
    },
    {
      titulo: 'Esto no es una dieta, ni un plan de comidas, ni una app para contar calorías.',
      texto: 'Es un espacio para acompañarte en los momentos en que más lo necesitas y ayudarte a volver a ti.',
    },
    {
      titulo: 'Creada por Nutrimind: una nutricionista y una psicóloga que trabajan juntas desde 2021 con el Método Cambio².',
      texto: 'Basada en mindful eating, alimentación intuitiva y regulación emocional.',
    },
    {
      // Título de interfaz de la entrega provisional, añadido fuera del documento.
      titulo: 'Un espacio para acompañarte',
      funciones: [
        ['¿Cómo estás hoy?', 'Un check-in de 1 minuto.'],
        ['Me está costando', 'Un botón para cuando sientas que te desbordas.'],
        ['Tu bosque', 'Cada mes crece un árbol nuevo, con una hoja por día del color de cómo te sentiste.'],
        ['Aprende', 'Cápsulas cortas para entender lo que te pasa.'],
      ],
    },
  ],
};
