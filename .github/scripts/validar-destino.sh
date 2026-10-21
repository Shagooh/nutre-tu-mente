#!/usr/bin/env bash
# Decide A DÓNDE se publica y comprueba que sea seguro hacerlo.
#
# Un solo árbol de ramas: main. Desde main (o desde un hotfix/...) se elige el entorno:
#   Pull Request          -> no se publica (solo se prueba y compila)
#   push a main           -> staging, automático
#   ejecución manual      -> staging o produccion, según lo que se elija
#
# "Lo que está en producción" lo marca la última etiqueta prod/AAAA-MM-DD-HHMMSS, que crea la pipeline
# después de cada publicación a producción.
#
# Variables (las pasa el workflow por entorno): EVENTO, RAMA, SHA, ENTORNO_PEDIDO (solo en ejecución manual).
set -euo pipefail

EVENTO="${EVENTO:?falta EVENTO}"
RAMA="${RAMA:-}"
SHA="${SHA:?falta SHA}"
PEDIDO="${ENTORNO_PEDIDO:-}"
SALIDA="${GITHUB_OUTPUT:-/dev/stdout}"
RESUMEN="${GITHUB_STEP_SUMMARY:-/dev/null}"

falla() { echo "::error::$1"; exit 1; }
emitir() { echo "entorno=$1" >> "$SALIDA"; echo "publica=$2" >> "$SALIDA"; }

case "$EVENTO" in
  pull_request)
    emitir staging false
    echo "Pull Request: solo se prueba y se compila, no se publica."
    exit 0 ;;
  push)
    ENTORNO=staging ;;
  workflow_dispatch)
    case "$PEDIDO" in
      staging|produccion) ENTORNO="$PEDIDO" ;;
      *) falla "Entorno no válido: \"$PEDIDO\". Elige staging o produccion." ;;
    esac ;;
  *)
    falla "Evento no previsto: $EVENTO" ;;
esac

# 1) Desde qué rama se puede publicar: solo main o un hotfix/...
if [ "$RAMA" = "main" ]; then
  ORIGEN=main
elif [[ "$RAMA" == hotfix/* ]]; then
  ORIGEN=hotfix
else
  falla "Solo se puede publicar desde main o desde una rama hotfix/... Elegiste \"$RAMA\"."
fi

ETIQUETA="$(git tag -l 'prod/*' --sort=-creatordate | head -1 || true)"

# 2) Reglas adicionales para producción
if [ "$ENTORNO" = "produccion" ]; then
  if [ -z "$ETIQUETA" ]; then
    if [ "$ORIGEN" = "hotfix" ]; then
      falla "No existe ninguna etiqueta prod/... que indique qué hay en producción, así que no se puede comprobar que el hotfix parta de ahí."
    fi
    echo "::notice::Todavía no hay etiqueta de producción: esta será la primera publicación etiquetada."
  else
    # (a) Lo que ya está en producción debe estar contenido en lo que se va a publicar:
    #     así no se pierde nada (por ejemplo, un hotfix publicado que aún no se unió a main).
    if ! git merge-base --is-ancestor "$ETIQUETA" "$SHA"; then
      falla "Lo que hay hoy en producción ($ETIQUETA) NO está contenido en \"$RAMA\". Si publicaste un hotfix, únelo primero a main. Si creaste este hotfix hace tiempo, créalo de nuevo con scripts/crear-hotfix.sh."
    fi

    # (b) Un hotfix solo puede llevar su propio arreglo, no cambios de main sin publicar.
    if [ "$ORIGEN" = "hotfix" ]; then
      if git merge-base --is-ancestor "$SHA" origin/main 2>/dev/null; then
        echo "::notice::Este hotfix ya está unido a main: su limpieza se comprobó en el Pull Request."
      else
        mapfile -t extra < <(comm -12 \
          <(git rev-list "$ETIQUETA..$SHA" | sort) \
          <(git rev-list "$ETIQUETA..origin/main" | sort))
        if [ "${#extra[@]}" -gt 0 ]; then
          falla "El hotfix incluye ${#extra[@]} commit(s) de main que todavía no están en producción. Créalo desde la última etiqueta de producción con scripts/crear-hotfix.sh."
        fi
      fi
    fi

    if [ "$(git rev-parse "$ETIQUETA^{commit}")" = "$(git rev-parse "$SHA")" ]; then
      echo "::notice::Esta versión ya es la que está en producción ($ETIQUETA)."
    fi

    # Resumen de lo que se va a publicar
    {
      echo "### Qué se publica en producción"
      echo
      echo "Desde la versión actual (\`$ETIQUETA\`) hasta \`${SHA:0:7}\` (rama \`$RAMA\`):"
      echo
      git log --format='- `%h` %s' "$ETIQUETA..$SHA"
    } >> "$RESUMEN"
  fi
fi

emitir "$ENTORNO" true
echo "Destino: $ENTORNO (desde la rama $RAMA)."
