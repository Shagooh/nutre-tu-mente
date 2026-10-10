import { Platform } from 'react-native';
import { SLOTS } from './content';

// Se carga solo cuando hace falta, y nunca rompe la app si no está disponible.
function modulo() {
  try {
    return require('expo-notifications');
  } catch (e) {
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
        content: { title: slot.titulo, body: slot.cuerpo },
        trigger: {
          type: N.SchedulableTriggerInputTypes.DAILY,
          hour: r.h,
          minute: r.m,
          channelId: 'recordatorios',
        },
      });
    }
    return true;
  } catch (e) {
    return false;
  }
}

export async function cancelarRecordatorios() {
  const N = modulo();
  try {
    if (N) await N.cancelAllScheduledNotificationsAsync();
  } catch (e) {}
}
