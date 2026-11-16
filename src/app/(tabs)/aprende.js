import { router } from 'expo-router';
import Lecciones from '../../screens/Lecciones';
import { useEstadoApp } from '../../estado-app';

export default function AprendeRoute() {
  const { datos, marcarLeida } = useEstadoApp();
  return <Lecciones datos={datos} onLeida={marcarLeida} onAbrir={(id) => router.push({ pathname: '/leccion/[id]', params: { id } })} />;
}
