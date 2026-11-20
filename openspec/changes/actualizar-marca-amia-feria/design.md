# Design

## Context
Ver proposal.md. Hoy usa un Boton rectangular con padding vertical 20; Onboarding muestra NUTRIMIND. El PNG está en docs/Amia-LOGO.png y contiene símbolo y palabra sobre fondo claro.

## Goals / Non-Goals
Goals: identidad consistente y acceso central legible en móvil.
Non-Goals: migrar datos, cambiar identificadores técnicos o alterar el flujo clínico.

## Decisions
- Copiar el PNG a assets y reutilizar una presentación con proporción conservada y nombre accesible. Usar el archivo existente evita redibujar la marca.
- Sustituir solo referencias al producto; conservar atribución del equipo. Una sustitución global de Nutrimind cambiaría información distinta al nombre de la app.
- Botón de unos 160 px de diámetro en el flujo de Inicio, centrado horizontalmente; ajustar ante escalado de texto para legibilidad. Evitar posición absoluta porque ocultaría contenido en pantallas pequeñas.
- Mantener la demo local sin Firebase y desplegar únicamente el artefacto web en el proyecto personal ya creado.

## Risks / Trade-offs
- PNG grande y con márgenes → verificar tamaño visible y carga en móvil, sin deformación.
- Tamaño de letra ampliado → comprobar etiqueta completa y accesibilidad.
- Cambios locales previos → preservarlos y no resetear el checkout.

## Migration Plan
Validar, exportar web y publicar en nutre-tu-mente-feria. Conservar el despliegue anterior para revertir si falla la verificación pública.
