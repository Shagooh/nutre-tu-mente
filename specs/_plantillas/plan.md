# Plan técnico · NNN Nombre

> Parte de una especificación **aprobada**. Explica *cómo* se construye, no *qué* hace.

## 1. Enfoque
Resumen en pocas líneas de la solución elegida y por qué.

## 2. Alternativas descartadas
| Alternativa | Por qué no |
|---|---|
| … | … |

## 3. Cambios por área
| Área | Archivos | Qué cambia |
|---|---|---|
| Pantallas | `src/screens/…` | … |
| Lógica | `src/logic.js`, `src/fusion.js` | … |
| Datos locales | `src/store.js` | … |
| Nube | `src/sync.js`, `firestore.rules` | … |
| Contenido | `src/content.js` | … (requiere revisión clínica) |
| Pipeline | `.github/workflows/…` | … |

## 4. Datos y migración
¿Cambia la forma de lo guardado? ¿Hay datos antiguos que migrar? ¿Se tocan las reglas de Firestore?

## 5. Dependencias nuevas
Solo si hacen falta. Justificación, versión y qué ocurre en Expo Go.

## 6. Pruebas
Qué se prueba automáticamente y qué manualmente (enlaza con los criterios de aceptación de la especificación).

## 7. Riesgos y cómo se mitigan
- …

## 8. Despliegue
¿Necesita variables nuevas, reglas publicadas o pasos en Firebase/GitHub?
