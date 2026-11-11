import { useEffect, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from './src/store';
import { hoyISO } from './src/logic';
import { nuevoId, tocarPerfil } from './src/fusion';
import { useNube } from './src/useNube';
import { nubeActiva } from './src/firebase';


import { programarRecordatorios } from './src/notifications';
import { detenerReportes, iniciarReportes } from './src/reportes';
import { color } from './src/theme';
import Onboarding from './src/screens/Onboarding';
import Hoy from './src/screens/Hoy';
import CheckIn from './src/screens/CheckIn';
import MeCuesta from './src/screens/MeCuesta';
import Pausa from './src/screens/Pausa';
import Lecciones from './src/screens/Lecciones';
import Progreso from './src/screens/Progreso';
import Ajustes from './src/screens/Ajustes';
import Cuenta from './src/screens/Cuenta';
import * as Sentry from '@sentry/react-native';

const TABS = [
  { id: 'hoy', emoji: '🌿', texto: 'Hoy' },
  { id: 'lecciones', emoji: '📖', texto: 'Lecciones' },
  { id: 'progreso', emoji: '🌸', texto: 'Progreso' },
  { id: 'ajustes', emoji: '⚙️', texto: 'Ajustes' },
];

export default Sentry.wrap(function App() {
  const store = useStore();
  const { datos, actualizar, vuelve, cerrarVuelve, error, reintentar } = store;
  const { usuario, estadoSync, conflicto, sincronizarAhora, cerrarSesion, vincular, usarPerfilNube, recuperarCopiaLocal, borrar, eliminarCuenta } = useNube(store);
  const [tab, setTab] = useState('hoy');
  const [modal, setModal] = useState(null); // 'checkin' | 'cuesta' | 'pausa' | 'cuenta'
  const [leccionAbierta, setLeccionAbierta] = useState(null);

  // Los recordatorios se programan siempre que cambian (también si llegan desde la nube).
  const claveRecordatorios = datos && datos.perfil ? JSON.stringify(datos.perfil.recordatorios) : '';
  useEffect(() => {
    if (claveRecordatorios) programarRecordatorios(JSON.parse(claveRecordatorios));
  }, [claveRecordatorios]);

  // El reporte de errores solo funciona mientras exista el consentimiento; al borrar los datos se detiene.
  const consentido = Boolean(datos && datos.perfil && datos.perfil.consentimiento);
  useEffect(() => {
    if (consentido) iniciarReportes();
    else detenerReportes();
  }, [consentido]);

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
        {error ? <><Text accessibilityRole="alert">{error}</Text><Pressable onPress={reintentar}><Text>Reintentar</Text></Pressable></> : null}
      </View>
    );
  }

  const terminarOnboarding = (perfil, espacio) => {
    return actualizar(() => ({
      perfil,
      mental: [{ id: nuevoId(), fecha: hoyISO(), valor: espacio }],
      ...tocarPerfil(),
    }));
  };

  const cambiarPerfil = (cambios) =>
    actualizar((d) => ({ perfil: { ...d.perfil, ...cambios }, ...tocarPerfil() }));

  const cambiarRecordatorios = (recordatorios) => cambiarPerfil({ recordatorios });

  let contenido;
  if (modal === 'cuenta') {
    contenido = (
      <Cuenta
        usuario={usuario}
        estadoSync={estadoSync}
        conflicto={conflicto}
        onCerrar={() => setModal(null)}
        onSalir={cerrarSesion}
        onVincular={vincular}
        onUsarPerfilNube={usarPerfilNube}
        onSincronizar={sincronizarAhora}
        onEliminar={eliminarCuenta}
      />
    );
  } else if (!datos.perfil) {
    contenido = (
      <Onboarding
        onTerminar={terminarOnboarding}
        nubeActiva={nubeActiva}
        onTengoCuenta={() => setModal('cuenta')}
      />
    );
  } else if (modal === 'checkin') {
    contenido = (
      <CheckIn
        onGuardar={(c) => actualizar((d) => ({ checkins: [...d.checkins, { ...c, id: nuevoId() }] }))}
        onCerrar={() => setModal(null)}
      />
    );
  } else if (modal === 'cuesta') {
    contenido = (
      <MeCuesta
        onGuardar={(c) => actualizar((d) => ({ cuestas: [...d.cuestas, { ...c, id: nuevoId() }] }))}
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
            nubeActiva={nubeActiva}
            usuario={usuario}
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
              actualizar((d) =>
                d.lecciones.includes(id) ? {} : { lecciones: [...d.lecciones, id], ...tocarPerfil() }
              )
            }
          />
        )}
        {tab === 'progreso' && (
          <Progreso
            datos={datos}
            onEspacioMental={(valor) =>
              actualizar((d) => ({ mental: [...d.mental, { id: nuevoId(), fecha: hoyISO(), valor }] }))
            }
          />
        )}
        {tab === 'ajustes' && (
          <Ajustes
            perfil={datos.perfil}
            nubeActiva={nubeActiva}
            usuario={usuario}
            onAbrirCuenta={() => setModal('cuenta')}
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
      <View style={{ flex: 1, backgroundColor: color.fondo }}>
        {error ? <Text accessibilityRole="alert">{error}</Text> : null}
        {usuario && datos.cuentaUid && usuario.uid !== datos.cuentaUid ? (
          <View><Text>Este teléfono tiene datos de otra cuenta. Cierra la sesión para conservarlos sin mezclarlos.</Text><Pressable onPress={cerrarSesion}><Text>Cerrar sesión</Text></Pressable></View>
        ) : datos.borrado && modal !== 'cuenta' ? (
          <View>
            <Text>Hay un borrado pendiente. Tus datos no se sincronizarán hasta terminarlo.</Text>
            <Pressable onPress={() => datos.borrado.tipo === 'cuenta' ? setModal('cuenta') : borrar().catch(() => { /* El marcador durable mantiene visible el borrado pendiente. */ })}><Text>Reanudar borrado</Text></Pressable>
            {!usuario && datos.borrado.tipo === 'cuenta' && datos.borrado.fase === 'local' ? <>
              <Text>La copia remota ya se borró. Si no puedes volver a entrar, conserva la copia local sin vincularla y revisa después el estado de tu cuenta.</Text>
              <Pressable onPress={() => recuperarCopiaLocal().catch(() => { /* El aviso global muestra el fallo de disco. */ })}><Text>Conservar copia local y revisar cuenta después</Text></Pressable>
            </> : null}
          </View>
        ) : contenido}
      </View>
    </SafeAreaProvider>
  );
});

const s = StyleSheet.create({
  cargando: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.fondo },
  barra: { backgroundColor: color.tarjeta, borderTopWidth: 1, borderTopColor: color.borde },
  tabs: { flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabEmoji: { fontSize: 22 },
  tabTexto: { fontSize: 12, color: color.suave, marginTop: 2 },
  tabTextoOn: { color: color.primario, fontWeight: '700' },
});
