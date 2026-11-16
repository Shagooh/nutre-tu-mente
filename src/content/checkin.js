// Sección 8 transcrita del documento. No conectar a publicación sin revisión clínica.
const procedencia = {
  fuente: 'docs/referencias/contenido-desarrollo-2026-10-26.md',
  seccion: 8, version: '2026-10-26', fase: 'V1', trato: 'tu',
  estado: 'pendiente-revision-clinica',
};
const pieza = (datos) => ({ ...procedencia, ...datos });

// Los nombres de color son los provisionales de la fuente. No fijamos HEX finales.
// Los iconos son propuestas visuales pendientes de revisión, no texto clínico nuevo.
export const EMOCIONES_CHECKIN = [
  ['tranquila', 'Tranquila', 'Verde', '🌿', 'Qué rico sentir calma. Este momento también es tuyo.'],
  ['contenta', 'Contenta', 'Amarillo', '☀️', 'Me alegra que hoy te sientas así. Date un segundo para notarlo.'],
  ['cansada', 'Cansada', 'Lila', '🌙', 'Has dado mucho. El cansancio también es una señal de tu cuerpo.'],
  ['ansiosa', 'Ansiosa', 'Naranjo', '🌀', 'La ansiedad se siente fuerte, pero pasa. No tienes que resolver todo ahora.'],
  ['estresada', 'Estresada', 'Morado', '⚡', 'Llevas mucho encima. Tiene sentido que te sientas así.'],
  ['triste', 'Triste', 'Celeste', '💧', 'Está bien estar triste. Aquí no tienes que esconderlo.'],
  ['enojada', 'Enojada o frustrada', 'Rojo', '🔥', 'Tu enojo te está diciendo algo importante. Escuchémoslo sin juzgarlo.'],
  ['aburrida', 'Aburrida', 'Beige', '💭', 'El aburrimiento también pide algo. Veamos qué.'],
  ['sola', 'Sola', 'Azul', '🫂', 'No estás sola en esto. Aquí estoy contigo.'],
  ['no-se', 'No sé', 'Blanco perla', '❔', 'No saber también está bien. A veces una pausa ayuda a entender.'],
].map(([id, texto, color, icono, validacion]) => pieza({ id, texto, color, icono, validacion }));

export const INTENSIDADES_CHECKIN = [
  { valor: 1, texto: 'poco' }, { valor: 2, texto: 'medio' }, { valor: 3, texto: 'mucho' },
];
export const NECESIDADES_CHECKIN = [
  ['descansar', 'Descansar', '¿Puedes regalarte 10 minutos sin pantallas? Te acompaño con un audio de relajación.', ['audio-4']],
  ['hablar', 'Hablar con alguien', '¿Hay alguien a quien puedas escribirle hoy? Un mensaje corto basta. Mientras, aquí estoy.', ['diario']],
  ['moverme', 'Moverme', '¿Qué tal 5 minutos de estiramiento o una vuelta a la cuadra? Moverte por gusto, no por obligación.', ['estiramientos']],
  ['comer', 'Comer', 'Si tienes hambre, come. Antes, miremos juntas qué tipo de hambre es.', ['tengo-hambre']],
  ['momento', 'Un momento para mí', 'Elige algo pequeño solo para ti: un té, una canción, 5 minutos al sol.', ['ideas-para-mi']],
  ['limite', 'Poner un límite', "¿A qué o a quién necesitas decirle que no hoy? Te ayudo a escribirlo: 'Hoy no puedo ___, pero sí puedo ___.'", ['plantilla-limite']],
  ['no-se', 'No sé', 'Partamos por respirar un minuto y después vemos.', ['respira-1-min']],
].map(([id, texto, accion, destinos]) => pieza({ id, texto, accion, destinos }));

export const RESPUESTAS_ESPECIALES = [
  ['ansiosa-comer', ['ansiosa', 'estresada'], 'comer', 'Primero respiremos un minuto. Después, si sigue el hambre, la miramos juntas.', ['respira-1-min', 'tengo-hambre']],
  ['cansada-comer', ['cansada'], 'comer', 'A veces el cansancio se disfraza de hambre. ¿Comiste hace poco?', ['tengo-hambre']],
  ['aburrida-comer', ['aburrida'], 'comer', '¿Es hambre o ganas de que pase algo? Probemos con la escala de hambre.', ['tengo-hambre']],
  ['triste-hablar', ['triste'], 'hablar', '¿Quién te hace sentir acompañada? Escríbele. Si prefieres, primero escríbelo aquí.', ['diario']],
  ['enojada-moverme', ['enojada'], 'moverme', 'Saquemos ese enojo del cuerpo: camina rápido 5 minutos o sacude brazos y piernas.', []],
  ['enojada-limite', ['enojada'], 'limite', "Tu enojo te mostró un límite. Escríbelo: 'Me di cuenta de que ___. Necesito ___.'", ['plantilla-limite']],
  ['sola-momento', ['sola'], 'momento', 'Te dejo un audio corto para que te acompañe mientras te regalas este rato.', ['audio-5']],
].map(([id, emociones, necesidad, accion, destinos]) => pieza({ id, emociones, necesidad, accion, destinos }));

export const INVITACION_LOGRO = pieza({
  texto: '¿Qué te ayudó a estar así hoy? Si quieres, anótalo en Mis logros.', destino: 'mis-logros',
});
export const APOYO_INTENSIDAD = pieza({ texto: 'Si lo necesitas, te acompaño un poco más.', destino: 'me-esta-costando' });

// Resuelve contenido editorial; los destinos son IDs, no rutas ni promesas de disponibilidad.
// La pantalla deberá comprobar aprobación y disponibilidad antes de mostrar texto o enlaces.
export function respuestaCheckin(emocionId, necesidadId, intensidad) {
  const emocion = EMOCIONES_CHECKIN.find((e) => e.id === emocionId);
  const necesidad = NECESIDADES_CHECKIN.find((n) => n.id === necesidadId);
  if (!emocion || !necesidad || !INTENSIDADES_CHECKIN.some((i) => i.valor === intensidad)) return null;
  const especial = RESPUESTAS_ESPECIALES.find((r) => r.emociones.includes(emocionId) && r.necesidad === necesidadId);
  const respuesta = especial || necesidad;
  return pieza({
    validacion: emocion.validacion, accion: respuesta.accion, destinos: [...respuesta.destinos],
    especial: especial?.id ?? null,
    logro: ['tranquila', 'contenta'].includes(emocionId) ? INVITACION_LOGRO : null,
    apoyo: intensidad === 3 && ['ansiosa', 'estresada', 'triste', 'enojada', 'sola'].includes(emocionId) ? APOYO_INTENSIDAD : null,
  });
}
