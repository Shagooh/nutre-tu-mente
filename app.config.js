// La versión de la app (la que ven las tiendas y las personas) sale SIEMPRE de package.json,
// que es la única fuente. Así no hay que cambiarla en dos sitios ni puede desalinearse.
// Para cambiarla: npm version <patch|minor|major> --no-git-tag-version
const { version } = require('./package.json');

module.exports = ({ config }) => ({
  ...config,
  version,
});
