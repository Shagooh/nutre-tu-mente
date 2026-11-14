import { router } from 'expo-router';
import { Boton, Pantalla, Texto, Titulo } from '../../components/ui';

export default function HerramientasRoute() {
  return <Pantalla><Titulo>Herramientas</Titulo><Texto suave style={{ marginBottom: 20 }}>Elige lo que necesitas ahora.</Texto>
    <Boton titulo="Me está costando" variante="acento" style={{ marginBottom: 12 }} onPress={() => router.push('/me-esta-costando')} />
    <Boton titulo="Pausa de 1 minuto" style={{ marginBottom: 12 }} onPress={() => router.push('/respira')} />
    <Boton titulo="Hacer mi check-in" variante="suave" onPress={() => router.push('/check-in')} />
  </Pantalla>;
}
