// Comprueba que la versión de la app sea válida y coherente.
// La única fuente es package.json; package-lock.json debe decir lo mismo (npm version lo actualiza junto).
const fs = require('fs');

const SEMVER = /^\d+\.\d+\.\d+$/;
const leer = (archivo) => JSON.parse(fs.readFileSync(archivo, 'utf8'));
const errores = [];
const ayuda = 'Para cambiarla usa: npm version <patch|minor|major> --no-git-tag-version (actualiza los dos archivos).';

const pkg = leer('package.json');
if (!SEMVER.test(pkg.version || '')) {
  errores.push(`package.json: la versión "${pkg.version}" no es válida. Debe ser X.Y.Z (por ejemplo 1.2.0). ${ayuda}`);
}

if (fs.existsSync('package-lock.json')) {
  const lock = leer('package-lock.json');
  const raiz = lock.packages && lock.packages[''] ? lock.packages[''].version : undefined;
  if (lock.version !== pkg.version) {
    errores.push(`package-lock.json dice "${lock.version}" y package.json dice "${pkg.version}". ${ayuda}`);
  }
  if (raiz !== pkg.version) {
    errores.push(`package-lock.json (paquete raíz) dice "${raiz}" y package.json dice "${pkg.version}". ${ayuda}`);
  }
}

if (errores.length > 0) {
  errores.forEach((e) => console.log(`::error::${e}`));
  process.exit(1);
}
console.log(`Versión ${pkg.version}: válida y coherente con package-lock.json.`);
