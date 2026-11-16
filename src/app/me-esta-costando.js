import MeCuesta from '../screens/MeCuesta';
import { useEstadoApp } from '../estado-app';
import GuardiaDatos from '../components/GuardiaDatos';
import { volver } from '../navegacion';

export default function MeCuestaRoute() {
  const { guardarCuesta } = useEstadoApp();
  return <GuardiaDatos><MeCuesta onGuardar={guardarCuesta} onCerrar={volver} /></GuardiaDatos>;
}
