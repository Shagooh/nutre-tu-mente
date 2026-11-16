import { router } from 'expo-router';
import Ajustes from '../../screens/Ajustes';
import { useEstadoApp } from '../../estado-app';
import { nubeActiva } from '../../firebase';

export default function PerfilRoute() {
  const e = useEstadoApp();
  return <Ajustes perfil={e.datos.perfil} nubeActiva={nubeActiva} usuario={e.usuario}
    onAbrirCuenta={() => router.push('/cuenta')} onVerProgreso={() => router.push('/progreso')}
    onCambiarPerfil={e.cambiarPerfil} onCambiarRecordatorios={e.cambiarRecordatorios} onBorrar={e.borrar} />;
}
