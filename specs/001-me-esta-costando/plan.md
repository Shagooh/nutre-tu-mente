# Plan técnico · 001 "Me está costando"

> Plan *retroactivo*: describe cómo quedó construido.

## 1. Enfoque
Un flujo de 6 pasos en una sola pantalla (`MeCuesta.js`) controlada por un contador de paso. Cada paso es una vista
simple; el registro se arma en memoria y **solo se guarda al terminar**. La respiración es un componente reutilizable
(`Respiracion.js`) que también usa la "Pausa de 1 minuto".

## 2. Alternativas descartadas
| Alternativa | Por qué no |
|---|---|
| Una pantalla distinta por paso con navegación | Más código y más estado compartido para un flujo corto y lineal. |
| Guardar en cada paso | Dejaría registros a medias si la persona sale; complicaría las métricas. |
| Librería de animación externa | `Animated` de React Native alcanza para el círculo; una dependencia menos. |

## 3. Cambios por área
| Área | Archivos | Qué hace |
|---|---|---|
| Pantalla del flujo | `src/screens/MeCuesta.js` | Los 6 pasos, "Esto me supera" y el guardado final. |
| Respiración | `src/components/Respiracion.js` | Ciclo 4 s/6 s, 60 s, vibración suave en cada cambio. |
| Textos | `src/content.js` | `TIPOS_HAMBRE`, `NECESIDADES`, `TRATOS` (**revisión clínica**). |
| Puntos y métricas | `src/logic.js` | `puntos` (tope 3/día), `cambioCalma`, `cuestasUltimaSemana`. |
| Entrada | `src/screens/Hoy.js` | Botón principal y aviso por uso frecuente. |
| Progreso | `src/screens/Progreso.js` | Cambio promedio de calma. |
| Datos | `src/store.js`, `src/sync.js`, `firestore.rules` | Guardado local y en la nube con campos limitados. |

## 4. Datos y migración
Los registros reciben un `id` al crearse; los antiguos reciben uno estable al cargar (`asegurarIds`). Las reglas de Firestore
validan los campos y el rango de calma (1–5).

## 5. Dependencias nuevas
Ninguna específica. Usa `Animated`, `Vibration` y `Pressable` de React Native.

## 6. Pruebas
- **Automáticas:** `logic.test.js` (puntos, cambio de calma, usos por semana) y `fusion.test.js` (ids y fusión).
- **Manuales:** recorrido completo en navegador.
- **Faltan:** pruebas de interfaz del flujo y prueba en teléfono real (vibración).

## 7. Riesgos
- Textos sin validar clínicamente → no publicar como definitivos.
- Sin protocolo de riesgo → el acceso "Esto me supera" es solo un mensaje genérico.

## 8. Despliegue
Sin pasos especiales. Se publica con la pipeline normal.
