# Flujo de ramas y publicación

**Una sola rama permanente: `main`.** Todo el trabajo sale de `main` y vuelve a `main` por Pull Request. Lo que cambia entre
"probar" y "publicar" no es la rama, sino **el destino que se elige al publicar**.

```
feature/x ──PR──▶ main ──(automático)──▶ staging        probar
                    │
                    └──(manual, con aprobación)──▶ producción

hotfix/x  ──PR──▶ main
(sale de lo que    └──(manual, con aprobación, desde la propia rama hotfix)──▶ producción
 está en producción)
```

## Las ramas

| Rama | Para qué | Sale de | Va a |
|---|---|---|---|
| **`main`** | Única rama permanente. La fuente de todo | — | — |
| `feature/…` | Trabajo normal: funcionalidades, arreglos, documentación, mantenimiento | `main` | `main` (Pull Request) |
| `hotfix/…` | Arreglo urgente que no puede esperar | **la última versión publicada en producción** | `main` (Pull Request) |

No existen otras ramas (ni `staging`, ni `fix/`, `docs/`, `chore/`). Nombres: `feature/recordatorios-pausables`,
`hotfix/boton-me-esta-costando-no-abre`. Solo minúsculas, números, `.`, `_` y `-`.

## Dónde se publica

| Cuándo | Qué ocurre |
|---|---|
| Se une un Pull Request a `main` | Se prueba, se compila y se **publica solo en `staging`** |
| Una persona lo pide a mano | **Actions → Pipeline → Run workflow:** eliges la **rama** y el **entorno** (`staging` o `produccion`) |

Combinaciones permitidas al publicar a mano:

| Rama elegida | `staging` | `produccion` |
|---|---|---|
| `main` | ✅ | ✅ (con aprobación) |
| `hotfix/…` | ✅ | ✅ (con aprobación y si parte de producción) |
| `feature/…` u otra | ❌ | ❌ |

**Producción siempre exige la aprobación** de una persona en el entorno `Production`.

## Qué hay en producción: las etiquetas `prod/…`

Como `main` puede tener cambios todavía sin publicar, producción **no siempre es lo último de `main`**. Por eso, cada vez que
se publica a producción la pipeline crea una etiqueta de git `prod/AAAA-MM-DD-HHMMSS` sobre la versión publicada.

```bash
git fetch origin --tags
git tag -l 'prod/*' --sort=-creatordate | head -1     # la que está hoy en producción
git log --oneline prod/<etiqueta>..origin/main        # lo que main tiene y producción todavía no
```

Esa etiqueta es la referencia de la que **debe salir cualquier hotfix**.

## Camino normal

1. `git switch main && git pull && git switch -c feature/nombre`
2. Pull Request **hacia `main`**. La pipeline prueba y compila; la otra persona revisa.
3. Al unirlo, **staging se actualiza solo**. Se prueba ahí.
4. Cuando se quiera publicar: **Run workflow → rama `main` → entorno `produccion`**, y aprobar. El resumen de la ejecución lista
   **qué commits se van a publicar** (los que hay desde la etiqueta actual).

## Camino rápido: `hotfix/`

**Úsalo solo** si lo que está en producción hace daño o no funciona: una pantalla clave no abre, se guarda algo que no
debería, un texto clínico es incorrecto o se publicó con una configuración equivocada. **No** por prisa con una funcionalidad.

1. **Crea la rama desde producción, no desde `main`:**
   ```bash
   bash scripts/crear-hotfix.sh nombre-corto
   ```
   Hace `fetch`, busca la última etiqueta `prod/…` y crea `hotfix/nombre-corto` desde ahí.
2. Haz **solo el arreglo**, lo mínimo, con su prueba si es posible. Súbela.
3. Abre el Pull Request **hacia `main`**. Si la rama no partió de producción, la comprobación **falla** y lo dice.
4. **Publica desde la propia rama:** *Actions → Pipeline → Run workflow → "Use workflow from": `hotfix/nombre-corto` →
   entorno `produccion`*. Tras aprobar, el arreglo está en producción y se crea la nueva etiqueta.
5. **Une el Pull Request a `main`**, para que el arreglo no se pierda en la siguiente publicación.

> Mientras un hotfix esté publicado pero **sin unir a `main`**, la pipeline **no deja publicar `main` a producción** (la
> versión de producción no estaría contenida en `main` y el arreglo se perdería). Hay que unirlo primero.

## Qué comprueba la pipeline

**`0 · Destino`** (cada ejecución) y **`0 · Reglas de ramas`** (cada Pull Request):

| Situación | Resultado |
|---|---|
| Pull Request de `feature/…` hacia `main` | ✅ |
| Pull Request de `hotfix/…` hacia `main` que parte de producción | ✅ |
| Hotfix que arrastra cambios de `main` sin publicar | ❌ "créalo con `scripts/crear-hotfix.sh`" |
| Hotfix que no parte de la última versión de producción | ❌ |
| Rama con nombre fuera de la convención (`fix/`, `docs/`, mayúsculas, espacios…) | ❌ |
| Publicar desde una rama que no es `main` ni `hotfix/…` | ❌ |
| Publicar `main` a producción si le falta lo que ya está en producción | ❌ "únelo primero a `main`" |
| Elegir un entorno que no sea `staging` ni `produccion` | ❌ |

El código está en [`.github/scripts/validar-destino.sh`](../.github/scripts/validar-destino.sh) y
[`.github/scripts/validar-ramas.sh`](../.github/scripts/validar-ramas.sh), con sus workflows en
[`pipeline.yml`](../.github/workflows/pipeline.yml) y [`reglas-de-ramas.yml`](../.github/workflows/reglas-de-ramas.yml).

## Volver atrás

La pipeline no publica etiquetas antiguas. Para revertir un cambio malo en producción:
1. `bash scripts/crear-hotfix.sh revertir-algo` (parte de producción).
2. `git revert <commit-malo>` y súbelo.
3. Pull Request a `main` y publicar el hotfix como arriba.

(Si es una urgencia máxima, Vercel permite además restaurar un despliegue anterior desde su panel.)

## Configuración en GitHub (se hace una sola vez)

**1. Un solo ruleset, para `main`** (*Settings → Rules → Rulesets*):
- Enforcement **Active**, destino `main`, sin lista de excepciones.
- ☑ Restrict deletions · ☑ Block force pushes
- ☑ Require a pull request before merging (aprobaciones: **0** con una persona, **1** con dos; método de unión: solo **Merge**)
- ☑ Require status checks: **`0 · Reglas de ramas`**, **`1 · Probar`**, **`2 · Compilar`**
  (aparecen en la lista después de haberse ejecutado una vez). No marques "up to date" ni "deployments to succeed".

**2. Entornos** (*Settings → Environments*): ambos deben aceptar publicaciones desde `main` **y** desde los hotfix.
- **`Production`**: *Required reviewers* (tú) · *Deployment branches → Selected branches and tags* → `main` y `hotfix/*`.
  (El valor "Protected branches" no sirve: los `hotfix/*` no están protegidos y no podrían publicar.)
- **`staging`**: *Deployment branches → Selected branches* → `main` y `hotfix/*`.

**3. Repositorio** (*Settings → General → Pull Requests*): ☑ Allow merge commits · ☐ squash · ☐ rebase ·
☑ Automatically delete head branches.

## Antes del primer hotfix (puesta en marcha)

La etiqueta actual (`prod/2026-10-21-042650`) se creó a mano y apunta a una versión **anterior a esta pipeline**. Un hotfix
creado desde ahí no tendría el botón de publicar a mano. Por eso:

1. Une este cambio a `main`.
2. Haz **una publicación a producción con la pipeline nueva** (*Run workflow → `main` → `produccion`*). Eso crea una etiqueta
   desde un commit que ya incluye todo, y a partir de ahí los hotfix funcionan.
