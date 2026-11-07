import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { asegurarIds, tocarPerfil } from './fusion';
import { diasDesde, hoyISO } from './logic';
import { crearPersistencia } from './persistencia';

const KEY = 'nutre-tu-mente:v1';
export const datosVacios = () => ({
  perfil: null, checkins: [], cuestas: [], lecciones: [], mental: [], retornos: 0,
  ultimaVisita: null, cuentaUid: null, ultimaSync: null, perfilActualizado: null,
  perfilSucio: false, perfilBase: null, perfilRevision: 0, borrado: null,
  requiereVincular: false, nubeGeneracion: null,
});
export function prepararDatos(value) {
  if (value !== null && (typeof value !== 'object' || Array.isArray(value))) throw new Error('storage/invalid');
  const d = { ...datosVacios(), ...value };
  for (const col of ['checkins', 'cuestas', 'lecciones', 'mental']) {
    if (!Array.isArray(d[col])) throw new Error('storage/invalid');
  }
  if (d.perfil !== null && (typeof d.perfil !== 'object' || !Array.isArray(d.perfil.recordatorios))) throw new Error('storage/invalid');
  if (d.perfil && !d.cuentaUid && !d.requiereVincular) Object.assign(d, tocarPerfil());
  return asegurarIds(d);
}
export function useStore() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [vuelve, setVuelve] = useState(false);
  const [persistencia] = useState(() => crearPersistencia(AsyncStorage, KEY, prepararDatos));
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
