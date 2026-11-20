// Preferencia lingüística, nunca inferida del nombre o de otros datos personales.
export const OPCIONES_TRATO = [
  { id: 'masculino', texto: 'Él' },
  { id: 'femenino', texto: 'Ella' },
  { id: 'neutro', texto: 'Neutro' },
];
export const tratoValido = (valor) => OPCIONES_TRATO.some((o) => o.id === valor);
export function tratoElegido(perfil) {
  if (perfil && Object.hasOwn(perfil, 'trato')) return tratoValido(perfil.trato) ? perfil.trato : null;
  const legado = perfil?.incorporacion?.preferencias?.['pref-1']?.[0];
  return tratoValido(legado) ? legado : null;
}
export const tratoEfectivo = (perfil) => tratoElegido(perfil) || 'neutro';
export function normalizarTrato(perfil) {
  if (!perfil || !Object.hasOwn(perfil, 'trato') || tratoValido(perfil.trato)) return perfil;
  const { trato, ...resto } = perfil;
  return resto;
}
export function cambiarTrato(perfil, cambios) {
  if (Object.hasOwn(cambios, 'trato') && !tratoValido(cambios.trato)) throw new Error('perfil/trato-invalido');
  const siguiente = { ...normalizarTrato(perfil), ...cambios };
  if (perfil?.incorporacion && tratoValido(cambios.trato)) {
    siguiente.incorporacion = { ...perfil.incorporacion, preferencias: {
      ...perfil.incorporacion.preferencias, 'pref-1': [cambios.trato],
    } };
  }
  return siguiente;
}
