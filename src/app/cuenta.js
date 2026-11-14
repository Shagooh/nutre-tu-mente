import Cuenta from '../screens/Cuenta';
import GuardiaDatos from '../components/GuardiaDatos';
import { useEstadoApp } from '../estado-app';
import { volver } from '../navegacion';

export default function CuentaRoute() {
  const e = useEstadoApp();
  return <GuardiaDatos cuenta><Cuenta usuario={e.usuario} estadoSync={e.estadoSync} conflicto={e.conflicto}
    onCerrar={volver} onSalir={e.cerrarSesion} onSincronizar={e.sincronizarAhora} onEliminar={e.eliminarCuenta}
    onVincular={e.vincular} onUsarPerfilNube={e.usarPerfilNube} /></GuardiaDatos>;
}
