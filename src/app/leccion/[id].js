import { router, useLocalSearchParams } from 'expo-router';
import Lecciones from '../../screens/Lecciones';
import GuardiaDatos from '../../components/GuardiaDatos';
import { useEstadoApp } from '../../estado-app';
import { volver } from '../../navegacion';

export default function LeccionRoute() {
  const { id } = useLocalSearchParams();
  const { datos, marcarLeida } = useEstadoApp();
  return <GuardiaDatos><Lecciones datos={datos} abrirId={typeof id === 'string' ? id : 'invalida'}
    onLeida={marcarLeida} onVolver={() => volver('/aprende')}
    onAbrir={(nuevoId) => router.push({ pathname: '/leccion/[id]', params: { id: nuevoId } })} /></GuardiaDatos>;
}
