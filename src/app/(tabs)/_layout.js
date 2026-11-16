import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GuardiaDatos from '../../components/GuardiaDatos';
import { color } from '../../theme';

const icono = (texto) => function Icono({ color: tinta }) { return <Text style={{ color: tinta, fontSize: 22 }}>{texto}</Text>; };
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return <GuardiaDatos><Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: color.primario, tabBarInactiveTintColor: color.suave,
    tabBarStyle: { height: 72 + insets.bottom, paddingTop: 8, paddingBottom: Math.max(8, insets.bottom) } }}>
    <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarAccessibilityLabel: 'Inicio', tabBarIcon: icono('🌿') }} />
    <Tabs.Screen name="herramientas" options={{ title: 'Herramientas', tabBarAccessibilityLabel: 'Herramientas', tabBarIcon: icono('🤍') }} />
    <Tabs.Screen name="aprende" options={{ title: 'Aprende', tabBarAccessibilityLabel: 'Aprende', tabBarIcon: icono('📖') }} />
    <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarAccessibilityLabel: 'Perfil', tabBarIcon: icono('⚙️') }} />
  </Tabs></GuardiaDatos>;
}
