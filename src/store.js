import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { asegurarIds, tocarPerfil } from './fusion';
import { diasDesde, hoyISO } from './logic';

const KEY = 'nutre-tu-mente:v1';

export const datosVacios = () => ({
  perfil: null,
  checkins: [],
  cuestas: [],
  lecciones: [],
  mental: [],
  retornos: 0,
  ultimaVisita: null,
  // --- sincronización con la nube (solo si la persona crea una cuenta) ---
  cuentaUid: null, // a qué cuenta pertenecen estos datos
  ultimaSync: null,
  perfilActualizado: null,
  perfilSucio: false,
});

export function useStore() {
  const [datos, setDatos] = useState(null);
  const [vuelve, setVuelve] = useState(false);
  const listo = useRef(false);

  useEffect(() => {
    (async () => {
      let d = datosVacios();
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) d = { ...d, ...JSON.parse(raw) };
      } catch (e) {}
      d = asegurarIds(d); // los registros de versiones anteriores reciben un id
      // Volver después de unos días no se castiga: solo se celebra.
      if (d.perfil && diasDesde(d.ultimaVisita) >= 3) {
        d.retornos += 1;
        Object.assign(d, tocarPerfil());
        setVuelve(true);
      }
      d.ultimaVisita = hoyISO();
      listo.current = true;
      setDatos(d);
    })();
  }, []);

  useEffect(() => {
    if (!listo.current || !datos) return;
    AsyncStorage.setItem(KEY, JSON.stringify(datos)).catch(() => {});
  }, [datos]);

  const actualizar = useCallback((fn) => setDatos((d) => ({ ...d, ...fn(d) })), []);

  const borrarTodo = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (e) {}
    setVuelve(false);
    setDatos({ ...datosVacios(), ultimaVisita: hoyISO() });
  }, []);

  return { datos, actualizar, borrarTodo, vuelve, cerrarVuelve: () => setVuelve(false) };
}
