import { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from './src/store';
import { hoyISO } from './src/logic';
import { cancelarRecordatorios, programarRecordatorios } from './src/notifications';
import { color } from './src/theme';
import Onboarding from './src/screens/Onboarding';
import Hoy from './src/screens/Hoy';
import CheckIn from './src/screens/CheckIn';
import MeCuesta from './src/screens/MeCuesta';
import Pausa from './src/screens/Pausa';
import Lecciones from './src/screens/Lecciones';
import Progreso from './src/screens/Progreso';
import Ajustes from './src/screens/Ajustes';

const TABS = [
  { id: 'hoy', emoji: '🌿', texto: 'Hoy' },
  { id: 'lecciones', emoji: '📖', texto: 'Lecciones' },
  { id: 'progreso', emoji: '🌸', texto: 'Progreso' },
  { id: 'ajustes', emoji: '⚙️', texto: 'Ajustes' },
];

export default function App() {
  const { datos, actualizar, borrarTodo, vuelve, cerrarVuelve } = useStore();
  const [tab, setTab] = useState('hoy');
  const [modal, setModal] = useState(null); // 'checkin' | 'cuesta' | 'pausa'
  const [leccionAbierta, setLeccionAbierta] = useState(null);

  // El botón "atrás" de Android cierra los flujos en vez de salir de la app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (modal) {
        setModal(null);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [modal]);

  if (!datos) {
    return (
      <View style={s.cargando}>
        <ActivityIndicator color={color.primario} />
      </View>
    );
  }

  const terminarOnboarding = (perfil, espacio) => {
    actualizar(() => ({ perfil, mental: [{ fecha: hoyISO(), valor: espacio }] }));
    programarRecordatorios(perfil.recordatorios);
  };

  const cambiarPerfil = (cambios) => actualizar((d) => ({ perfil: { ...d.perfil, ...cambios } }));

  const cambiarRecordatorios = (recordatorios) => {
    cambiarPerfil({ recordatorios });
    programarRecordatorios(recordatorios);
  };

  const borrar = async () => {
    await cancelarRecordatorios();
    await borrarTodo();
    setTab('hoy');
  };

  let contenido;
  if (!datos.perfil) {
    contenido = <Onboarding onTerminar={terminarOnboarding} />;
  } else if (modal === 'checkin') {
    contenido = (
      <CheckIn
        onGuardar={(c) => actualizar((d) => ({ checkins: [...d.checkins, c] }))}
        onCerrar={() => setModal(null)}
      />
    );
  } else if (modal === 'cuesta') {
    contenido = (
      <MeCuesta
        onGuardar={(c) => actualizar((d) => ({ cuestas: [...d.cuestas, c] }))}
        onCerrar={() => setModal(null)}
      />
    );
  } else if (modal === 'pausa') {
    contenido = <Pausa onCerrar={() => setModal(null)} />;
  } else {
    contenido = (
      <View style={{ flex: 1 }}>
        {tab === 'hoy' && (
          <Hoy
            datos={datos}
            vuelve={vuelve}
            onCerrarVuelve={cerrarVuelve}
            onAbrir={setModal}
            onIrALecciones={(id) => {
              setLeccionAbierta(id);
              setTab('lecciones');
            }}
          />
        )}
        {tab === 'lecciones' && (
          <Lecciones
            datos={datos}
            abrirId={leccionAbierta}
            onLeida={(id) =>
              actualizar((d) => (d.lecciones.includes(id) ? {} : { lecciones: [...d.lecciones, id] }))
            }
          />
        )}
        {tab === 'progreso' && (
          <Progreso
            datos={datos}
            onEspacioMental={(valor) =>
              actualizar((d) => ({ mental: [...d.mental, { fecha: hoyISO(), valor }] }))
            }
          />
        )}
        {tab === 'ajustes' && (
          <Ajustes
            perfil={datos.perfil}
            onCambiarPerfil={cambiarPerfil}
            onCambiarRecordatorios={cambiarRecordatorios}
            onBorrar={borrar}
          />
        )}
        <SafeAreaView edges={['bottom']} style={s.barra}>
          <View style={s.tabs}>
            {TABS.map((t) => (
              <Pressable
                key={t.id}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === t.id }}
                onPress={() => {
                  if (t.id !== 'lecciones') setLeccionAbierta(null);
                  setTab(t.id);
                }}
                style={s.tab}
              >
                <Text style={[s.tabEmoji, tab !== t.id && { opacity: 0.45 }]}>{t.emoji}</Text>
                <Text style={[s.tabTexto, tab === t.id && s.tabTextoOn]}>{t.texto}</Text>
              </Pressable>
            ))}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={{ flex: 1, backgroundColor: color.fondo }}>{contenido}</View>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  cargando: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.fondo },
  barra: { backgroundColor: color.tarjeta, borderTopWidth: 1, borderTopColor: color.borde },
  tabs: { flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabEmoji: { fontSize: 22 },
  tabTexto: { fontSize: 12, color: color.suave, marginTop: 2 },
  tabTextoOn: { color: color.primario, fontWeight: '700' },
});
