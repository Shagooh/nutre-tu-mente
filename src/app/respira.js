import Pausa from '../screens/Pausa';
import GuardiaDatos from '../components/GuardiaDatos';
import { volver } from '../navegacion';

export default function RespiraRoute() { return <GuardiaDatos><Pausa onCerrar={volver} /></GuardiaDatos>; }
