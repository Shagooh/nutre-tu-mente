#!/usr/bin/env bash
# Valida el nombre de la rama de un Pull Request y hacia dónde puede ir.
#
#   Base main    : solo desde "staging" (publicación normal) o desde "hotfix/..." (urgente).
#   Base staging : desde feature/ fix/ docs/ chore/ (trabajo normal) o desde "main" (sincronización).
#                  Un hotfix NO va a staging: va a main y luego se sincroniza staging.
#
# Variables (las pasa el workflow por entorno, nunca interpoladas en el script):
#   HEAD_REF  rama de origen del PR        BASE_REF  rama de destino
#   HEAD_SHA  commit final del PR (opcional; activa la comprobación de "hotfix limpio")
set -euo pipefail

HEAD_REF="${HEAD_REF:?falta HEAD_REF}"
BASE_REF="${BASE_REF:?falta BASE_REF}"
HEAD_SHA="${HEAD_SHA:-}"

NOMBRE_OK='^(feature|fix|docs|chore|hotfix)/[a-z0-9][a-z0-9._-]*$'

falla() { echo "::error::$1"; exit 1; }

nombre_valido() {
  [[ "$HEAD_REF" =~ $NOMBRE_OK ]] || falla "El nombre de la rama \"$HEAD_REF\" no sigue la convención: feature/, fix/, docs/, chore/ o hotfix/ seguido de un nombre en minúsculas con guiones (ej. feature/recordatorios-pausables)."
}

case "$BASE_REF" in
  main)
    if [ "$HEAD_REF" = "staging" ]; then
      echo "OK: publicación normal (staging -> main)."
    elif [[ "$HEAD_REF" == hotfix/* ]]; then
      nombre_valido
      # Un hotfix debe salir de main: no puede llevar commits de staging que aún no están en producción.
      if [ -n "$HEAD_SHA" ] && git rev-parse --verify -q origin/staging >/dev/null && git rev-parse --verify -q origin/main >/dev/null; then
        mapfile -t arrastrados < <(comm -12 \
          <(git rev-list "origin/main..$HEAD_SHA" | sort) \
          <(git rev-list "origin/main..origin/staging" | sort))
        if [ "${#arrastrados[@]}" -gt 0 ]; then
          falla "Este hotfix incluye ${#arrastrados[@]} commit(s) de staging que todavía no están en producción. Crea la rama hotfix/ desde main y vuelve a aplicar solo el arreglo."
        fi
      fi
      echo "OK: hotfix directo a main (verifica que sea realmente urgente)."
    else
      falla "Los Pull Request hacia main solo pueden venir de staging (versión ya probada) o de una rama hotfix/ (arreglo urgente). Tu rama \"$HEAD_REF\" debería ir primero a staging."
    fi
    ;;
  staging)
    if [ "$HEAD_REF" = "main" ]; then
      echo "OK: sincronización (main -> staging)."
    elif [[ "$HEAD_REF" == hotfix/* ]]; then
      falla "Un hotfix no va a staging: va directo a main. Después se sincroniza staging con main."
    else
      nombre_valido
      echo "OK: trabajo normal hacia staging."
    fi
    ;;
  *)
    echo "Base \"$BASE_REF\": sin reglas de ramas."
    ;;
esac
