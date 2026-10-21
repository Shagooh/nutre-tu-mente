#!/usr/bin/env bash
# Valida el nombre de la rama de un Pull Request, su versión y, en un hotfix, que parta de producción.
#
# Un solo árbol: todo va hacia main. Solo existen dos tipos de rama de trabajo:
#   feature/...  trabajo normal. Si cambia la versión, debe ser válida, nueva y mayor.
#   hotfix/...   arreglo urgente: debe crearse desde lo que está en producción (última etiqueta vX.Y.Z)
#                con scripts/crear-hotfix.sh, y DEBE subir la versión (se publicará a producción).
#
# Variables (las pasa el workflow por entorno, nunca interpoladas en el script):
#   HEAD_REF  rama de origen del PR     BASE_REF  rama de destino
#   HEAD_SHA  commit final del PR (activa las comprobaciones de versión y de origen del hotfix)
set -euo pipefail

# shellcheck source=lib-version.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib-version.sh"

HEAD_REF="${HEAD_REF:?falta HEAD_REF}"
BASE_REF="${BASE_REF:?falta BASE_REF}"
HEAD_SHA="${HEAD_SHA:-}"

NOMBRE_OK='^(feature|hotfix)/[a-z0-9][a-z0-9._-]*$'

falla() { echo "::error::$1"; exit 1; }
SUBIR='Súbela con: npm version <patch|minor|major> --no-git-tag-version'

if [ "$BASE_REF" != "main" ]; then
  echo "Base \"$BASE_REF\": sin reglas de ramas (solo se trabaja contra main)."
  exit 0
fi

[[ "$HEAD_REF" =~ $NOMBRE_OK ]] || falla "La rama \"$HEAD_REF\" no sigue la convención: solo existen feature/ (trabajo normal) y hotfix/ (urgente), seguidos de un nombre en minúsculas con guiones. Ej.: feature/recordatorios-pausables."

if [ -z "$HEAD_SHA" ]; then
  echo "OK: nombre válido (sin SHA no se comprobaron las versiones)."
  exit 0
fi

VERSION="$(version_en "$HEAD_SHA")"
BASE_VERSION="$(version_en origin/main)"
ETIQUETA="$(ultima_etiqueta)"
ULTIMA="${ETIQUETA#v}"

[[ "$VERSION" =~ $RE_SEMVER ]] || falla "La versión de package.json (\"$VERSION\") no es válida. Debe ser X.Y.Z (por ejemplo 1.2.0)."

# --- feature: la versión puede quedarse igual; si cambia, debe ser nueva y mayor ---
if [[ "$HEAD_REF" == feature/* ]]; then
  if [ "$VERSION" != "$BASE_VERSION" ]; then
    existe_etiqueta "v$VERSION" && falla "La versión $VERSION ya se publicó (etiqueta v$VERSION) y no se puede repetir. $SUBIR"
    if [ -n "$ETIQUETA" ] && ! es_mayor "$VERSION" "$ULTIMA"; then
      falla "La versión $VERSION debe ser MAYOR que la última publicada ($ULTIMA). $SUBIR"
    fi
    es_mayor "$VERSION" "$BASE_VERSION" || falla "La versión $VERSION debe ser MAYOR que la que ya tiene main ($BASE_VERSION). $SUBIR"
    echo "OK: feature hacia main, sube la versión de $BASE_VERSION a $VERSION."
  else
    echo "OK: feature hacia main (la versión no cambia: $VERSION)."
  fi
  exit 0
fi

# --- hotfix: debe partir de lo que está en producción y subir la versión ---
[ -n "$ETIQUETA" ] || falla "No existe ninguna etiqueta vX.Y.Z que indique qué hay en producción, así que no se puede comprobar que el hotfix parta de ahí."

git merge-base --is-ancestor "$ETIQUETA" "$HEAD_SHA" || falla "Este hotfix no parte de lo que está en producción ($ETIQUETA). Créalo con scripts/crear-hotfix.sh y vuelve a aplicar solo el arreglo."

mapfile -t extra < <(comm -12 \
  <(git rev-list "$ETIQUETA..$HEAD_SHA" | sort) \
  <(git rev-list "$ETIQUETA..origin/main" | sort))
if [ "${#extra[@]}" -gt 0 ]; then
  falla "El hotfix incluye ${#extra[@]} commit(s) de main que todavía no están en producción. Créalo desde la última etiqueta de producción ($ETIQUETA) con scripts/crear-hotfix.sh y vuelve a aplicar solo el arreglo."
fi

existe_etiqueta "v$VERSION" && [ "$VERSION" != "$ULTIMA" ] && falla "La versión $VERSION ya se publicó (etiqueta v$VERSION) y no se puede repetir. $SUBIR"
# Si el hotfix ya se publicó, su versión es justo la etiqueta actual: es válido.
if [ "$VERSION" != "$ULTIMA" ] && ! es_mayor "$VERSION" "$ULTIMA"; then
  falla "Un hotfix se publica a producción, así que debe SUBIR la versión: tiene $VERSION y la última publicada es $ULTIMA. $SUBIR"
fi
if [ "$VERSION" = "$ULTIMA" ] && [ "$(git rev-parse "$HEAD_SHA")" != "$(git rev-parse "$ETIQUETA^{commit}")" ]; then
  falla "Un hotfix debe SUBIR la versión: tiene $VERSION, igual que la última publicada ($ULTIMA). $SUBIR"
fi

echo "OK: hotfix limpio, parte de producción ($ETIQUETA) y su versión es $VERSION."
