# Instrucciones del proyecto para Claude Code

Las reglas del proyecto viven en `AGENTS.md`, que comparten todos los agentes (Claude Code, OpenCode, etc.). Se importan
aquí para no mantener dos copias:

@AGENTS.md

## Reglas de trabajo con Claude Code

- Responde y documenta **en español**.
- **Verifica antes de afirmar.** Distingue siempre lo que comprobaste (con una prueba, un comando o una consulta) de lo que
  supones. No des por hecho que algo funciona en GitHub, Firebase o Vercel si no lo has visto.
- **Pide confirmación antes de publicar, borrar o subir a `main`.** Un Pull Request nuevo o una rama de trabajo no la
  necesitan; publicar a producción, borrar ramas o etiquetas y reescribir historial, sí.
- **Nunca `git add -A` ni `git add .`.** Añade los archivos por nombre: puede haber cambios de otra persona sin subir.
- **Las ramas y las versiones siguen la convención** de `docs/FLUJO-DE-RAMAS.md` y `docs/VERSIONES.md`: `feature/` y
  `hotfix/`, y una versión nunca se repite.
- **No escribas claves ni identificadores de Firebase en documentos del repositorio.** Se copian desde la consola a las
  variables de GitHub.
- Si necesitas leer algo de GitHub, la API anónima tiene un límite bajo por hora: prefiere las páginas públicas o
  espera, en lugar de insistir.
