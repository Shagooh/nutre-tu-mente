# Design

## Context

Ver `proposal.md` y `docs/PLAN-ACTUALIZACION-V1.md`. Base 74ebfec: JavaScript, SDK 57, Auth por correo, un blob AsyncStorage, sincronización cliente a Firestore por lotes y marcas `_s`. No existe backend HTTP propio. La identidad de registros ya evita algunos duplicados pero no conflictos de contenido. Hay una inicialización directa de Sentry que omite el módulo de privacidad. Las pruebas actuales cubren lógica y reportes aislados, no reglas ni importación de App.

## Goals / Non-Goals

**Goals:** entrega inicial de seguridad independiente de recursos gráficos; dominio nuevo compatible con datos anteriores; contenido editable en archivos con trazabilidad; interfaces de recursos para integrar SVG finales sin rehacer el dominio.

**Non-Goals:** no implementar todas las herramientas V1 en un PR; no backend PostgreSQL, consola clínica o cobros; no conversión masiva a TypeScript; no asumir que un DSN público es una credencial secreta ni que CORS aísla cuentas.

## Decisions

### 1. Base remota más respaldo selectivo

Trabajar desde 74ebfec; respaldo acda420 en rama separada. No hacer cherry-pick del prototipo entero: los cambios compartidos de App/store sobrescribirían las cuentas. Portar funciones puras mensuales y casos de prueba cuando correspondan al nuevo contrato. Evitar arrastrar fotos, 12 especies, adornos o Docker.

### 2. Persistencia local antes de confirmar

Mantener AsyncStorage para esta entrega y separar carga, error, guardado pendiente y guardado confirmado. Encolar escrituras para que una vieja no termine después de una nueva. Una lectura inválida impide el efecto de escritura automática; reintentar sin reiniciar el blob. El comando de guardado devuelve una promesa de persistencia y la pantalla espera su resultado. El reinicio debe conservar IDs y operaciones pendientes. No agregar SQLite en este cambio: evitar otra migración simultánea.

### 3. Operaciones inmutables y sesión cercada

Conservar IDs persistidos, aumentar su robustez con UUID compatible confirmado en documentación antes de implementar. Para registros inmutables, crear si no existe; si existe comparar contenido canónico excluyendo transporte, y aceptar solo igualdad. El timestamp de servidor se fija en creación. Reglas deben impedir modificar contenido o timestamp de un registro ya creado; probar la lectura posterior a una respuesta perdida. Para perfil mutable usar revisión y transacción: si cambió la revisión remota, fusionar campos disjuntos y exponer conflictos del mismo campo, sin sobrescritura silenciosa por reloj del teléfono.

Cada operación captura UID y generación de sesión/almacenamiento; verificar ambos antes de cada aplicación local. Serializar sync y borrado. Verificar también arranque con sesión restaurada antes de datos cargados, cierre durante sync y datos locales de otra cuenta. No borrar ni subir por un 401 genérico.

### 4. Borrado con estado persistente

Guardar una operación de borrado con ID estable y fase; detener subidas. En nube usar `syncControls/{uid}` con estado activo, eliminando o borrado y generación. Las reglas impiden crear o actualizar datos durante los lotes de borrado reanudables. La barrera permanece en borrado tras confirmar eliminación de registros y perfil; solo una confirmación explícita puede activarla con otra generación, invalidando dispositivos antiguos. No declarar atómico el conjunto de lotes. Solo después del remoto confirmado vaciar local. Eliminar cuenta conserva el teléfono como hoy se informa, pero exige confirmación explícita antes de asociar esa copia a otra cuenta. Si se pierde la sesión tras eliminar la nube, permitir conservar explícitamente la copia local desvinculada sin declarar éxito de eliminación de identidad. Ver ciclo y recuperación en `docs/BASE-SEGURA.md`.

### 5. Telemetría por un único módulo

Eliminar la inicialización global de App y usar `src/reportes.js` como única entrada, incluyendo el captador de errores no controlados. No capturar mensajes libres: catálogo de códigos técnicos y filtro defensivo. Prueba que importe App con mocks y demuestre cero inicializaciones antes del consentimiento, no solo tests del módulo. Coordinar los resultados con el cambio Sentry abierto sin marcar sus pruebas externas como hechas.

### 6. Datos nuevos y bosque derivado

Agregar `schemaVersion`; mantener IDs antiguos. Nuevos check-ins: emoción estable, intensidad ordinal 1–3, necesidad, fecha local, instante y nota opcional. Mantener formatos antiguos legibles y no convertir ánimo a emoción. Árbol por `YYYY-MM`, especie y nombre; hojas derivadas de check-ins y diario por fecha, evitando almacenar copias divergentes de notas. Proyección determinista compartida con pruebas sobre orden distinto de llegada; ningún promedio de colores. En empate gana el último de intensidad máxima, ordenado por instante y luego ID.

Especies finales como IDs `araucaria`, `quillay`, `cerezo`, `sauce`, `olivo`, `jacaranda`. Confirmado por producto: solo hay una serie encargada, roble de prueba, con 30 SVG incluyendo semilla previa al primer check-in. Manifiesto de prueba 0–29 e índice `min(días registrados, 29)`; adulto desde 29 días. No vender ese recurso como una de las seis especies ni inventar seis series. Manifiesto ampliable por especie con anclajes para hojas pulsables. Las hojas se superponen al fotograma, incluyen iconos y pueden abrir una lista accesible cuando se solapan. Validar `viewBox`, tamaño, ausencia de scripts/recursos externos y cantidad. Cargar solo el fotograma visible. La aceptación visual de las especies finales espera sus recursos.

### 7. Contenido y rutas

Catálogos fuera de `src/app/` con ID, sección fuente, versión, fase, trato y aprobación. Preservar texto clínico exacto; faltantes quedan explícitos. Versionar snapshots de catálogo, no reemplazar valores guardados por índices de listas. Mapear temas a cápsulas 1–4 aprobadas; sin redactar cuerpos ausentes. Definir rutas Expo Router por etapas, manteniendo módulos de dominio separados. Las APIs exactas y dependencias Router/SVG se verifican en docs SDK 57 y se instalan con `npx expo install` al implementar.

No se agrega reproductor ahora. Las dependencias nativas futuras requieren verificar Expo Go y usar development build cuando corresponda. Sentry se verifica en development build, sin asumir cobertura nativa de Expo Go. La consola de edición remota necesita una propuesta separada con roles editoriales y reglas; no dar acceso al diario al equipo de contenidos.

### 8. Runtime, reglas y validación

Resolver Node >=24.12 exigido por Firebase instalado frente al Node 22 actual, comprobando compatibilidad de todo el stack antes de elegir runtime. Añadir ESLint y comprobación JS gradual con configuración específica; no confundir falta de TypeScript con aprobación del código. Reglas del emulador: usuarios A/B, anónimo, campos desconocidos, nested maps, largos, tipos, inmutabilidad y barrera de borrado. Agregar dependencias de pruebas solo al implementar y justificar su alcance.

Sin HTTP propio no hay CORS propio pendiente que habilitar. Si aparece un endpoint, debe especificar orígenes de staging/producción, métodos, autenticación y pruebas antes de desplegar.

## Risks / Trade-offs

- AsyncStorage sin transacciones multiclave → mantener un snapshot serializado y operaciones dentro del mismo estado; no confirmar antes de disco.
- Firestore por lotes no permite borrado completo atómico → barrera remota, reintentos y pruebas concurrentes.
- Datos nuevos exceden B9 de la constitución → aprobación explícita de ampliación antes de activar esas colecciones; no editar principios sin revisión.
- Audios y SVG faltantes → avanzar con dominio y fixtures técnicos identificados, sin declarar aceptación final.
- Contenido provisional o contradictorio → no inventar resolución clínica; bloquear publicación de esa pieza, no la entrega inicial de seguridad.
- Historial antiguo sin emociones → presentarlo como histórico; no cambiar su significado para llenar un bosque nuevo.

## Migration Plan

1. Revisar propuesta y entrega 0. PR pequeños, sin versión nueva ni publicación de producción.
2. Corregir errores actuales y añadir pruebas antes de habilitar esquema nuevo.
3. Acordar contratos finales y cambios B9; desplegar reglas compatibles en emulador y staging antes de clientes nuevos.
4. Migración local pura, idempotente, conservar respaldo del formato anterior hasta verificar escritura y arranque. Nunca reemplazar un blob que no se pudo leer.
5. Habilitar recorrido principal en staging; probar dos cuentas/dispositivos y modo avión.
6. Rollback: desactivar funciones nuevas y volver al binario anterior solo si tolera el esquema. Evitar cliente antiguo que sobrescriba datos nuevos mediante versión de esquema y reglas; no revertir reglas borrando datos.

## Open Questions

Recursos y aprobación pendientes se listan en el plan. Desempate confirmado: último check-in de intensidad máxima (instante, luego ID como orden total). Estado inicial confirmado: semilla, recurso 0, con cero check-ins. Los 30 SVG son solo del roble de prueba; siguen pendientes las seis especies finales y la selección por defecto de nuevo mes. Antes de publicar contenido faltan variantes y aprobación clínica. No bloquean la entrega 0. La pregunta mensual conserva su escala sin conversión hasta acuerdo clínico.
