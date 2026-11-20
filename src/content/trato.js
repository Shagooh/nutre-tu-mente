// Matriz editorial explícita. Aprobación clínica/técnica comunicada por el usuario el 2026-11-20.
// Evidencia y alcance: openspec/changes/elegir-trato-personal/revision-editorial.md.
// La clave es la copia original exacta; no se transforman IDs ni texto libre.
const variante = (masculino, femenino, neutro) => ({ masculino, femenino, neutro });
export const VARIANTES_TRATO = {
  'Tranquila': variante('Tranquilo', 'Tranquila', 'En calma'),
  'Contenta': variante('Contento', 'Contenta', 'Con alegría'),
  'Cansada': variante('Cansado', 'Cansada', 'Con cansancio'),
  'Ansiosa': variante('Ansioso', 'Ansiosa', 'Con ansiedad'),
  'Estresada': variante('Estresado', 'Estresada', 'Con estrés'),
  'Enojada o frustrada': variante('Enojado o frustrado', 'Enojada o frustrada', 'Con enojo o frustración'),
  'Aburrida': variante('Aburrido', 'Aburrida', 'Con aburrimiento'),
  'Sola': variante('Solo', 'Sola', 'Con soledad'),
  'Listo': variante('Listo', 'Lista', 'Todo listo'),
  'Sentirme acompañada en los momentos difíciles': variante('Sentirme acompañado en los momentos difíciles', 'Sentirme acompañada en los momentos difíciles', 'Sentir compañía en los momentos difíciles'),
  'Respiramos juntas, sin juicio.': variante('Respiramos juntos, sin juicio.', 'Respiramos juntas, sin juicio.', 'Respiramos sin juicio.'),
  'No estás sola en esto. Aquí estoy contigo.': variante('No estás solo en esto. Aquí estoy contigo.', 'No estás sola en esto. Aquí estoy contigo.', 'Aquí estoy contigo para acompañarte en esto.'),
  'Si tienes hambre, come. Antes, miremos juntas qué tipo de hambre es.': variante('Si tienes hambre, come. Antes, miremos juntos qué tipo de hambre es.', 'Si tienes hambre, come. Antes, miremos juntas qué tipo de hambre es.', 'Si tienes hambre, come. Antes, miremos qué tipo de hambre es.'),
  'Primero respiremos un minuto. Después, si sigue el hambre, la miramos juntas.': variante('Primero respiremos un minuto. Después, si sigue el hambre, la miramos juntos.', 'Primero respiremos un minuto. Después, si sigue el hambre, la miramos juntas.', 'Primero respiremos un minuto. Después, si sigue el hambre, la miramos con calma.'),
  '¿Quién te hace sentir acompañada? Escríbele. Si prefieres, primero escríbelo aquí.': variante('¿Quién te hace sentir acompañado? Escríbele. Si prefieres, primero escríbelo aquí.', '¿Quién te hace sentir acompañada? Escríbele. Si prefieres, primero escríbelo aquí.', '¿Con quién sientes compañía? Escríbele. Si prefieres, primero escríbelo aquí.'),
  'Escríbele a alguien de confianza, aunque sea un "hola, ando cansada".': variante('Escríbele a alguien de confianza, aunque sea un "hola, ando cansado".', 'Escríbele a alguien de confianza, aunque sea un "hola, ando cansada".', 'Escríbele a alguien de confianza, aunque sea un "hola, hoy siento cansancio".'),
  'Lo que sientes importa, y no tienes que pasarlo sola.': variante('Lo que sientes importa, y no tienes que pasarlo solo.', 'Lo que sientes importa, y no tienes que pasarlo sola.', 'Lo que sientes importa, y puedes buscar compañía para atravesarlo.'),
  'Cuando estoy cansada o estresada': variante('Cuando estoy cansado o estresado', 'Cuando estoy cansada o estresada', 'Cuando siento cansancio o estrés'),
  'Sentirme acompañada': variante('Sentirme acompañado', 'Sentirme acompañada', 'Sentir compañía'),
  'Estar más tranquila': variante('Estar más tranquilo', 'Estar más tranquila', 'Sentir más calma'),
};
