# Tasks

## 1. Silueta y geometría

- [x] 1.1 Preparar la entrada web de prueba y documentar los comandos de desarrollo y compilación. Abrir la página desde ambos modos.
- [x] 1.2 Dibujar la bellota, el corte embrionario y la radícula. Revisar el día 1 a 320 px.
- [x] 1.3 Trazar raíces, tronco y ramas maestras para los días 15 y 30. Comparar las dos siluetas con los puntos de inserción visibles.
- [x] 1.4 Diseñar hojas lobuladas en cuatro capas y distribuirlas sobre la copa adulta. Revisar asimetría y legibilidad a tamaño de miniatura.

## 2. Motor y SVG

- [x] 2.1 Crear el contrato TypeScript y evaluar etapas por semilla y día. Probar los 31 estados, sus diferencias consecutivas y el ciclo 30 → 10 → 30.
- [x] 2.2 Vincular grupos diarios y seis paletas. Probar que cambiar el 12 conserva los colores del 11 y las geometrías de todo el árbol.
- [x] 2.3 Implementar SVG completo, miniatura y descarga. Documentar grupos, capas, rangos y modelo de datos; abrir una exportación y probar identificadores únicos.
- [x] 2.4 Implementar reloj interrumpible y movimiento reducido. Verificar extensión de ramas, escala, giro y opacidad de hojas, pausa y desmontaje durante una transición.

## 3. Demo y bosque

- [x] 3.1 Conectar deslizador, reproducción, registro y selección de emoción. Recorrer el historial en ambos sentidos con teclado y pantalla táctil.
- [x] 3.2 Implementar el adaptador local versionado con consentimiento y borrado. Probar recarga, colores históricos, datos inválidos y almacenamiento inaccesible.
- [x] 3.3 Dibujar doce meses con el mismo motor y ampliar el seleccionado. Verificar cambio de año, conservación del día registrado y recuento de nodos con doce árboles adultos.

## 4. Verificación

- [x] 4.1 Ejecutar npm test, lint, typecheck, compilación web y validación OpenSpec estricta; registrar resultados.
- [x] 4.2 Revisar los escenarios completos en navegador móvil y escritorio, incluida la exportación tras editar y recargar.
- [x] 4.3 Documentar las etiquetas y paletas de prueba pendientes de revisión del equipo clínico antes de integrarlas al producto.

## 5. Correcciones de ilustración

- [x] 5.1 Afinar el tallo juvenil, trasladar los tres primeros registros y comprobar ocho hojas individuales al día 8.
- [x] 5.2 Dibujar uniones laterales, madera nudosa y ramillas con follaje de dirección y densidad variables. Revisar los días 1, 8, 15 y 30 y ejecutar las verificaciones del proyecto.
- [x] 5.3 Corregir el aleteo durante la reproducción y comprobar la orientación de hojas ya formadas entre fotogramas consecutivos.

## Registro de verificación

El 9 de noviembre se revisaron los fotogramas 3, 5, 6, 7, 8 y 30 con la bellota que encoge y las horquillas con contorno continuo. En el navegador se seleccionaron por separado los registros 1, 2 y 3 del roble adulto.

El 8 de noviembre de 2026 pasaron 101 pruebas de Jest en 11 suites, lint, TypeScript, la compilación web y la validación estricta de OpenSpec. En navegador se revisaron las poses de los días 1, 15 y 30, incluida la germinación a 320 px. Tras corregir el registro 12 y recargar, el 11 conservó «Calma» y el 12 mostró «Tristeza». El SVG descargado contenía los 30 grupos diarios. Se comprobó el cambio de año y la apertura de dos árboles en distintas etapas. La revisión móvil utilizó una ventana de navegador de tamaño móvil.
