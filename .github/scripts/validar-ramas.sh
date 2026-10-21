#!/usr/bin/env bash
# Valida el nombre de la rama de un Pull Request y, en un hotfix, que parta de producción.
#
# Un solo árbol: todo va hacia main. Solo existen dos tipos de rama de trabajo:
#   feature/...  trabajo normal
#   hotfix/...   arreglo urgente: debe crearse desde lo que está en producción
#                (última etiqueta prod/...), con scripts/crear-hotfix.sh
#
# Variables (las pasa el workflow por entorno, nunca interpoladas en el script):
#   HEAD_REF  rama de origen del PR     BASE_REF  rama de destino
#   HEAD_SHA  commit final del PR (opcional; activa las comprobaciones del hotfix)
set -euo pipefail

HEAD_REF="${HEAD_REF:?falta HEAD_REF}"
BASE_REF="${BASE_REF:?falta BASE_REF}"
HEAD_SHA="${HEAD_SHA:-}"

NOMBRE_OK='^(feature|hotfix)/[a-z0-9][a-z0-9._-]*$'

falla() { echo "::error::$1"; exit 1; }

if [ "$BASE_REF" != "main" ]; then
  echo "Base \"$BASE_REF\": sin reglas de ramas (solo se trabaja contra main)."
  exit 0
fi

[[ "$HEAD_REF" =~ $NOMBRE_OK ]] || falla "La rama \"$HEAD_REF\" no sigue la convención: solo existen feature/ (trabajo normal) y hotfix/ (urgente), seguidos de un nombre en minúsculas con guiones. Ej.: feature/recordatorios-pausables."

if [[ "$HEAD_REF" == feature/* ]]; then
  echo "OK: feature hacia main."
  exit 0
fi

# --- hotfix: debe partir de lo que está en producción ---
if [ -z "$HEAD_SHA" ]; then
  echo "OK: hotfix hacia main (sin SHA no se comprobó el origen)."
  exit 0
fi

ETIQUETA="$(git tag -l 'prod/*' --sort=-creatordate | head -1 || true)"
if [ -z "$ETIQUETA" ]; then
  falla "No existe ninguna etiqueta prod/... que indique qué hay en producción, así que no se puede comprobar que el hotfix parta de ahí."
fi

git merge-base --is-ancestor "$ETIQUETA" "$HEAD_SHA" || falla "Este hotfix no parte de lo que está en producción ($ETIQUETA). Créalo con scripts/crear-hotfix.sh y vuelve a aplicar solo el arreglo."

mapfile -t extra < <(comm -12 \
  <(git rev-list "$ETIQUETA..$HEAD_SHA" | sort) \
  <(git rev-list "$ETIQUETA..origin/main" | sort))
if [ "${#extra[@]}" -gt 0 ]; then
  falla "El hotfix incluye ${#extra[@]} commit(s) de main que todavía no están en producción. Créalo desde la última etiqueta de producción ($ETIQUETA) con scripts/crear-hotfix.sh y vuelve a aplicar solo el arreglo."
fi

echo "OK: hotfix limpio, parte de producción ($ETIQUETA)."
