#!/usr/bin/env bash
# Funciones comunes para trabajar con versiones (SemVer X.Y.Z) y etiquetas vX.Y.Z.
# La versión de la app vive SOLO en package.json. Cada publicación a producción deja una etiqueta vX.Y.Z.
# La etiqueta más alta es "lo que está hoy en producción".
#
# Uso:  source "$(dirname "${BASH_SOURCE[0]}")/lib-version.sh"

RE_SEMVER='^[0-9]+\.[0-9]+\.[0-9]+$'
RE_ETIQUETA='^v[0-9]+\.[0-9]+\.[0-9]+$'

# Versión que dice package.json en una revisión de git. Vacío si no existe o no es JSON válido.
version_en() {
  git show "$1:package.json" 2>/dev/null | node -e '
    let s = "";
    process.stdin.on("data", (d) => (s += d)).on("end", () => {
      try { console.log(JSON.parse(s).version || ""); } catch (e) { console.log(""); }
    });'
}

# Etiqueta vX.Y.Z más alta, o nada si todavía no hay ninguna. Se compara como versión, no por fecha.
ultima_etiqueta() {
  git tag -l 'v*' | grep -E "$RE_ETIQUETA" | sort -V | tail -1 || true
}

# ¿$1 es estrictamente mayor que $2? (comparación SemVer X.Y.Z)
es_mayor() {
  [ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | tail -1)" = "$1" ]
}

existe_etiqueta() {
  git rev-parse -q --verify "refs/tags/$1" >/dev/null 2>&1
}
