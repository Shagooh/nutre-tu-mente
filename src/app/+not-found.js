import { Link } from 'expo-router';
import { Pantalla, Texto, Titulo } from '../components/ui';

export default function RutaNoEncontrada() {
  return <Pantalla><Titulo>No encontramos esta pantalla</Titulo><Texto>Puedes volver al inicio.</Texto><Link href="/">Ir a Inicio</Link></Pantalla>;
}
