// Reporte de errores y caídas al equipo (Sentry). Solo errores: sin datos personales ni analítica de comportamiento.
// Ninguna pantalla importa Sentry: todo pasa por este módulo (así se prueba sin red y se puede cambiar de servicio).
// Sin DSN, en desarrollo o en pruebas no hace nada. Se activa solo después del consentimiento (ver App.js).
import { Platform } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { version } from '../package.json';

const ENTORNOS = ['staging', 'produccion'];

// Integraciones que registran comportamiento o añaden datos que no queremos enviar.
const INTEGRACIONES_EXCLUIDAS = ['Breadcrumbs', 'UserInteraction', 'ScreenshotAttachment', 'ViewHierarchy', 'Spotlight'];

const REEMPLAZO = '[oculto]';
const CORREO = /[^\s@<>"'()]+@[^\s@<>"'()]+\.[^\s@<>"'()]{2,}/g;
// Identificadores de cuenta de Firebase (28 caracteres) y de documentos largos.
const ID_LARGO = /\b[A-Za-z0-9]{28,}\b/g;

export function limpiarTexto(texto) {
  if (typeof texto !== 'string') return texto;
  return texto.replace(CORREO, REEMPLAZO).replace(ID_LARGO, REEMPLAZO);
}

// Última barrera de privacidad: se ejecuta sobre cada evento justo antes de enviarlo.
export function filtrarEvento(evento) {
  if (!evento) return null;
  const codigo = codigoSeguro(evento.tags?.codigo);
  const e = {
    event_id: evento.event_id, timestamp: evento.timestamp, level: evento.level,
    platform: evento.platform, release: evento.release, environment: evento.environment,
    message: codigo,
    exception: { values: [{ type: 'Error', value: codigo }] },
    tags: { codigo },
  };
  return e;
}

const CODIGOS = new Set(['unavailable', 'permission-denied', 'sincronizar', 'storage', 'sync/conflict', 'sync/profile-conflict', 'sync/deleting', 'sync/generation', 'desconocido']);
export const codigoSeguro = (codigo) => CODIGOS.has(codigo) ? codigo : 'desconocido';

/* El filtro usa una lista de campos permitidos. No se reenvían mensajes,
 * contextos o stacks con valores arbitrarios, tampoco para errores no controlados. */


// Configuración que se pasa al SDK. Es una función pura para poder comprobarla en las pruebas.
export function opcionesReportes({ dsn, entorno, release = version }) {
  return {
    dsn,
    release,
    environment: entorno,
    sendDefaultPii: false,
    // Sin rendimiento, grabación de sesión, capturas ni perfiles.
    tracesSampleRate: 0,
    profilesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    attachScreenshot: false,
    attachViewHierarchy: false,
    enableLogs: false,
    enableAutoSessionTracking: false,
    enableUserInteractionTracing: false,
    enableAutoPerformanceTracing: false,
    enableAppStartTracking: false,
    enableNativeFramesTracking: false,
    enableStallTracking: false,
    enableCaptureFailedRequests: false,
    maxBreadcrumbs: 0,
    integrations: (defecto) => defecto.filter((i) => !INTEGRACIONES_EXCLUIDAS.includes(i.name)),
    beforeBreadcrumb: () => null,
    beforeSend: (evento) => (activo ? filtrarEvento(evento) : null),
  };
}

let iniciado = false;
let activo = false;

// ¿Hay condiciones para reportar? Sin DSN, sin entorno conocido, en desarrollo o en pruebas: no.
export function reportesDisponibles({ dsn, entorno, dev = __DEV__ } = {}) {
  return Boolean(dsn) && ENTORNOS.includes(entorno) && !dev;
}

export function iniciarReportes({
  dsn = process.env.EXPO_PUBLIC_SENTRY_DSN,
  entorno = process.env.EXPO_PUBLIC_ENTORNO,
  dev = __DEV__,
} = {}) {
  if (!reportesDisponibles({ dsn, entorno, dev })) return false;
  try {
    if (!iniciado) {
      Sentry.init(opcionesReportes({ dsn, entorno }));
      Sentry.setTag('plataforma', Platform.OS);
      iniciado = true;
    }
    activo = true;
    return true;
  } catch {
    // Un fallo del servicio de reportes nunca debe afectar a la app.
    return false;
  }
}

// Al borrar los datos se deja de enviar (el SDK ya iniciado descarta los eventos hasta un nuevo consentimiento).
export function detenerReportes() {
  activo = false;
}

export function reportesActivos() {
  return activo;
}

// Reporta un error conocido (ej. fallo de sincronización) solo por su código, nunca con el mensaje completo.
export function reportarError(error, codigo) {
  if (!activo) return;
  try {
    const seguro = codigoSeguro(codigo || (error && error.code));
    const aviso = new Error(seguro);
    aviso.name = 'ErrorReportado';
    Sentry.withScope((scope) => {
      scope.setTag('codigo', seguro);
      Sentry.captureException(aviso);
    });
  } catch {
    // Ignorar: no se puede reportar el fallo de reportar.
  }
}
