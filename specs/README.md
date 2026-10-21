# Desarrollo guiado por especificaciones (SDD)

Aquí vive **qué** debe hacer la app y **por qué**, antes (y después) del código. La especificación es la fuente de verdad.

```
Principios → Especificación → Plan → Tareas → Código → Verificación
(constitution)  (spec.md)    (plan.md) (tasks.md)        (tests + pipeline)
```

- [`constitution.md`](constitution.md): reglas que nunca se rompen.
- [`../docs/lean-canvas.md`](../docs/lean-canvas.md): contexto de negocio y alcance.
- [`_plantillas/`](_plantillas): plantillas de `spec.md`, `plan.md` y `tasks.md`.
- `NNN-nombre-corto/`: una carpeta por funcionalidad (ver [`001-me-esta-costando`](001-me-esta-costando/spec.md)).

## Cuándo hace falta una especificación

| Cambio | ¿Especificación? |
|---|---|
| Funcionalidad nueva o cambio de comportamiento visible | **Sí** |
| Cambio en datos guardados, privacidad o textos clínicos | **Sí** (y pasa por el equipo clínico) |
| Arreglo de un error, ajuste visual menor, mantenimiento | No: basta el Pull Request |

## Estados de una especificación
`Borrador` → `En revisión` → `Aprobada` → `Implementada` (y `Descartada` si no sigue).
El estado se escribe en la cabecera de `spec.md`.

## Flujo para dos desarrolladores

Llamemos **Autor/a** a quien escribe la especificación y **Revisor/a** a la otra persona. Se alternan los roles.

1. **Especificar.** El/la Autor/a copia las plantillas a `specs/NNN-nombre/` (numeración correlativa), en una rama
   `spec/NNN-nombre`, y escribe `spec.md` (estado `Borrador`).
2. **Revisar la especificación.** Abre un Pull Request **solo con la especificación** hacia `staging`. El/la Revisor/a
   comenta y aprueba. Si toca temas clínicos, también lo ve el equipo clínico. Al unirse, el estado pasa a `Aprobada`.
3. **Planear y repartir.** Se escriben `plan.md` y `tasks.md`. Las tareas se **reparten** entre las dos personas
   (una persona por tarea; tareas que tocan los mismos archivos no se hacen en paralelo).
4. **Implementar.** Cada tarea va en su rama `feature/NNN-tarea` y su Pull Request, que **enlaza a la especificación** y
   marca qué criterios de aceptación cubre.
5. **Verificar.** La pipeline (`1 · Probar`, `2 · Compilar`) debe estar en verde y la otra persona revisa el código frente a
   la especificación y los principios.
6. **Cerrar.** Al terminar la última tarea, se actualiza el estado a `Implementada` (en el mismo Pull Request).

## Reglas para no pisarse
- **Una especificación, una persona responsable.** Quien la escribe no la aprueba.
- **Ramas cortas** (idealmente de un día o dos) y **Pull Requests pequeños.**
- **Archivos compartidos** (`App.js`, `src/content.js`, `package.json`): se avisa antes de tocarlos, y se actualiza la rama
  desde `staging` con frecuencia.
- **Cambiar de idea = cambiar el documento primero,** en un Pull Request, antes del código.
- **Los textos clínicos** (`src/content.js`) siempre los revisa el equipo clínico.

## Cómo escribir buenos criterios de aceptación
Formato **Dado / Cuando / Entonces**, comprobable y sin ambigüedad:

> **Dado** que la persona tocó *Me está costando*, **cuando** termina el último paso, **entonces** se guarda su calma antes y
> después, y la planta suma un punto de cuidado.

Cada criterio indica **cómo se verifica**: prueba automática (archivo del test) o prueba manual (pasos).

## Numeración y nombres
`001-me-esta-costando`, `002-check-in`… Los números no se reutilizan, aunque una especificación se descarte.
