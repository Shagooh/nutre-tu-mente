import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { useEstadoApp } from '../estado-app';
import { Boton } from './ui';

// No permite usar un enlace directo para saltarse un borrado pendiente.
export default function GuardiaDatos({ children, cuenta = false }) {
  const { datos, usuario, borrar, recuperarCopiaLocal } = useEstadoApp();
  if (!datos?.borrado || cuenta) return children;
  return <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
    <Text>Hay un borrado pendiente. Tus datos no se sincronizarán hasta terminarlo.</Text>
    {datos.borrado.tipo === 'cuenta' ? <Link href="/cuenta" accessibilityRole="button">Reanudar borrado de cuenta</Link>
      : <Boton titulo="Reanudar borrado" onPress={() => borrar().catch(() => { /* La barrera durable conserva el estado visible. */ })} />}
    {!usuario && datos.borrado.tipo === 'cuenta' && datos.borrado.fase === 'local' ? <>
      <Text>La copia remota ya se borró. Puedes conservar la copia local sin vincularla y revisar después el estado de tu cuenta.</Text>
      <Boton titulo="Conservar copia local y revisar cuenta después" onPress={() => recuperarCopiaLocal().catch(() => { /* El aviso global muestra el fallo de disco. */ })} />
    </> : null}
  </View>;
}
