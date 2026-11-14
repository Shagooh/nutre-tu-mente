import Progreso from '../screens/Progreso';
import GuardiaDatos from '../components/GuardiaDatos';
import { useEstadoApp } from '../estado-app';
import { volver } from '../navegacion';

export default function ProgresoRoute() {
  const { datos, guardarEspacioMental } = useEstadoApp();
  return <GuardiaDatos><Progreso datos={datos} onEspacioMental={guardarEspacioMental} onVolver={() => volver('/perfil')} /></GuardiaDatos>;
}
