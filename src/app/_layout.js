import { Stack } from 'expo-router';
import App from '../../App';
import { useEstadoApp } from '../estado-app';
import AperturaNotificaciones from '../components/AperturaNotificaciones';

export const unstable_settings = { initialRouteName: '(tabs)' };
function Navegador() {
  const { datos } = useEstadoApp();
  return <>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={Boolean(datos.perfil)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="check-in" />
        <Stack.Screen name="me-esta-costando" />
        <Stack.Screen name="respira" />
        <Stack.Screen name="progreso" />
        <Stack.Screen name="bosque" />
        <Stack.Screen name="leccion/[id]" />
      </Stack.Protected>
      <Stack.Protected guard={!datos.perfil}>
        <Stack.Screen name="bienvenida" />
      </Stack.Protected>
      <Stack.Screen name="cuenta" />
    </Stack>
    <AperturaNotificaciones />
  </>;
}
export default function RootLayout() { return <App><Navegador /></App>; }
