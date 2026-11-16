export const conflicto = (code = 'sync/conflict') => Object.assign(new Error(code), { code });
export function canonico(value) {
  if (Array.isArray(value)) return `[${value.map(canonico).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonico(value[k])}`).join(',')}}`;
  return JSON.stringify(value);
}
export const iguales = (a, b) => canonico(a) === canonico(b);

// Fusionar tres versiones por campo, nunca decidir por reloj del teléfono.
export function fusionarPerfil(base, local, remoto) {
  if (!remoto) return local;
  if (!base) {
    if (iguales(local, remoto)) return local;
    throw conflicto('sync/profile-conflict');
  }
  const salida = { ...remoto };
  for (const key of new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remoto)])) {
    const cambiaLocal = !iguales(base[key], local[key]);
    const cambiaRemoto = !iguales(base[key], remoto[key]);
    if (cambiaLocal && cambiaRemoto && !iguales(local[key], remoto[key])) throw conflicto('sync/profile-conflict');
    if (cambiaLocal) salida[key] = local[key];
  }
  return salida;
}
