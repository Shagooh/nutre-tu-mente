This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Desarrollo guiado por especificaciones (OpenSpec)

Este proyecto usa OpenSpec (`openspec/`). Antes de implementar una funcionalidad:

1. Lee `openspec/constitution.md` (principios que nunca se rompen: sin peso/calorías/rachas, sin castigos, tono de tú, datos mínimos) y `openspec/config.yaml` (contexto y reglas del proyecto).
2. Si es una funcionalidad nueva o cambia el comportamiento, **primero** crea un cambio (`/opsx:propose` o el comando equivalente de tu agente) y no escribas código hasta que la propuesta esté aprobada.
3. Implementa solo las tareas de `openspec/changes/<cambio>/tasks.md` y cumple los *Scenario* de sus especificaciones. Si algo es ambiguo, pregunta.
4. Al terminar, ejecuta `npm test` y `npx @fission-ai/openspec@1.14.3 validate --all --strict`.
5. Comportamiento vigente: `openspec/specs/`. Negocio: `docs/lean-canvas.md`. Proceso para dos personas: `docs/PROCESO-SDD.md`.
6. Los textos clínicos (`src/content.js`) los valida el equipo clínico: no los des por definitivos.
7. Ramas: una sola permanente, `main`. El trabajo normal va en `feature/…` (sale de `main` y vuelve a `main` por Pull Request). Los arreglos urgentes van en `hotfix/…`, que se crean con `bash scripts/crear-hotfix.sh nombre` desde **lo que está en producción** (la última versión etiquetada `vX.Y.Z`), no desde `main`. No existen otras ramas ni `staging` como rama: el destino (staging o producción) se elige al publicar. Detalle en `docs/FLUJO-DE-RAMAS.md`.
8. Versiones: la versión de la app vive solo en `package.json` (`X.Y.Z`). No la toques en un Pull Request normal. Para cambiarla usa `npm version <patch|minor|major> --no-git-tag-version` (nunca editando un solo archivo a mano) y solo al preparar una publicación o en un hotfix. Una versión no se puede repetir: cada publicación a producción deja la etiqueta `vX.Y.Z`. Detalle en `docs/VERSIONES.md`.
9. Los archivos de `.claude/commands`, `.claude/skills` y `.agents/` los genera OpenSpec (`openspec update`): no los edites a mano.
