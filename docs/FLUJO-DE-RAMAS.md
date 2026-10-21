# Flujo de ramas

Dos ramas **permanentes** y varias ramas **cortas** de trabajo, con el tipo indicado en el nombre.

| Rama | Qué es | Se publica en |
|---|---|---|
| `main` | Lo que usan las personas | **Producción** (con aprobación manual en el entorno `Production`) |
| `staging` | Lo que se está probando antes de salir | Entorno de pruebas |

## Convención de nombres

`tipo/nombre-en-minusculas-con-guiones`

| Prefijo | Para qué | Sale de | Va a |
|---|---|---|---|
| `feature/` | Funcionalidad nueva o cambio de comportamiento | `staging` | `staging` |
| `fix/` | Arreglo normal (no urgente) | `staging` | `staging` |
| `docs/` | Solo documentación | `staging` | `staging` |
| `chore/` | Mantenimiento: dependencias, pipeline, configuración | `staging` | `staging` |
| **`hotfix/`** | **Arreglo urgente que no puede esperar** | **`main`** | **`main`** (directo) |

Ejemplos: `feature/recordatorios-pausables` · `fix/error-al-guardar-checkin` · `chore/actualizar-expo` ·
`hotfix/boton-me-esta-costando-no-abre`.
Solo letras minúsculas, números, `.`, `_` y `-`. Sin espacios, sin mayúsculas, sin acentos.

## Camino normal

```
feature/x ──PR──▶ staging ──PR──▶ main
                  (se prueba)     (producción, con aprobación)
```

1. Crea la rama desde **`staging`** actualizada: `git checkout staging && git pull && git checkout -b feature/x`.
2. Pull Request **hacia `staging`**. La pipeline prueba y compila; la otra persona revisa.
3. Cuando lo de `staging` esté probado, Pull Request **de `staging` hacia `main`**.
4. En producción, la pipeline queda **esperando tu aprobación** antes de publicar.

## Camino rápido: `hotfix/`

```
hotfix/x ──PR──▶ main        (luego)  main ──▶ staging
(sale de main)   (producción)          (sincronizar)
```

**Úsalo solo** si lo que está en producción hace daño o no funciona, por ejemplo:
- una pantalla clave no abre o la app se cierra (ej. el botón "Me está costando");
- se guarda algo que no debería guardarse, o se expone información de alguien;
- un texto clínico es incorrecto o puede hacer daño;
- se publicó con una configuración equivocada.

**No** lo uses por prisa con una funcionalidad. Eso va por el camino normal.

Pasos:

1. Crea la rama **desde `main`**, no desde `staging`:
   ```bash
   git fetch origin
   git checkout -b hotfix/nombre-corto origin/main
   ```
2. Haz **solo el arreglo**, lo mínimo, con su prueba si es posible.
3. Pull Request **hacia `main`**. La pipeline prueba y compila igual que siempre.
   Una persona lo revisa y **aprueba la publicación** en el entorno `Production`.
4. **Sincroniza `staging`** de inmediato, para que no pierda el arreglo y no vuelva a aparecer:
   ```bash
   git fetch origin
   git checkout staging
   git merge origin/main      # si staging no tiene cambios propios, será un avance rápido
   git push origin staging
   ```
   (También se puede hacer con un Pull Request de `main` hacia `staging`: la regla lo permite.)
5. Si el arreglo cambia el comportamiento descrito en `openspec/specs/`, **actualiza la especificación** en el siguiente
   Pull Request normal.

## Qué comprueba la pipeline (`0 · Reglas de ramas`)

| Pull Request | Resultado |
|---|---|
| `staging` → `main` | ✅ Permitido (publicación normal) |
| `hotfix/…` → `main` | ✅ Permitido, **si la rama sale de `main`**. Si arrastra commits de `staging` que no están en producción, **falla** |
| `feature/`, `fix/`, `docs/`, `chore/` → `staging` | ✅ Permitido |
| `main` → `staging` | ✅ Permitido (sincronización) |
| `feature/…` (u otra) → `main` | ❌ Falla: debe pasar primero por `staging` |
| `hotfix/…` → `staging` | ❌ Falla: los hotfix van a `main` |
| Nombre fuera de la convención | ❌ Falla, con un mensaje que explica el formato |

La regla está en [`.github/scripts/validar-ramas.sh`](../.github/scripts/validar-ramas.sh) y se ejecuta con
[`.github/workflows/reglas-de-ramas.yml`](../.github/workflows/reglas-de-ramas.yml).

## Para que se cumpla de verdad (en GitHub)

La comprobación **avisa**, pero solo **bloquea** si la marcas como obligatoria. En
*Settings → Rules → Rulesets → New branch ruleset*, para `main` y para `staging`:

- **Require a pull request before merging** (nadie sube directo).
- **Require status checks to pass:** `0 · Reglas de ramas`, `1 · Probar` y `2 · Compilar`.
- **Block force pushes** y **Restrict deletions**.
- Si hay dos personas: pedir **1 aprobación**. Con una sola persona déjalo en 0 o permite el salto a administradores,
  porque nadie puede aprobar su propio Pull Request.

Las comprobaciones aparecen en la lista solo después de haberse ejecutado una vez.

## Después de unir

Borra la rama de trabajo (en *Settings → General → Pull Requests* se puede activar **"Automatically delete head branches"**).
Las ramas `main` y `staging` **nunca se borran**.
