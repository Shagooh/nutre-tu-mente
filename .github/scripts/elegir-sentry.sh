#!/usr/bin/env bash
# Elige la configuración del reporte de errores (Sentry) según el destino y la deja en GITHUB_ENV:
#   EXPO_PUBLIC_SENTRY_DSN   dirección a la que la app envía los reportes (se incluye al compilar)
#   EXPO_PUBLIC_ENTORNO      staging | produccion (así un reporte de staging nunca se marca como producción)
#   SENTRY_PROJECT           proyecto de Sentry al que se suben los source maps
#
#   ENTORNO=produccion      -> variables PROD_*
#   cualquier otro caso     -> variables STG_*
#
# Es opcional, como la nube: si faltan las de staging, la app se compila sin reportes y solo se avisa.
# Si faltan las de producción, la pipeline FALLA (nunca se compila producción sin reportes por descuido).
# El token SENTRY_AUTH_TOKEN es un secret y no pasa por este script.
set -euo pipefail

if [ "${ENTORNO:-}" = "produccion" ]; then
  prefijo="PROD"
  entorno="produccion"
else
  prefijo="STG"
  entorno="staging"
fi

dsn="$(printenv "${prefijo}_SENTRY_DSN" || true)"
proyecto="$(printenv "${prefijo}_SENTRY_PROJECT" || true)"

if [ -z "$dsn" ]; then
  if [ "$prefijo" = "PROD" ]; then
    echo "::error::Falta la variable ${prefijo}_SENTRY_DSN. Créala en Settings → Secrets and variables → Actions → Variables (ver docs/OBSERVABILIDAD.md)."
    exit 1
  fi
  echo "::notice::Sin DSN de Sentry para ${entorno}: la app se compila sin reporte de errores."
  entorno_app=""
else
  entorno_app="$entorno"
fi

{
  echo "EXPO_PUBLIC_SENTRY_DSN=${dsn}"
  echo "EXPO_PUBLIC_ENTORNO=${entorno_app}"
  echo "SENTRY_PROJECT=${proyecto}"
} >> "${GITHUB_ENV:?GITHUB_ENV no está definido}"

if [ -n "$dsn" ]; then
  echo "Sentry: reporte de errores activado para ${entorno}."
fi
