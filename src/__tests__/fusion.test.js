import { aplicarSync, asegurarIds, desvincular, fusionar, hayPendientes, limpiar, nuevoId, tocarPerfil } from '../fusion';
import { correoValido, mensajeError } from '../errores';

const base = () => ({
  perfil: null,
  perfilActualizado: null,
  perfilSucio: false,
  checkins: [],
  cuestas: [],
  mental: [],
  lecciones: [],
  retornos: 0,
});

const chk = (id, fecha = '2026-10-01', hora = '10:00') => ({ id, fecha, hora, animo: 3 });

describe('ids', () => {
  test('nuevoId genera ids distintos', () => {
    const ids = new Set(Array.from({ length: 200 }, nuevoId));
    expect(ids.size).toBe(200);
  });

  test('los registros antiguos reciben un id estable', () => {
    const d = { ...base(), checkins: [{ fecha: '2026-10-01', hora: '09:30', animo: 4 }] };
    const a = asegurarIds(d).checkins[0].id;
    expect(a).toBe(asegurarIds(d).checkins[0].id);
    expect(a).toMatch(/^old-2026-10-01-0930-0$/);
  });

  test('no cambia un id que ya existe', () => {
    const d = { ...base(), checkins: [chk('abc')] };
    expect(asegurarIds(d).checkins[0].id).toBe('abc');
  });
});

describe('limpiar', () => {
  test('quita _s y valores undefined (Firestore no los acepta)', () => {
    expect(limpiar({ id: 'a', _s: true, x: undefined, y: 2 })).toEqual({ id: 'a', y: 2 });
  });
});

describe('fusionar', () => {
  test('une registros locales y remotos sin duplicar', () => {
    const local = { ...base(), checkins: [chk('a'), chk('b', '2026-10-02')] };
    const remoto = { checkins: [chk('b', '2026-10-02'), chk('c', '2026-10-03')] };
    const r = fusionar(local, remoto);
    expect(r.checkins.map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  test('lo que existe en la nube queda marcado como sincronizado; lo local nuevo no', () => {
    const local = { ...base(), checkins: [chk('a'), chk('b', '2026-10-02')] };
    const r = fusionar(local, { checkins: [chk('b', '2026-10-02')] });
    expect(r.checkins.find((x) => x.id === 'a')._s).toBeUndefined();
    expect(r.checkins.find((x) => x.id === 'b')._s).toBe(true);
  });

  test('nunca pierde registros locales', () => {
    const local = { ...base(), cuestas: [{ id: 'x', fecha: '2026-10-01' }] };
    expect(fusionar(local, { cuestas: [] }).cuestas).toHaveLength(1);
  });

  test('las lecciones se unen y los retornos toman el mayor', () => {
    const local = { ...base(), lecciones: ['a', 'b'], retornos: 1 };
    const r = fusionar(local, { lecciones: ['b', 'c'], retornos: 3 });
    expect(r.lecciones.sort()).toEqual(['a', 'b', 'c']);
    expect(r.retornos).toBe(3);
  });

  test('en un teléfono nuevo, el perfil llega de la nube', () => {
    const r = fusionar(base(), { perfil: { nombre: 'Fer' }, perfilActualizado: '2026-10-01T00:00:00Z', lecciones: [], retornos: 0 });
    expect(r.perfil.nombre).toBe('Fer');
    expect(r.perfilSucio).toBe(false);
  });

  test('gana el perfil más reciente', () => {
    const local = { ...base(), perfil: { nombre: 'Local' }, perfilActualizado: '2026-10-05T00:00:00Z', perfilSucio: true };
    const remoto = { perfil: { nombre: 'Nube' }, perfilActualizado: '2026-10-01T00:00:00Z' };
    const r = fusionar(local, remoto);
    expect(r.perfil.nombre).toBe('Local');
    expect(r.perfilSucio).toBe(true);

    const local2 = { ...local, perfilActualizado: '2026-09-01T00:00:00Z' };
    expect(fusionar(local2, remoto).perfil.nombre).toBe('Nube');
  });

  test('una cuenta nueva (sin datos en la nube) sube el perfil local', () => {
    const local = { ...base(), perfil: { nombre: 'Fer' }, perfilActualizado: '2026-10-01T00:00:00Z' };
    expect(fusionar(local, {}).perfilSucio).toBe(true);
  });
});

describe('aplicarSync', () => {
  test('marca como sincronizado lo subido y conserva lo agregado mientras se sincronizaba', () => {
    const d = { ...base(), checkins: [chk('a'), chk('nuevo-durante-sync')] };
    const r = aplicarSync(d, { remoto: { checkins: [chk('a')] }, subidos: { checkins: ['a'] }, perfilSubido: null });
    expect(r.checkins.find((x) => x.id === 'a')._s).toBe(true);
    expect(r.checkins.find((x) => x.id === 'nuevo-durante-sync')._s).toBeUndefined();
    expect(hayPendientes(r)).toBe(true);
  });

  test('si todo se subió, ya no hay pendientes', () => {
    const d = { ...base(), checkins: [chk('a')] };
    const r = aplicarSync(d, { remoto: { checkins: [chk('a')] }, subidos: { checkins: ['a'] }, perfilSubido: null });
    expect(hayPendientes(r)).toBe(false);
  });

  test('si el perfil cambió durante la sincronización, sigue pendiente', () => {
    const d = { ...base(), perfil: { nombre: 'Fer' }, perfilActualizado: 'T2', perfilSucio: true };
    const r = aplicarSync(d, { remoto: { perfil: { nombre: 'Fer' }, perfilActualizado: 'T1', lecciones: [], retornos: 0 }, subidos: {}, perfilSubido: { perfilActualizado: 'T1' } });
    expect(r.perfilSucio).toBe(true);
  });

  test('si el perfil subido sigue siendo el actual, queda sincronizado', () => {
    const d = { ...base(), perfil: { nombre: 'Fer' }, perfilActualizado: 'T1', perfilSucio: true };
    const r = aplicarSync(d, { remoto: { perfil: { nombre: 'Fer' }, perfilActualizado: 'T1', lecciones: [], retornos: 0 }, subidos: {}, perfilSubido: { perfilActualizado: 'T1' } });
    expect(r.perfilSucio).toBe(false);
  });
});

describe('tocarPerfil', () => {
  test('marca el perfil como pendiente con una fecha nueva', () => {
    const t = tocarPerfil();
    expect(t.perfilSucio).toBe(true);
    expect(new Date(t.perfilActualizado).toString()).not.toBe('Invalid Date');
  });
});

describe('mensajes de error', () => {
  test('no revela si un correo existe', () => {
    const a = mensajeError({ code: 'auth/user-not-found' });
    const b = mensajeError({ code: 'auth/wrong-password' });
    expect(a).toBe(b);
  });

  test('un error desconocido devuelve un mensaje amable', () => {
    expect(mensajeError({ code: 'otra-cosa' })).toMatch(/Inténtalo/);
    expect(mensajeError(undefined)).toMatch(/Inténtalo/);
  });

  test('reconoce el código de clave inválida aunque Firebase le añada texto', () => {
    expect(mensajeError({ code: 'auth/api-key-not-valid.-please-pass-a-valid-api-key.' })).toMatch(/configuración/);
  });

  test('valida correos', () => {
    expect(correoValido('a@b.cl')).toBe(true);
    expect(correoValido('a@b')).toBe(false);
    expect(correoValido('')).toBe(false);
  });
});

describe('desvincular', () => {
  test('después de eliminar la cuenta, todo vuelve a quedar pendiente de subir', () => {
    const d = {
      ...base(),
      perfil: { nombre: 'Fer' },
      cuentaUid: 'u1',
      ultimaSync: 123,
      checkins: [{ ...chk('a'), _s: true }],
    };
    const r = { ...d, ...desvincular(d) };
    expect(r.cuentaUid).toBeNull();
    expect(r.ultimaSync).toBeNull();
    expect(r.checkins[0]._s).toBeUndefined();
    expect(hayPendientes(r)).toBe(true);
  });
});
