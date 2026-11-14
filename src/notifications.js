import { Platform } from 'react-native';
import { revisionDiagnostico } from './modo-revision';
import { SLOTS } from './content';
import { DESTINOS_RECORDATORIOS, destinoNotificacion } from './navegacion';

// Se carga solo cuando hace falta, y nunca rompe la app si no está disponible.
function modulo() {
  if (revisionDiagnostico) return null;
  try {
    return require('expo-notifications');
  } catch {
    return null;
  }
}

export async function programarRecordatorios(recordatorios) {
  const N = modulo();
  if (!N) return false;
  try {
    await N.cancelAllScheduledNotificationsAsync();
    const activos = recordatorios.filter((r) => r.activo);
    if (!activos.length) return true;

    let { status } = await N.getPermissionsAsync();
    if (status !== 'granted') ({ status } = await N.requestPermissionsAsync());
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      await N.setNotificationChannelAsync('recordatorios', {
        name: 'Recordatorios amables',
        importance: N.AndroidImportance.DEFAULT,
      });
    }
    for (const r of activos) {
      const slot = SLOTS.find((s) => s.id === r.id);
      await N.scheduleNotificationAsync({
        content: { title: slot.titulo, body: slot.cuerpo, data: { url: DESTINOS_RECORDATORIOS[r.id] } },
        trigger: {
          type: N.SchedulableTriggerInputTypes.DAILY,
          hour: r.h,
          minute: r.m,
          channelId: 'recordatorios',
        },
      });
    }
    return true;
  } catch {
    return false;
  }
}

export async function cancelarRecordatorios() {
  const N = modulo();
  try {
    if (N) await N.cancelAllScheduledNotificationsAsync();
  } catch {
    // Sin módulo o permiso de notificación no hay nada más que cancelar.
    return false;
  }
}

export function observarAperturas(onDestino) {
  if (Platform.OS === 'web') return () => {};
  const N = modulo();
  if (!N) return () => {};
  const vistos = new Set();
  const recibir = (respuesta) => {
    if (!respuesta) return;
    const solicitud = respuesta.notification.request;
    const clave = solicitud.identifier + ':' + respuesta.notification.date + ':' + respuesta.actionIdentifier;
    if (vistos.has(clave)) return;
    vistos.add(clave);
    const destino = destinoNotificacion(solicitud.content.data);
    if (destino) onDestino(destino);
    try { N.clearLastNotificationResponse(); } catch { /* No impide usar la app si la plataforma no permite limpiar la respuesta. */ }
  };
  let sub;
  try {
    sub = N.addNotificationResponseReceivedListener(recibir);
    recibir(N.getLastNotificationResponse());
  } catch { /* Expo Go o una plataforma sin respuestas nativas puede seguir usándose. */ }
  return () => sub?.remove();
}
