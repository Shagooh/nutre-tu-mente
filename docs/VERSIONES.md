# Versiones de la app

La versión de la app vive en **un solo sitio: `package.json`**, con formato **`MAJOR.MINOR.PATCH`** (por ejemplo `1.2.0`).
Cada versión que llega a producción deja una **etiqueta de git `vX.Y.Z`** (por ejemplo `v1.2.0`), y **una versión no se
puede repetir**: la pipeline lo comprueba.

## Reglas (las hace cumplir la pipeline)

| Regla | Dónde se comprueba |
|---|---|
| La versión debe ser válida: `X.Y.Z`, solo números (`1.0`, `v1.0.0` o `1.0.0-beta` **no** valen) | Cada ejecución (`1 · Probar`) y cada Pull Request |
| `package.json` y `package-lock.json` deben decir **lo mismo** | `1 · Probar` |
| **Para publicar a producción hace falta una versión nueva y mayor** que la última publicada | `0 · Destino` |
| Si la etiqueta `vX.Y.Z` ya existe, **esa versión no se puede volver a publicar** | `0 · Destino` |
| En un Pull Request, si una `feature/` cambia la versión, debe ser **mayor** que la de `main` y que la última publicada | `0 · Reglas de ramas` |
| Un `hotfix/` **debe subir la versión** (siempre se publica a producción) | `0 · Reglas de ramas` y `0 · Destino` |
| Publicar a **staging** no exige versión nueva | — |

La etiqueta la crea la pipeline **solo después de publicar con éxito** a producción, sobre el commit exacto que se
publicó, y con la versión que dice **ese** `package.json`. Nadie escribe la etiqueta a mano.

## Cómo subir la versión

```bash
npm version patch --no-git-tag-version   # 1.0.0 -> 1.0.1  (arreglos)
npm version minor --no-git-tag-version   # 1.0.1 -> 1.1.0  (funcionalidades nuevas)
npm version major --no-git-tag-version   # 1.1.0 -> 2.0.0  (cambios grandes o que rompen algo)
```

Cambia `package.json` **y** `package-lock.json` a la vez (no crea ningún commit ni etiqueta por su cuenta). Después haz
commit como siempre. **No edites el número a mano** en un solo archivo: la comprobación fallaría.

También se actualiza sola la versión que ve la app móvil (`app.config.js` la lee de `package.json`), así no hay que
tocar `app.json`.

### Qué subir y cuándo (guía para esta app)

| Cambio | Sube |
|---|---|
| Arreglo de un error, ajuste de textos, mantenimiento | `patch` (1.0.0 → 1.0.1) |
| Funcionalidad nueva (nueva pantalla, nueva pregunta, nueva lección…) | `minor` (1.0.1 → 1.1.0) |
| Cambio grande, rediseño, o que cambia lo que se guarda de forma incompatible | `major` (1.1.0 → 2.0.0) |
| Un hotfix | `patch`, y **lo hace solo** `scripts/crear-hotfix.sh` |

## Cuándo se cambia la versión

- **No en cada Pull Request.** Una `feature/` normal deja la versión como está.
- **Al preparar una publicación:** un Pull Request pequeño (`feature/version-1-2-0`) que solo ejecuta `npm version …` y
  se une a `main`. Luego se publica a producción desde `main`.
- **En un hotfix:** `scripts/crear-hotfix.sh` ya sube el `patch` en el primer commit.

## Ver qué versión hay dónde

```bash
git fetch origin --tags
git tag -l 'v*' --sort=-v:refname | head -3                  # las últimas versiones publicadas (la primera es la de producción)
git log --oneline v1.2.0..origin/main                        # lo que main tiene y la versión 1.2.0 todavía no
git show v1.2.0:package.json | grep '"version"'              # comprobar la versión de una etiqueta
```

En GitHub: pestaña **Code → Tags**.

## Qué pasa en un hotfix si `main` ya subió de versión

`main` puede tener ya `1.1.0` (sin publicar) mientras producción está en `1.0.0`. El hotfix sale de producción y sube a
`1.0.1`; es correcto que sea **menor** que la de `main`, porque aún no se publicó la `1.1.0`.

Al unir el hotfix a `main`, `package.json` y `package-lock.json` pueden entrar en **conflicto** (`1.0.1` frente a `1.1.0`).
**Conserva la versión de `main` (`1.1.0`)**: es la mayor y la próxima a publicar. Así, la siguiente publicación (`1.1.0`) será
mayor que la del hotfix (`1.0.1`) y pasará la regla.

> Si al unir te quedaste con `1.0.1` en `main`, la pipeline **no te dejará publicar**: esa versión ya existe.

## Errores frecuentes

| Mensaje | Qué hacer |
|---|---|
| "La versión X ya se publicó … no se puede repetir" | Sube la versión (`npm version …`): ya hay una etiqueta con ese número. |
| "debe ser MAYOR que la última publicada" | Tu versión es igual o menor que la de producción. Súbela por encima. |
| "package-lock.json dice … y package.json dice …" | Se cambió a mano un solo archivo. Usa `npm version … --no-git-tag-version`. |
| "no es válida. Debe ser X.Y.Z" | Quita letras o prefijos (`v`, `-beta`) y deja tres números. |
| "Un hotfix … debe SUBIR la versión" | Falta el `patch`: créalo con `scripts/crear-hotfix.sh`, que lo hace solo. |

## Tiendas de aplicaciones (más adelante)

`package.json` es la versión que ve la gente (`1.2.0`). Google Play y la App Store piden además un número de compilación
(`versionCode` en Android y `buildNumber` en iOS) que **debe aumentar en cada envío** a la tienda. Cuando se publique en las
tiendas conviene dejar que EAS lo incremente solo (`appVersionSource: remote` y `autoIncrement`), sin tocar el `package.json`.
