import { router } from 'expo-router';
import CheckIn from '../screens/CheckIn';
import { useEstadoApp } from '../estado-app';
import GuardiaDatos from '../components/GuardiaDatos';
import { volver } from '../navegacion';

export default function CheckInRoute() {
  const { guardarCheckin } = useEstadoApp();
  return <GuardiaDatos><CheckIn onGuardar={guardarCheckin} onCerrar={volver} onAbrirCuidado={(href) => router.push(href)} /></GuardiaDatos>;
}
