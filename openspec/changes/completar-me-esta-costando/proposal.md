# Proposal

## Why

"Me está costando" ya está implementada y funciona, pero tiene cuatro deudas antes de poder considerarla lista para
pacientes reales:

1. Sus textos son un **borrador** que aún no valida el equipo clínico (principio 5 de la constitución).
2. El acceso "Esto me supera" muestra un mensaje de contención **genérico**, sin líneas de ayuda ni un protocolo definido.
3. Varios escenarios solo se probaron a mano; **no hay pruebas automáticas de pantalla**.
4. Nunca se probó el flujo, ni la vibración de la respiración, en un **teléfono real**.

Es la función con la hipótesis más arriesgada del producto, así que cerrar estas deudas es prioritario.

## What Changes

- Revisión y validación clínica de todos los textos del flujo.
- Definición, con el equipo clínico, del protocolo de riesgo y del contenido exacto de "Esto me supera".
- Pruebas automáticas de interfaz para los escenarios que hoy solo se verificaron a mano.
- Prueba en Android e iPhone reales.
- Decisiones de producto pendientes: audios de respiración y si el botón es gratis o de pago.

**Fuera de alcance:** implementar la detección automática de señales de riesgo o un chat con una profesional. Si el
equipo clínico define requisitos nuevos, se abrirá un **cambio aparte** que modifique la capacidad `me-esta-costando`.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
<!-- Ninguna todavía: este cambio no altera requisitos. El protocolo de riesgo generará un cambio propio. -->

## Impact

- **Textos:** `src/screens/MeCuesta.js`, `src/content.js` (`TIPOS_HAMBRE`, `NECESIDADES`, `TRATOS`).
- **Pruebas:** nuevos tests de interfaz (hoy solo hay tests de lógica en `src/__tests__/`).
- **Principios afectados:** 4 (deriva a ayuda profesional) y 5 (contenido validado por el equipo clínico).
- **Requiere al equipo clínico:** sí.
