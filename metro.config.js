// Metro con el serializador de Sentry: asigna un "debug id" único a cada paquete y a su source map,
// así los errores de producción se ven con el código legible sin depender de nombres de archivo.
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

module.exports = getSentryExpoConfig(__dirname);
