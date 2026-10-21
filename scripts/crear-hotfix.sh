#!/usr/bin/env bash
# Crea una rama hotfix/<nombre> desde lo que HOY está en producción (la última etiqueta vX.Y.Z),
# no desde main (que puede tener cambios todavía sin publicar). Además sube la versión (patch) en un
# primer commit, porque un hotfix se publica a producción y cada publicación necesita una versión nueva.
#
# Uso:  bash scripts/crear-hotfix.sh nombre-corto
set -euo pipefail

# shellcheck source=../.github/scripts/lib-version.sh
source "$(dirname "${BASH_SOURCE[0]}")/../.github/scripts/lib-version.sh"

nombre="${1:-}"
if [ -z "$nombre" ]; then
  echo "Uso: bash scripts/crear-hotfix.sh nombre-corto   (ej.: boton-me-esta-costando-no-abre)" >&2
  exit 1
fi
if ! [[ "$nombre" =~ ^[a-z0-9][a-z0-9._-]*$ ]]; then
  echo "El nombre debe estar en minúsculas, con números, guiones, puntos o guiones bajos (sin espacios, mayúsculas ni acentos)." >&2
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "Tienes cambios sin guardar. Haz commit o guárdalos antes de crear el hotfix." >&2
  exit 1
fi

git fetch origin --tags --prune --quiet
etiqueta="$(ultima_etiqueta)"
if [ -z "$etiqueta" ]; then
  echo "No hay ninguna etiqueta vX.Y.Z. Aún no se registró qué versión está en producción." >&2
  exit 1
fi
if [ "$(version_en "$etiqueta")" != "${etiqueta#v}" ]; then
  echo "La etiqueta $etiqueta no coincide con la versión de su package.json ($(version_en "$etiqueta")). Revísala antes de seguir." >&2
  exit 1
fi

git switch -c "hotfix/$nombre" "$etiqueta"

nueva="$(npm version patch --no-git-tag-version | tr -d 'v\r')"
git add package.json
[ -f package-lock.json ] && git add package-lock.json
git commit -q -m "Subir versión a $nueva (hotfix/$nombre)"

echo
echo "Rama hotfix/$nombre creada desde $etiqueta (lo que hoy está en producción)."
echo "La versión ya subió de ${etiqueta#v} a $nueva en el primer commit."
echo "Siguiente: haz SOLO el arreglo, súbela y abre un Pull Request hacia main."
