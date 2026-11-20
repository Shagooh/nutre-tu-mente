import { useContext } from 'react';
import { EstadoApp } from './estado-app';
import { textoConTrato } from './texto-trato';

export function useTrato(perfil) {
  const estado = useContext(EstadoApp);
  const actual = perfil ?? estado?.datos?.perfil;
  return (texto) => textoConTrato(texto, actual);
}
