import { createContext, useContext } from 'react';

export const EstadoApp = createContext(null);
export function useEstadoApp() {
  const estado = useContext(EstadoApp);
  if (!estado) throw new Error('app/provider-required');
  return estado;
}
