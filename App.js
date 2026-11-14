import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { useStore } from './src/store';
import { useNube } from './src/useNube';
import { EstadoApp } from './src/estado-app';
import { hoyISO } from './src/logic';
import { limpiar, nuevoId, tocarPerfil } from './src/fusion';
import { conflicto, iguales } from './src/contratos-sync';
import { programarRecordatorios } from './src/notifications';
import { detenerReportes, iniciarReportes } from './src/reportes';
import { color } from './src/theme';

// Única instancia de almacenamiento/sesión. Router vive en src/app/.
export default Sentry.wrap(function App({ children }) {
  const store = useStore();
  const nube = useNube(store);
  const { datos, actualizar, error, reintentar } = store;
  const claveRecordatorios = datos?.perfil ? JSON.stringify(datos.perfil.recordatorios) : '';
  useEffect(() => {
    if (claveRecordatorios) programarRecordatorios(JSON.parse(claveRecordatorios));
  }, [claveRecordatorios]);
  const consentido = Boolean(datos?.perfil?.consentimiento);
  useEffect(() => {
    if (consentido) iniciarReportes(); else detenerReportes();
  }, [consentido]);

  const cambiarPerfil = (cambios) => actualizar((d) => ({ perfil: { ...d.perfil, ...cambios }, ...tocarPerfil() }));
  const acciones = {
    terminarOnboarding: (perfil, espacio) => actualizar(() => ({ perfil,
      mental: [{ id: nuevoId(), fecha: hoyISO(), valor: espacio }], ...tocarPerfil() })),
    cambiarPerfil,
    cambiarRecordatorios: (recordatorios) => cambiarPerfil({ recordatorios }),
    guardarCheckin: (c) => actualizar((d) => {
      const registro = { ...c, id: c.id || nuevoId() };
      const existente = d.checkins.find((it) => it.id === registro.id);
      if (existente && !iguales(limpiar(existente), limpiar(registro))) throw conflicto();
      return { checkins: existente ? d.checkins : [...d.checkins, registro] };
    }),
    guardarCuesta: (c) => actualizar((d) => ({ cuestas: [...d.cuestas, { ...c, id: nuevoId() }] })),
    marcarLeida: (id) => actualizar((d) => d.lecciones.includes(id) ? {} : { lecciones: [...d.lecciones, id], ...tocarPerfil() }),
    guardarEspacioMental: (valor) => actualizar((d) => ({ mental: [...d.mental, { id: nuevoId(), fecha: hoyISO(), valor }] })),
  };
  const otraCuenta = nube.usuario && datos?.cuentaUid && nube.usuario.uid !== datos.cuentaUid;
  return (
    <SafeAreaProvider>
      <EstadoApp.Provider value={{ ...store, ...nube, ...acciones }}>
        <StatusBar style="dark" />
        <View style={{ flex: 1, backgroundColor: color.fondo }}>
          {error ? <Text accessibilityRole="alert">{error}</Text> : null}
          {!datos ? <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={color.primario} />
            {error ? <Pressable onPress={reintentar}><Text>Reintentar</Text></Pressable> : null}
          </View> : otraCuenta ? <View>
            <Text>Este teléfono tiene datos de otra cuenta. Cierra la sesión para conservarlos sin mezclarlos.</Text>
            <Pressable onPress={nube.cerrarSesion}><Text>Cerrar sesión</Text></Pressable>
          </View> : children}
        </View>
      </EstadoApp.Provider>
    </SafeAreaProvider>
  );
});
