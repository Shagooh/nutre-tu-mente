import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { asegurarIds, nuevoId, tocarPerfil } from './fusion';
import { identidadBosqueValida, migrarCalendario } from './contrato-bosque';
import { diasDesde, hoyISO } from './logic';
import { crearPersistencia } from './persistencia';
import { revisionDiagnostico } from './modo-revision';

const KEY = 'nutre-tu-mente:v1';
export const datosVacios = () => ({
  versionAlmacen: 1,
  perfil: null, checkins: [], cuestas: [], lecciones: [], mental: [], retornos: 0,
  ultimaVisita: null, cuentaUid: null, ultimaSync: null, perfilActualizado: null,
  perfilSucio: false, perfilBase: null, perfilRevision: 0, borrado: null,
  requiereVincular: false, nubeGeneracion: null,
  bosqueId: nuevoId(),
});
export function prepararDatos(value) {
  if (value !== null && (typeof value !== 'object' || Array.isArray(value))) throw new Error('storage/invalid');
  if (value && Object.hasOwn(value, 'versionAlmacen') && value.versionAlmacen !== 1) throw new Error('storage/version');
  const d = { ...datosVacios(), ...value };
  if (!identidadBosqueValida(d.bosqueId)) throw new Error('storage/invalid');
  for (const col of ['checkins', 'cuestas', 'lecciones', 'mental']) {
    if (!Array.isArray(d[col])) throw new Error('storage/invalid');
  }
  if (d.perfil !== null && (typeof d.perfil !== 'object' || !Array.isArray(d.perfil.recordatorios))) throw new Error('storage/invalid');
  // El formato persistido admite perfiles históricos. El perfil V1 solo vive en la revisión.
  if (d.perfil && ('incorporacion' in d.perfil || 'schemaVersion' in d.perfil)) throw new Error('storage/version');
  if (d.perfil && !d.cuentaUid && !d.requiereVincular && !d.perfilOperacion) Object.assign(d, tocarPerfil());
  const conIds = asegurarIds(d);
  return { ...conIds, checkins: conIds.checkins.map(migrarCalendario) };
}
export function useStore() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [vuelve, setVuelve] = useState(false);
  const [persistencia] = useState(() => crearPersistencia(
    revisionDiagnostico ? { getItem: async () => null, setItem: async () => {} } : AsyncStorage,
    KEY, prepararDatos));
  const cargar = useCallback(async () => {
    setError(null);
    try {
      const d = await persistencia.cargar();
      const retorno = d.perfil && diasDesde(d.ultimaVisita) >= 3;
      await persistencia.actualizar(() => ({
        ultimaVisita: hoyISO(),
        ...(retorno ? { retornos: d.retornos + 1, ...tocarPerfil() } : {}),
      }));
      setVuelve(Boolean(retorno));
    } catch {
      setError('No pudimos recuperar o guardar tus datos. Tu copia se conserva. Intenta otra vez.');
    }
  }, [persistencia]);
  useEffect(() => {
    const quitar = persistencia.escuchar(setDatos);
    void Promise.resolve().then(cargar);
    return quitar;
  }, [cargar, persistencia]);
  const actualizar = useCallback((fn, vigente, reemplazar = false) => {
    const tarea = persistencia.actualizar(fn, vigente, reemplazar).then((res) => {
      setError(null);
      return res;
    }, (e) => {
      setError('No pudimos guardar el cambio. Tus datos anteriores se conservan. Intenta otra vez.');
      throw e;
    });
    // Los formularios esperan esta promesa. Ajustes y otras acciones que no
    // esperan siguen recibiendo el fallo mediante el aviso global.
    tarea.catch(() => { /* El aviso global conserva el error visible. */ });
    return tarea;
  }, [persistencia]);
  const borrarTodo = useCallback(async () => {
    await actualizar(() => ({ ...datosVacios(), ultimaVisita: hoyISO() }), undefined, true);
    setVuelve(false);
  }, [actualizar]);
  return { datos, actualizar, borrarTodo, vuelve, error, reintentar: cargar, leerActual: persistencia.leerActual, cerrarVuelve: () => setVuelve(false) };
}
