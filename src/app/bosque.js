import { router } from 'expo-router';
import { useEstadoApp } from '../estado-app';
import GuardiaDatos from '../components/GuardiaDatos';
import RobleMensual from '../components/RobleMensual';
import Planta from '../components/Planta';
import { Boton, Pantalla, Texto, Titulo } from '../components/ui';
import { puntos } from '../logic';
import { volver } from '../navegacion';

export default function BosqueRoute() {
  const { datos } = useEstadoApp();
  return <GuardiaDatos><Pantalla>
    <Boton titulo="Volver" variante="texto" onPress={volver} />
    <Titulo>Mi bosque</Titulo>
    {datos.perfil.flor === 'roble' ? <>
      <Texto suave>Roble de prueba · diseño provisional</Texto>
      <RobleMensual key={datos.bosqueId} bosqueId={datos.bosqueId} checkins={datos.checkins} grande archivo onAbrirCuidado={(href) => router.push(href)} />
    </> : <>
      <Planta flor={datos.perfil.flor} pts={puntos(datos)} grande />
      <Texto>Tu elección anterior se conserva. El bosque mensual está disponible para el roble de prueba.</Texto>
    </>}
  </Pantalla></GuardiaDatos>;
}
