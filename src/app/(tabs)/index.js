import { router } from 'expo-router';
import Hoy from '../../screens/Hoy';
import { useEstadoApp } from '../../estado-app';
import { nubeActiva } from '../../firebase';
import { abrirFlujo } from '../../navegacion';

export default function InicioRoute() {
  const estado = useEstadoApp();
  return <Hoy datos={estado.datos} vuelve={estado.vuelve} usuario={estado.usuario} nubeActiva={nubeActiva}
    onCerrarVuelve={estado.cerrarVuelve} onAbrir={abrirFlujo}
    onIrALecciones={(id) => router.push({ pathname: '/leccion/[id]', params: { id } })} />;
}
