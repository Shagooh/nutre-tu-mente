# Proposal

## Why
La demo para la feria necesita mostrar la identidad Amía y destacar el acceso de acompañamiento solicitado por la persona responsable.

## What Changes
- Mostrar el PNG existente en bienvenida e Inicio, conservando proporciones.
- Sustituir los nombres anteriores cuando nombran la app por Amía, incluido el nombre visible de Expo y el título web. Conservar Nutrimind cuando identifica al equipo creador o una consulta.
- Hacer circular, más alto y centrado horizontalmente el botón Me está costando de Inicio (diámetro orientativo 160 px), sin superponerlo al contenido.
- Volver a publicar la demo en el proyecto Vercel nutre-tu-mente-feria.

## Capabilities
### New Capabilities
- `identidad-amia`: nombre y logo visibles de la aplicación.
### Modified Capabilities
- `me-esta-costando`: presentación del acceso principal circular y centrado.

## Impact
Onboarding, Hoy, avisos en Ajustes/Cuenta/MeCuesta, assets y configuración visible de Expo/web. Sin nuevas dependencias. Se respetan los cambios locales existentes. Fuera de alcance: identificadores de infraestructura, cuentas, datos, versión, pipeline compartido y modo de fecha simulada. Principios afectados: accesibilidad móvil, tono y contenido clínico; solo cambia el nombre de la app en avisos, sin crear ni validar contenido clínico.
