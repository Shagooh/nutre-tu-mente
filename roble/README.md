# Roble emocional

Laboratorio web de desarrollo de Nutre tu mente. Al abrirlo por primera vez aparece un roble adulto con treinta registros ficticios. Puedes probar una corrección sobre esa muestra o crear un árbol desde semilla en un mes vacío.

## Ejecutar

Desde la raíz del repositorio, con Node 24.12 y las dependencias del proyecto instaladas (`npm ci`):

```sh
npm run roble
```

Abre http://127.0.0.1:4173. El servidor local recompila el código al editarlo. Recarga la pestaña para ver los cambios.

```sh
npm run roble:build
```

La compilación escribe `index.html`, `app.css` y `app.js` en `dist/roble/`. Puedes abrir ese HTML o servir el directorio con un servidor HTTP estático. Para probar persistencia usa siempre el mismo origen HTTP. React y sus recursos se empaquetan localmente. esbuild y los tipos de React DOM son herramientas de desarrollo.

## Probar la interacción

1. Mueve **Explorar día** a 3, 5, 6, 7 y 8. La bellota encoge hasta desaparecer. Cada una de sus tres hojas se despliega desde el interior de la semilla hasta su ramilla. El día 8 puedes contar ocho hojas. En el día 30, selecciona los días 1, 2 y 3 en el historial para localizarlos en la copa adulta. **Reproducir** recorre los avances. Con movimiento reducido, la reproducción cambia de estado sin interpolar.
2. En el día 30, elige el registro 12 en **Historial del mes** y cambia su emoción. Comprueba el registro 11 y vuelve al 12. También puedes tocar una hoja para seleccionarla. **↓ SVG** descarga el estado visible con sus colores.
3. Abre **Bosque anual**, selecciona un mes vacío y pulsa **Registrar día** para obtener la primera etapa. El deslizador explora todo el ciclo sin añadir registros. El archivo mensual permanece disponible al cambiar de mes y de año.
4. **Guardar en este navegador** activa la persistencia de los datos de prueba. Recarga y abre el mismo mes. **Borrar datos de prueba** elimina el bosque local. Una nueva sesión sin bosque guardado vuelve a ofrecer la muestra.

## Datos y dibujo

`model.ts` define `TreeConfig`, las seis paletas y las etapas. `growthDay` representa un entero de 0 a 30. `moods` indexa emociones por registro, desde 1. Una emoción ausente se muestra como «Sin seleccionar». El cursor de la animación vive en memoria.

`geometry.ts` construye ejes curvos unidos a puntos del eje padre y distribuye grupos de hojas con variaciones derivadas de la semilla y un identificador estable. Evaluar el día 30 directamente produce la misma pose que regresar desde el 10. `useGrowth.ts` controla un único reloj interrumpible.

`Oak.tsx` dibuja y exporta el SVG con viewBox `0 0 1024 1024`. El grupo raíz `tree` contiene `roots`, `trunk`, `primary-branches`, `secondary-branches`, `seed` y `foliage`. Los grupos visibles `day-01` a `day-30` llevan `data-day`. Cada uno contiene las clases `leaf-base`, `leaf-shadow`, `leaf-highlight` y `leaf-vein`. Los primeros tres grupos muestran tejido embrionario dentro del corte de la bellota. El SVG descargado usa los nombres canónicos y colores explícitos. Cada miniatura estática usa el mismo motor y omite los detalles finos para su escala.

`storage.ts` intercambia un documento JSON con la clave `nutrimind.roble-laboratorio.v1` en localStorage:

```json
{
  "version": 1,
  "trees": {
    "2026-11": {
      "version": 1, "month": "2026-11", "treeId": "2026-11",
      "seed": 2451, "growthDay": 2, "moods": {"1": "calm", "2": "sad"}
    }
  }
}
```

La versión del árbol identifica las reglas de geometría. El motor y este contrato se pueden usar desde otro renderizador o adaptador de almacenamiento. Los datos de prueba permanecen en el navegador.

## Verificación y revisión clínica

Ejecuta `npm test -- --runInBand`, `npm run lint` y `npm run typecheck` desde la raíz. Las pruebas del laboratorio están en `roble/__tests__/`.

Las etiquetas de prueba son Alegría, Calma, Tristeza, Inquietud, Energía y Neutral. El equipo clínico debe revisar su redacción y las asociaciones de color antes de incorporarlas al producto. Todas las emociones comparten la misma geometría de crecimiento.
