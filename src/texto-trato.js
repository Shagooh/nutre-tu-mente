import { VARIANTES_TRATO } from './content/trato';
import { tratoEfectivo } from './trato-personal';

// Usar solo con claves editoriales, nunca con nombres, notas o IDs almacenados.
export const textoConTrato = (texto, perfil) => VARIANTES_TRATO[texto]?.[tratoEfectivo(perfil)] ?? texto;
