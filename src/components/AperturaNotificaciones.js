import { useEffect, useRef } from 'react';
import { router, useRootNavigationState } from 'expo-router';
import { useEstadoApp } from '../estado-app';
import { observarAperturas } from '../notifications';

export default function AperturaNotificaciones() {
  const { datos } = useEstadoApp();
  const navegacion = useRootNavigationState();
  const disponible = useRef(false);
  const pendiente = useRef(null);
  useEffect(() => observarAperturas((href) => {
    if (disponible.current) router.push(href); else pendiente.current = href;
  }), []);
  useEffect(() => {
    disponible.current = Boolean(navegacion?.key && datos.perfil && !datos.borrado);
    if (disponible.current && pendiente.current) {
      const href = pendiente.current;
      pendiente.current = null;
      router.push(href);
    }
  }, [navegacion?.key, datos.perfil, datos.borrado]);
  return null;
}
