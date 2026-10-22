jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  setTag: jest.fn(),
  captureException: jest.fn(),
  withScope: jest.fn((fn) => fn({ setTag: jest.fn() })),
}));

import * as Sentry from '@sentry/react-native';
import { version } from '../../package.json';
import {
  detenerReportes,
  filtrarEvento,
  iniciarReportes,
  limpiarTexto,
  opcionesReportes,
  reportarError,
  reportesActivos,
  reportesDisponibles,
} from '../reportes';

const DSN = 'https://clave@o0.ingest.example.com/1';
const PRODUCCION = { dsn: DSN, entorno: 'produccion', dev: false };

beforeEach(() => {
  jest.clearAllMocks();
  detenerReportes();
});

describe('servicio opcional', () => {
  test('sin DSN no se inicia nada y la app sigue igual', () => {
    expect(iniciarReportes({ dsn: undefined, entorno: 'produccion', dev: false })).toBe(false);
    expect(iniciarReportes({ dsn: '', entorno: 'produccion', dev: false })).toBe(false);
    expect(Sentry.init).not.toHaveBeenCalled();
    expect(reportesActivos()).toBe(false);
  });

  test('en desarrollo y en pruebas no se envía nada', () => {
    expect(reportesDisponibles({ ...PRODUCCION, dev: true })).toBe(false);
    expect(iniciarReportes({ ...PRODUCCION, dev: true })).toBe(false);
    // Por defecto, Jest corre con __DEV__ activo.
    expect(iniciarReportes({ dsn: DSN, entorno: 'produccion' })).toBe(false);
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  test('un entorno desconocido no reporta', () => {
    expect(iniciarReportes({ dsn: DSN, entorno: 'desarrollo', dev: false })).toBe(false);
    expect(iniciarReportes({ dsn: DSN, entorno: undefined, dev: false })).toBe(false);
  });

  test('un fallo del SDK nunca llega a la app', () => {
    Sentry.init.mockImplementationOnce(() => {
      throw new Error('boom');
    });
    expect(() => iniciarReportes(PRODUCCION)).not.toThrow();
    expect(reportesActivos()).toBe(false);
  });
});

describe('configuración sin analítica de comportamiento', () => {
  const o = opcionesReportes({ dsn: DSN, entorno: 'staging' });

  test('no envía datos personales por defecto', () => {
    expect(o.sendDefaultPii).toBe(false);
    expect(o.attachScreenshot).toBe(false);
    expect(o.attachViewHierarchy).toBe(false);
  });

  test('sin rendimiento, grabación de sesión ni perfiles', () => {
    expect(o.tracesSampleRate).toBe(0);
    expect(o.profilesSampleRate).toBe(0);
    expect(o.replaysSessionSampleRate).toBe(0);
    expect(o.replaysOnErrorSampleRate).toBe(0);
    expect(o.enableUserInteractionTracing).toBe(false);
    expect(o.enableAutoSessionTracking).toBe(false);
    expect(o.enableLogs).toBe(false);
  });

  test('sin migas de pan de toques, navegación ni consola', () => {
    expect(o.maxBreadcrumbs).toBe(0);
    expect(o.beforeBreadcrumb({ category: 'ui.click' })).toBeNull();
    const defecto = [{ name: 'Breadcrumbs' }, { name: 'UserInteraction' }, { name: 'GlobalHandlers' }];
    expect(o.integrations(defecto).map((i) => i.name)).toEqual(['GlobalHandlers']);
  });
});

describe('sin datos personales', () => {
  const evento = {
    message: 'Fallo con ana@correo.com',
    user: { id: 'abc', email: 'ana@correo.com', ip_address: '1.2.3.4' },
    request: { url: 'https://app.example.com/?apodo=Ana', headers: { Cookie: 'x' } },
    breadcrumbs: [{ category: 'ui.click', message: 'Mi apodo' }],
    extra: { apodo: 'Ana', checkins: [1, 2] },
    server_name: 'telefono-de-ana',
    contexts: { device: { name: 'iPhone de Ana', model: 'iPhone 15' }, os: { name: 'iOS' } },
    tags: { plataforma: 'ios', codigo: 'unavailable', apodo: 'Ana' },
    exception: {
      values: [{ type: 'Error', value: 'uid 0123456789abcdefghijklmnopqrstuv no encontrado para ana@correo.com' }],
    },
  };
  const limpio = filtrarEvento(evento);

  test('el reporte no contiene usuario, correo, apodo ni IP', () => {
    expect(limpio.user).toBeUndefined();
    expect(limpio.request).toBeUndefined();
    expect(limpio.server_name).toBeUndefined();
    expect(limpio.breadcrumbs).toBeUndefined();
    expect(limpio.extra).toBeUndefined();
    expect(limpio.contexts.device.name).toBeUndefined();
    expect(limpio.contexts.device.model).toBe('iPhone 15');
    expect(limpio.tags).toEqual({ plataforma: 'ios', codigo: 'unavailable' });
    const texto = JSON.stringify(limpio);
    expect(texto).not.toMatch(/ana@correo|1\.2\.3\.4|Ana|apodo/);
  });

  test('los correos y los identificadores largos de los mensajes se ocultan', () => {
    expect(limpio.message).toBe('Fallo con [oculto]');
    expect(limpio.exception.values[0].value).toBe('uid [oculto] no encontrado para [oculto]');
    expect(limpiarTexto('sin datos')).toBe('sin datos');
    expect(limpiarTexto(undefined)).toBeUndefined();
  });

  test('no modifica el evento original', () => {
    expect(evento.user.email).toBe('ana@correo.com');
  });
});

describe('versión y entorno', () => {
  test('el release es la versión de package.json (la misma de la etiqueta vX.Y.Z)', () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(opcionesReportes({ dsn: DSN, entorno: 'produccion' }).release).toBe(version);
  });

  test('un reporte de staging nunca se marca como producción', () => {
    expect(opcionesReportes({ dsn: DSN, entorno: 'staging' }).environment).toBe('staging');
    expect(opcionesReportes({ dsn: DSN, entorno: 'produccion' }).environment).toBe('produccion');
  });

  test('al iniciar se pasa el DSN, el release y el entorno al SDK', () => {
    expect(iniciarReportes({ dsn: DSN, entorno: 'staging', dev: false })).toBe(true);
    const usado = Sentry.init.mock.calls[0][0];
    expect(usado).toMatchObject({ dsn: DSN, release: version, environment: 'staging', sendDefaultPii: false });
  });
});

describe('consentimiento', () => {
  test('antes de aceptar no se envía ningún reporte', () => {
    reportarError(new Error('x'), 'unavailable');
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  test('después de aceptar el reporte se envía solo con su código', () => {
    iniciarReportes(PRODUCCION);
    reportarError({ name: 'FirebaseError', code: 'unavailable', message: 'ana@correo.com' });
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    const enviado = Sentry.captureException.mock.calls[0][0];
    expect(enviado.message).toBe('FirebaseError: unavailable');
    expect(enviado.message).not.toMatch(/ana@/);
  });

  // El módulo guarda si el SDK ya se inició: estas pruebas lo cargan limpio.
  const cargarLimpio = () => {
    jest.resetModules();
    return { reportes: require('../reportes'), sdk: require('@sentry/react-native') };
  };

  test('al borrar los datos se deja de enviar, aunque el SDK siga iniciado', () => {
    const { reportes, sdk } = cargarLimpio();
    reportes.iniciarReportes(PRODUCCION);
    const { beforeSend } = sdk.init.mock.calls[0][0];
    expect(beforeSend({ message: 'a' })).not.toBeNull();
    reportes.detenerReportes();
    reportes.reportarError(new Error('x'), 'unavailable');
    expect(sdk.captureException).not.toHaveBeenCalled();
    expect(beforeSend({ message: 'a' })).toBeNull();
  });

  test('un nuevo consentimiento reactiva el envío sin iniciar el SDK otra vez', () => {
    const { reportes, sdk } = cargarLimpio();
    reportes.iniciarReportes(PRODUCCION);
    reportes.detenerReportes();
    reportes.iniciarReportes(PRODUCCION);
    expect(reportes.reportesActivos()).toBe(true);
    expect(sdk.init).toHaveBeenCalledTimes(1);
  });
});
