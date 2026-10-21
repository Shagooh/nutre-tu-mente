// Lógica pura (sin Firebase) para fusionar los datos del teléfono con los de la nube.
// Regla de oro: nunca se pierde nada. Los registros se identifican por "id" y no se editan.

export const COLECCIONES = ['checkins', 'cuestas', 'mental'];

export const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const clave = (it) => `${it.fecha || ''} ${it.hora || ''} ${it.id}`;

// Elimina marcas internas (_s) y valores undefined, que Firestore no acepta.
export const limpiar = (obj) => {
  const { _s, ...resto } = obj;
  return JSON.parse(JSON.stringify(resto));
};

// Los registros antiguos (sin id) reciben un id estable, así no se duplican al sincronizar.
export function asegurarIds(d) {
  const salida = { ...d };
  COLECCIONES.forEach((col) => {
    salida[col] = (d[col] || []).map((it, i) =>
      it.id ? it : { ...it, id: `old-${it.fecha || 'x'}-${String(it.hora || '').replace(':', '')}-${i}` }
    );
  });
  return salida;
}

export const hayPendientes = (d) =>
  !!d.perfilSucio || COLECCIONES.some((col) => (d[col] || []).some((it) => !it._s));

// Marca perfil/lecciones/retornos como pendientes de subir.
export const tocarPerfil = () => ({ perfilActualizado: new Date().toISOString(), perfilSucio: true });

export function fusionar(local, remoto) {
  const salida = { ...local };

  COLECCIONES.forEach((col) => {
    const mapa = new Map();
    (local[col] || []).forEach((it) => mapa.set(it.id, it));
    (remoto[col] || []).forEach((it) => {
      const ya = mapa.get(it.id);
      mapa.set(it.id, { ...(ya || it), _s: true }); // lo que existe en la nube ya está sincronizado
    });
    salida[col] = [...mapa.values()].sort((a, b) => (clave(a) < clave(b) ? -1 : 1));
  });

  salida.lecciones = [...new Set([...(local.lecciones || []), ...(remoto.lecciones || [])])];
  salida.retornos = Math.max(local.retornos || 0, remoto.retornos || 0);

  // Perfil: gana el más reciente.
  const lt = local.perfilActualizado || '';
  const rt = remoto.perfilActualizado || '';
  const usaRemoto = !!remoto.perfil && (!local.perfil || rt > lt);
  if (usaRemoto) {
    salida.perfil = remoto.perfil;
    salida.perfilActualizado = rt;
  }
  const remotoLecciones = remoto.lecciones || [];
  const difiere =
    salida.lecciones.length !== remotoLecciones.length || salida.retornos !== (remoto.retornos || 0);
  const hayQueSubirPerfil = !usaRemoto && !!local.perfil && (!!local.perfilSucio || !remoto.perfil);
  salida.perfilSucio = hayQueSubirPerfil || (difiere && !!salida.perfil);

  return salida;
}

// Aplica el resultado de una sincronización sobre los datos ACTUALES (que pueden haber
// cambiado mientras se sincronizaba): marca lo subido y fusiona lo bajado.
export function aplicarSync(d, { remoto, subidos, perfilSubido }) {
  const marcado = { ...d };
  COLECCIONES.forEach((col) => {
    const ids = new Set(subidos[col] || []);
    marcado[col] = (d[col] || []).map((it) => (ids.has(it.id) ? { ...it, _s: true } : it));
  });
  if (perfilSubido && d.perfilActualizado === perfilSubido.perfilActualizado) {
    marcado.perfilSucio = false;
  }
  return fusionar(marcado, remoto);
}

// Al eliminar la cuenta, los datos locales quedan "sin nube": si luego crea otra cuenta,
// todo se vuelve a subir. Devuelve solo los campos que cambian.
export function desvincular(d) {
  const cambios = { cuentaUid: null, ultimaSync: null, perfilSucio: !!d.perfil };
  COLECCIONES.forEach((col) => {
    cambios[col] = (d[col] || []).map(({ _s, ...resto }) => resto);
  });
  return cambios;
}
