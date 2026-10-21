#!/usr/bin/env bash
# Crea una rama hotfix/<nombre> desde lo que HOY está en producción (la última etiqueta prod/...),
# no desde main (que puede tener cambios todavía sin publicar).
#
# Uso:  bash scripts/crear-hotfix.sh nombre-corto
set -euo pipefail

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
etiqueta="$(git tag -l 'prod/*' --sort=-creatordate | head -1)"
if [ -z "$etiqueta" ]; then
  echo "No hay ninguna etiqueta prod/... Aún no se registró qué versión está en producción." >&2
  exit 1
fi

git switch -c "hotfix/$nombre" "$etiqueta"
echo
echo "Rama hotfix/$nombre creada desde $etiqueta (lo que hoy está en producción)."
echo "Siguiente: haz SOLO el arreglo, súbela y abre un Pull Request hacia main."
