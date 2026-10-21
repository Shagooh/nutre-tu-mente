#!/usr/bin/env bash
# Elige la configuración PÚBLICA de Firebase según la rama y la deja en GITHUB_ENV
# como EXPO_PUBLIC_FIREBASE_*, para que la app se compile contra el proyecto correcto.
#
#   ENTORNO=produccion      -> proyecto de PRODUCCIÓN (variables PROD_*)
#   cualquier otro caso     -> proyecto de STAGING    (variables STG_*)
#   (ENTORNO lo decide el job "0 · Destino": nunca la rama directamente)
#
# Seguridad: si faltan variables de producción, la pipeline FALLA. Nunca se usa en
# silencio la configuración de staging para producción (se mezclarían los datos).
set -euo pipefail

CLAVES="API_KEY AUTH_DOMAIN PROJECT_ID APP_ID MESSAGING_SENDER_ID"

if [ "${ENTORNO:-}" = "produccion" ]; then
  prefijo="PROD"
  entorno="PRODUCCIÓN"
else
  prefijo="STG"
  entorno="staging / pruebas"
fi

faltan=""
for c in $CLAVES; do
  valor="$(printenv "${prefijo}_${c}" || true)"
  if [ -z "$valor" ]; then faltan="$faltan ${prefijo}_${c}"; fi
  echo "EXPO_PUBLIC_FIREBASE_${c}=${valor}" >> "${GITHUB_ENV:?GITHUB_ENV no está definido}"
done

if [ "$prefijo" = "PROD" ] && [ -n "$faltan" ]; then
  echo "::error::Faltan variables de producción:${faltan}. Créalas en Settings → Secrets and variables → Actions → Variables (con el prefijo PROD_EXPO_PUBLIC_FIREBASE_...)."
  exit 1
fi

if [ -n "$faltan" ]; then
  echo "::notice::Sin configuración de Firebase para ${entorno}: la app se compila en modo local (sin cuentas ni nube)."
else
  echo "Firebase: usando la configuración de ${entorno} (proyecto: $(printenv "${prefijo}_PROJECT_ID"))"
fi
