import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from './src/store';
import { hoyISO } from './src/logic';
import { aplicarSync, desvincular, hayPendientes, nuevoId, tocarPerfil } from './src/fusion';
import { nubeActiva } from './src/firebase';
import { eliminarUsuario, escucharSesion, reautenticar, salir } from './src/cuenta';
import { borrarNube, sincronizar } from './src/sync';
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
import Cuenta from './src/screens/Cuenta';

const TABS = [
  { id: 'hoy', emoji: '🌿', texto: 'Hoy' },
  { id: 'lecciones', emoji: '📖', texto: 'Lecciones' },
  { id: 'progreso', emoji: '🌸', texto: 'Progreso' },
  { id: 'ajustes', emoji: '⚙️', texto: 'Ajustes' },
];

export default function App() {
  const { datos, actualizar, borrarTodo, vuelve, cerrarVuelve } = useStore();
  const [tab, setTab] = useState('hoy');
  const [modal, setModal] = useState(null); // 'checkin' | 'cuesta' | 'pausa' | 'cuenta'
  const [leccionAbierta, setLeccionAbierta] = useState(null);

  // --- Cuenta y nube (opcional: sin configuración de Firebase la app funciona solo en local) ---
  const [usuario, setUsuario] = useState(null);
  const [estadoSync, setEstadoSync] = useState({ estado: 'inactivo', cuando: null });
  const [conflicto, setConflicto] = useState(false);
  const datosRef = useRef(null);
  datosRef.current = datos;
  const sincronizando = useRef(false);

  useEffect(() => escucharSesion(setUsuario), []);

  const sincronizarAhora = useCallback(async () => {
    const d = datosRef.current;
    if (!nubeActiva || !usuario || !d || sincronizando.current) return;
    // Datos de otra cuenta en este teléfono: no se mezclan (privacidad).
    if (d.cuentaUid && d.cuentaUid !== usuario.uid) {
      setConflicto(true);
      await salir();
      return;
    }
    sincronizando.current = true;
    setEstadoSync((e) => ({ ...e, estado: 'sincronizando' }));
    try {
      const res = await sincronizar(usuario.uid, d);
      actualizar((x) => ({
        ...aplicarSync(x, res),
        cuentaUid: usuario.uid,
        ultimaSync: res.remoto.ultimaSync,
      }));
      setEstadoSync({ estado: 'ok', cuando: Date.now(), codigo: null });
    } catch (e) {
      console.warn('[sincronizar]', e);
      const codigo = (e && e.code) || String((e && e.message) || e);
      setEstadoSync((s) => ({ ...s, estado: 'error', codigo }));
    } finally {
      sincronizando.current = false;
    }
  }, [usuario, actualizar]);

  // Al iniciar sesión: sincroniza.
  useEffect(() => {
    if (usuario) {
      setConflicto(false);
      sincronizarAhora();
    }
  }, [usuario]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cuando hay algo nuevo sin subir: espera 2 s y sincroniza.
  useEffect(() => {
    if (!usuario || !datos || !hayPendientes(datos)) return;
    const t = setTimeout(sincronizarAhora, 2000);
    return () => clearTimeout(t);
  }, [datos, usuario, sincronizarAhora]);

  // Al volver a abrir la app: sincroniza.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') sincronizarAhora();
    });
    return () => sub.remove();
  }, [sincronizarAhora]);

  // Los recordatorios se programan siempre que cambian (también si llegan desde la nube).
  const claveRecordatorios = datos && datos.perfil ? JSON.stringify(datos.perfil.recordatorios) : '';
  useEffect(() => {
    if (claveRecordatorios) programarRecordatorios(JSON.parse(claveRecordatorios));
  }, [claveRecordatorios]);

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
    actualizar(() => ({
      perfil,
      mental: [{ id: nuevoId(), fecha: hoyISO(), valor: espacio }],
      ...tocarPerfil(),
    }));
  };

  const cambiarPerfil = (cambios) =>
    actualizar((d) => ({ perfil: { ...d.perfil, ...cambios }, ...tocarPerfil() }));

  const cambiarRecordatorios = (recordatorios) => cambiarPerfil({ recordatorios });

  // Borra todo lo local y, si hay sesión, también la copia en la nube.
  // Si la nube no responde NO se borra nada (para no engañar sobre qué se eliminó).
  const borrar = async () => {
    if (usuario) {
      await borrarNube(usuario.uid); // si falla, lanza el error y Ajustes lo muestra
      await salir();
    }
    await cancelarRecordatorios();
    await borrarTodo();
    setTab('hoy');
  };

  const eliminarCuenta = async (clave) => {
    const uid = usuario.uid;
    await reautenticar(clave);
    await borrarNube(uid);
    await eliminarUsuario();
    actualizar((d) => desvincular(d));
    setEstadoSync({ estado: 'inactivo', cuando: null });
    setModal(null);
  };

  let contenido;
  if (modal === 'cuenta') {
    contenido = (
      <Cuenta
        usuario={usuario}
        estadoSync={estadoSync}
        conflicto={conflicto}
        onCerrar={() => setModal(null)}
        onSalir={salir}
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
