# Desarrollo guiado por especificaciones con OpenSpec

Usamos [OpenSpec](https://github.com/Fission-AI/OpenSpec) (versión fijada: **1.14.3**). La idea: **primero se acuerda qué se
va a construir, por escrito, y después se programa.** Todo vive en el repositorio como Markdown, así que sirve con
cualquier agente de IA y con cualquier persona.

## Qué hay en el repositorio

| Ruta | Qué es |
|---|---|
| [`openspec/constitution.md`](../openspec/constitution.md) | Principios que **nunca** se rompen (sin peso/calorías/rachas, sin castigos, tono de tú, datos mínimos…) |
| [`openspec/config.yaml`](../openspec/config.yaml) | Contexto del proyecto y reglas que **los agentes leen solos** al proponer o implementar |
| `openspec/specs/<capacidad>/spec.md` | **Cómo se comporta la app hoy**, por capacidad (ej. [`me-esta-costando`](../openspec/specs/me-esta-costando/spec.md)) |
| `openspec/changes/<cambio>/` | **Cambios propuestos, aún sin terminar:** `proposal.md`, `design.md`, `tasks.md` y los deltas de las especificaciones |
| `openspec/changes/archive/` | Cambios ya terminados, con fecha |
| [`docs/lean-canvas.md`](lean-canvas.md) | Contexto de negocio y alcance |
| [`docs/FLUJO-DE-RAMAS.md`](FLUJO-DE-RAMAS.md) | Nombres de ramas, camino normal y camino rápido (`hotfix/`) |

> Cambio actual de ejemplo: [`completar-me-esta-costando`](../openspec/changes/completar-me-esta-costando/proposal.md)
> (validación clínica, protocolo de riesgo, pruebas de interfaz y prueba en teléfono real).

## El ciclo, en cuatro pasos

```
 explorar  →  proponer  →  aplicar  →  archivar
 (pensar)    (proposal +   (código +    (la spec vigente
              specs + tasks) tests)      se actualiza)
```

| Paso | Qué hace | Claude Code | Otros agentes (estándar universal) |
|---|---|---|---|
| **Explorar** | Pensar la idea y aclarar requisitos, sin escribir archivos | `/opsx:explore` | `/openspec-explore` |
| **Proponer** | Crea el cambio con todos sus documentos de una vez | `/opsx:propose "tu idea"` | `/openspec-propose "tu idea"` |
| **Actualizar** | Revisa la propuesta y mantiene coherentes los documentos | `/opsx:update` | `/openspec-update-change` |
| **Aplicar** | Implementa las tareas de `tasks.md` | `/opsx:apply` | `/openspec-apply-change` |
| **Sincronizar** | Pasa los deltas del cambio a las especificaciones vigentes | `/opsx:sync` | `/openspec-sync-specs` |
| **Archivar** | Cierra el cambio terminado | `/opsx:archive` | `/openspec-archive-change` |

La forma exacta del comando **depende de la herramienta** (algunas usan `/opsx-propose`, `@opsx-propose` o
`$openspec-propose`). Al inicializar OpenSpec en tu equipo, te muestra la que corresponde a tu agente.

## Cuándo hace falta un cambio

| Situación | ¿Cambio de OpenSpec? |
|---|---|
| Funcionalidad nueva o comportamiento visible distinto | **Sí** |
| Cambia qué datos se guardan, la privacidad o textos clínicos | **Sí**, y lo ve el equipo clínico |
| Arreglo de un error, ajuste visual menor, mantenimiento | No: basta el Pull Request |

## Flujo para dos personas

Cada persona usa **su propio agente**; los documentos son los mismos.

1. **Persona A propone.** Crea una rama `feature/<nombre-del-cambio>` desde `main` (ver [flujo de ramas](FLUJO-DE-RAMAS.md)) y ejecuta `propose` con **2 a 4 frases** (qué quiere, para quién y
   en qué situación). El agente suele hacer preguntas: respóndelas, y revisa lo generado.
2. **Pull Request solo de la propuesta** hacia `main`. **Persona B revisa**: ¿respeta la
   [constitución](../openspec/constitution.md)?, ¿cada *Scenario* se puede comprobar?, ¿faltan casos límite (sin conexión,
   volver tras días, datos de otra cuenta, señales de riesgo)? Si toca temas clínicos, también el equipo clínico. Se une
   cuando ambas están de acuerdo.
3. **Repartir `tasks.md`.** Cada tarea tiene una persona. **Las tareas que tocan los mismos archivos no se hacen a la
   vez.**
4. **Aplicar.** Cada persona, en su rama (`feature/<cambio>-<tarea>`), usa `apply` con su agente. Un Pull Request por
   tarea o grupo de tareas, enlazando al cambio.
5. **Verificar.** La pipeline (`1 · Probar`, `2 · Compilar`) debe estar en verde. La otra persona revisa el código frente
   a los *Scenario*.
6. **Archivar.** Con todas las tareas hechas, `archive` mueve el cambio y deja las especificaciones vigentes al día.

### Reglas para no pisarse
- **Una propuesta, una persona responsable.** Quien la escribe no la aprueba.
- **Ramas cortas** y Pull Requests pequeños. Se actualiza la rama desde `main` con frecuencia.
- **Archivos compartidos** (`App.js`, `src/content.js`, `package.json`): se avisa antes de tocarlos.
- **Cambiar de idea = cambiar primero los documentos** (`update`), en un Pull Request, antes del código.
- **Los textos clínicos** (`src/content.js`) siempre pasan por el equipo clínico.

## Prompts

Tu prompt solo necesita **la intención**; el resto (principios, formato, reglas) ya lo lee el agente de
`openspec/config.yaml` y de [`AGENTS.md`](../AGENTS.md).

```
/opsx:propose Quiero que la usuaria elija a qué hora le llega cada recordatorio y pueda pausarlos todos desde Ajustes.
Piensa en alguien que se siente presionada por los avisos y quiere un respiro sin desinstalar la app.
```

```
/opsx:apply          (implementa las tareas del cambio; si algo es ambiguo, pregunta)
```

Si no tienes clara la idea, empieza por `explore`.

## Para la segunda persona: puesta en marcha

1. Clona el repositorio y ejecuta `npm install`.
2. Inicializa OpenSpec **para tu agente** (usa la misma versión fijada):
   ```bash
   npx @fission-ai/openspec@1.14.3 init --tools <tu-agente>
   ```
   Ejemplos de `<tu-agente>`: `opencode`, `codex`, `cursor`, `gemini`, `github-copilot`… (la lista completa sale con
   `npx @fission-ai/openspec@1.14.3 init --help`). Ya está configurado `claude` y el estándar universal `agents`.
3. Revisa qué archivos nuevos se generaron y **subelos** en un Pull Request, para que quede para el equipo.
4. **Desactiva la telemetría anónima** de la herramienta (es opcional y no afecta a los datos de la app):
   ```bash
   npx @fission-ai/openspec@1.14.3 config set telemetry.enabled false
   ```

## Comprobaciones

```bash
npx @fission-ai/openspec@1.14.3 validate --all --strict   # las especificaciones y los cambios son válidos
npx @fission-ai/openspec@1.14.3 list                      # cambios en curso
npx @fission-ai/openspec@1.14.3 list --specs              # capacidades vigentes
```

La pipeline ejecuta la validación en cada Pull Request: si una especificación está mal formada, no se puede unir.

## Mantenimiento
- **La versión está fijada (1.14.3)** porque OpenSpec cambia con frecuencia. Para actualizar: cambiar la versión en la
  pipeline y en este documento, ejecutar `openspec update` y revisar el resultado en un Pull Request propio.
- **Los archivos generados** (`.claude/commands`, `.claude/skills`, `.agents/`) se regeneran con `openspec update`:
  **no se editan a mano.** Lo que sí se edita es `openspec/config.yaml`, la constitución y los documentos de cada cambio.
