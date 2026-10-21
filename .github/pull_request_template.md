## Qué cambia
<!-- Una o dos frases. -->

## Especificación
- Cambio de OpenSpec: `openspec/changes/<nombre>/` (o "no aplica": arreglo menor, mantenimiento)
- Tareas que cubre: 1.1, 1.2… · *Scenario* que verifica: …

## Lista de comprobación
- [ ] Respeta los [principios](https://github.com/Shagooh/nutre-tu-mente/blob/main/openspec/constitution.md) (sin peso/calorías/rachas, sin castigos, tono de tú).
- [ ] Cada *Scenario* tiene su verificación (test automático o pasos manuales descritos).
- [ ] Los documentos del cambio (y `openspec/specs/` al archivar) se actualizaron **en este mismo Pull Request** si el comportamiento cambió.
- [ ] `npx @fission-ai/openspec@1.14.3 validate --all --strict` pasa.
- [ ] `1 · Probar` y `2 · Compilar` en verde.
- [ ] Textos nuevos o cambiados revisados por el equipo clínico (si aplica).
- [ ] Si toca datos: reglas de Firestore y migración revisadas.
- [ ] Sin claves ni secretos en el código ni en los documentos.

## Cómo probarlo
<!-- Pasos para que la otra persona lo compruebe. -->

## Notas para quien revisa
<!-- Dudas, partes delicadas, archivos compartidos tocados (App.js, content.js, package.json). -->
