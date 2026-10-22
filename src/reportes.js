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
  const e = { ...evento };

  delete e.user;
  delete e.request;
  delete e.server_name;
  delete e.breadcrumbs;
  delete e.extra;
  delete e.modules;

  e.message = limpiarTexto(e.message);
  if (e.logentry) e.logentry = { ...e.logentry, message: limpiarTexto(e.logentry.message) };
  if (e.exception && Array.isArray(e.exception.values)) {
    e.exception = {
      ...e.exception,
      values: e.exception.values.map((v) => ({ ...v, value: limpiarTexto(v.value) })),
    };
  }
  if (e.contexts) {
    // El nombre del dispositivo suele llevar el de la persona ("iPhone de Ana").
    const { device, ...resto } = e.contexts;
    e.contexts = device ? { ...resto, device: { ...device, name: undefined } } : resto;
  }
  // Etiquetas: solo las técnicas que ponemos nosotros.
  if (e.tags) {
    const { plataforma, codigo } = e.tags;
    e.tags = { plataforma, codigo };
  }
  return e;
}

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
  } catch (e) {
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
    const nombre = (error && error.name) || 'Error';
    const aviso = new Error(`${nombre}: ${codigo || (error && error.code) || 'desconocido'}`);
    aviso.name = 'ErrorReportado';
    Sentry.withScope((scope) => {
      scope.setTag('codigo', String(codigo || (error && error.code) || 'desconocido'));
      Sentry.captureException(aviso);
    });
  } catch (e) {
    // Ignorar: no se puede reportar el fallo de reportar.
  }
}
