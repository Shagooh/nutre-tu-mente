# Design

## Context

El repositorio usa Expo SDK 57, React 19 y Jest. La planta actual de `src/components/Planta.js` recibe puntos y una flor. El laboratorio necesita días e identidad por hoja. La serie de referencia `SVG-ARBOL/` tiene un encuadre vertical de 1080 × 1920. Su visor y el de `assets/pruebas/roble/` sirven para revisar proporciones.

## Goals / Non-Goals

La demo se ejecutará y compilará por separado del punto de entrada móvil. El motor debe permitir que en el futuro otro renderizador consuma los mismos datos en React Native. La integración con Expo Go, cuentas y el diario queda fuera de esta entrega de desarrollo.

## Decisions

- **Composición artística.** Dibujar primero tres poses en coordenadas maestras (1, 15, 30). Fijar los apoyos de las raíces, las bifurcaciones y los extremos de la copa adulta. Diseñar un tronco con curvas de Bézier, contorno de anchura variable y ramas que nazcan sobre la madera. Dibujar varias hojas con lóbulos romos y nervadura central. Variar apertura, perfil, tamaño y ángulo dentro de límites por rama. Validar las poses en teléfono y en miniatura antes de construir los controles.
- **Germinación.** Mostrar la radícula primero, después el brote y las primeras hojas verdaderas. Un corte ilustrado de la bellota deja ver las regiones embrionarias coloreables de los primeros registros. Esos grupos conservan sus identificadores cuando el tallo crece.
- **Transición al tallo.** La bellota encoge alrededor del pie del tallo hasta desaparecer el día 8. Cada uno de los tres primeros registros conserva una sola hoja que cambia de posición, tamaño e inclinación mientras se despliega sobre su ramilla. El día 8 tiene ocho hojas insertadas a alturas alternas. En las horquillas, los dos bordes de cada rama se prolongan hasta puntos distintos bajo la superficie de la madera madre.
- **Ramificación y copa.** Cada rama nace sobre el flanco de su rama madre, con un engrosamiento local y dos cambios de dirección. Las hojas se distribuyen a lo largo de ramillas de distinta longitud e inclinación. Una segunda ramilla en sombra da profundidad a los grupos maduros y toma la paleta del mismo registro.
- **Motor TypeScript puro.** La entrada pública es `TreeConfig { treeId: string, seed: number, growthDay: number, moods: Record<number, Mood> }`. Construir una topología versionada por semilla con identificador, padre, punto de inserción, día de aparición y geometría final. Evaluar curvas por edad local para que una rama brote de su punto de inserción ya formado. Separar el generador de la tabla de paletas. Para un registro sin emoción elegida, usar un color de reserva y la etiqueta «Sin seleccionar», conservando la diferencia con una elección explícita de neutral.
- **Render y animación.** La demo dibuja SVG nativo con React. Un único reloj requestAnimationFrame interpola entre estados, se cancela al pausar, cambiar de árbol o desmontar y responde a prefers-reduced-motion. Las miniaturas estáticas agrupan trazados por día y paleta y omiten nervaduras finas. Aislar los identificadores por instancia en el documento y emitir los nombres canónicos en el SVG descargado, con colores y atributos incorporados.
- **Datos.** Un adaptador local conserva un documento versionado con árboles indexados por año y mes, treeId, seed, versión de geometría, growthDay y moods. El cursor de inspección es transitorio. Una acción de registrar día avanza hasta 30. El deslizador y la reproducción permiten previsualizar el crecimiento sin inventar registros. Las correcciones afectan solo a días registrados. Solicitar consentimiento antes de persistir, ofrecer borrado y mantener una sesión en memoria si el almacenamiento falla.
- **Herramientas.** Usar React y React DOM instalados, código TS/TSX y un punto de entrada web de desarrollo separado. Compilar con herramientas locales documentadas y reutilizar Jest. No se prevén dependencias nativas ni servicios. Expo Go sigue ejecutando la app habitual.

## Risks / Trade-offs

- Copa ilegible al reducirla → revisar las poses a 320 px de ancho y el bosque con doce miniaturas; ajustar los huecos entre ramas y el tamaño mínimo de los lóbulos.
- Identidad perdida al reproducir el historial → persistir la versión del generador y probar el ciclo de ida y vuelta y la recarga.
- Colores difíciles de distinguir → acompañarlos con selección visible y texto accesible. Los nombres y las paletas para uso real pasan a revisión clínica.
