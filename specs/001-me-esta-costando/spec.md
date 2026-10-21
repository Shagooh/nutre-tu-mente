# 001 · "Me está costando" (botón para el momento difícil)

| | |
|---|---|
| **Estado** | **Implementada** (especificación escrita *a posteriori*, a partir del código y del Lean Canvas) |
| **Autor/a** | @Shagooh |
| **Revisor/a** | _pendiente_ |
| **Equipo clínico** | **Sí aplica.** Los textos están en borrador, **sin validar** todavía. |
| **Relacionado con** | [Lean Canvas](../../docs/lean-canvas.md): 1 Problema (desborde sin compañía), 4 Solución (función 1), 8 Métricas, J, M |

> Esta especificación sirve de **ejemplo** de cómo escribir las siguientes. Como la funcionalidad ya existía, las
> secciones 5 y 10 dicen con honestidad qué está verificado y qué no.

## 1. Problema y objetivo
En los momentos de desborde (sobre todo por la tarde, con cansancio, estrés, ansiedad o aburrimiento) la persona "sabe qué
hacer" pero no puede, y nadie la acompaña: el nutricionista y la terapia llegan *después*. La app debe estar con ella
**justo en ese momento**, sin juzgarla, y ayudarla a parar, entender qué necesita y tratarse con cuidado.

## 2. Alcance
**Incluye:** calma antes · respiración guiada de 1 minuto · "¿hambre física o emocional?" · "¿qué necesitas?" con una
acción de autocuidado · "¿cómo te quieres tratar ahora?" · calma después · acceso a un mensaje de contención ("Esto me
supera") · registro del uso para sus métricas.

**No incluye (todavía):** audios de respiración/meditación · protocolo clínico de riesgo con líneas de ayuda concretas ·
detección automática de señales de riesgo · chat o contacto con una profesional · widget de acceso rápido.

## 3. Historia de uso
A las 18:30, cansada y frente a la despensa, Fernanda abre la app y toca **Me está costando**. Indica cómo de en calma se
siente, respira un minuto, se pregunta si es hambre física o emocional y elige qué necesita (descanso). La app le sugiere
una acción pequeña y le pregunta cómo quiere tratarse. Si igual come, **no pasa nada**: no hay castigo. Al terminar vuelve
a indicar su calma y ve que su planta creció.

## 4. Requisitos
- **R1.** Un botón principal, siempre visible en "Hoy", abre el flujo.
- **R2.** El flujo tiene 6 pasos, en este orden: calma antes → respiración → tipo de hambre → necesidad → trato → calma después.
- **R3.** La calma se mide en una escala de 1 a 5 (antes y después). Es obligatoria para avanzar.
- **R4.** La respiración dura 60 s (4 s inhala, 6 s exhala) con un círculo animado, y es **opcional**: se puede saltar.
- **R5.** Cada tipo de hambre (física, emocional, "no lo sé") muestra un mensaje sin juicio.
- **R6.** Cada necesidad elegida muestra una **acción de autocuidado** concreta y pequeña.
- **R7.** Los textos **no castigan ni juzgan**, y dicen explícitamente que si igual come no pasa nada.
- **R8.** En cualquier paso hay un acceso **"Esto me supera"** que muestra un mensaje de contención y recomienda buscar
  ayuda profesional.
- **R9.** Solo se guarda el registro al **terminar** el último paso. Salir antes no guarda nada.
- **R10.** Cada uso suma puntos de cuidado a la planta, con un **máximo de 3 por día**.
- **R11.** Si hay **5 o más usos en 7 días**, "Hoy" muestra un mensaje cálido que sugiere hablarlo con un profesional.
  (Nunca como alarma ni juicio.)
- **R12.** En "Progreso" se muestra el **cambio promedio de calma** de forma positiva o neutra, nunca como fracaso.

## 5. Criterios de aceptación y cómo se verifican

| # | Criterio | Cómo se verifica | Estado |
|---|---|---|---|
| CA1 | **Dado** que está en "Hoy", **cuando** toca *Me está costando*, **entonces** se abre el paso 1 (calma antes) y el botón *Continuar* está desactivado hasta elegir 1–5. | Manual en navegador | ✅ Verificado (web) |
| CA2 | **Dado** el paso de respiración, **cuando** toca el círculo, **entonces** alterna *Inhala/Exhala* y cuenta hacia atrás desde 60 s. | Manual en navegador | ✅ Verificado (web) |
| CA3 | **Dado** el paso de respiración, **cuando** toca *Saltar la respiración*, **entonces** avanza sin marcar que respiró. | Manual | 🟡 Sin verificar explícitamente |
| CA4 | **Dado** cada opción de hambre, **cuando** la elige, **entonces** aparece su mensaje sin juicio. | Manual en navegador (hambre emocional) | 🟡 Parcial |
| CA5 | **Dado** que completa los 6 pasos, **cuando** pulsa *Listo*, **entonces** se guarda un registro con fecha, hora, calma antes/después, si respiró, tipo de hambre, necesidad y trato. | Manual · y vía Progreso ("calma subió 2 puntos") | ✅ Verificado (web) |
| CA6 | **Dado** que sale a mitad del flujo, **cuando** cierra, **entonces** no se guarda ningún registro. | Manual | 🟡 Sin verificar explícitamente |
| CA7 | **Dado** varios usos en un día, **cuando** se calculan los puntos, **entonces** cuentan como máximo 3 por día. | Test automático: `src/__tests__/logic.test.js` ("suma como máximo 3 por día") | ✅ Automatizado |
| CA8 | **Dado** registros con calma antes y después, **cuando** se calcula el cambio, **entonces** es el promedio y se ignoran los incompletos. | Tests: `logic.test.js` ("calcula el cambio promedio", "ignora registros incompletos") | ✅ Automatizado |
| CA9 | **Dado** 5 usos en los últimos 7 días, **cuando** abre "Hoy", **entonces** ve el mensaje cálido de apoyo. | Test del contador (`cuestasUltimaSemana`) · la tarjeta, manual | 🟡 Parcial |
| CA10 | **Dado** que toca *Esto me supera*, **cuando** se abre, **entonces** ve el mensaje de contención y puede volver al flujo. | Manual | 🟡 Sin verificar explícitamente |
| CA11 | **Dado** que no hay conexión o cuenta, **cuando** usa el flujo, **entonces** funciona igual y guarda en el teléfono. | Manual (modo local) | ✅ Verificado (web) |

> **No hay pruebas automáticas de pantalla.** Los criterios marcados 🟡 son candidatos para añadir tests de interfaz.

## 6. Principios afectados
| Principio ([constitution](../constitution.md)) | Cómo se respeta |
|---|---|
| 1 · Nada que empuje al control | No hay peso, calorías, rachas ni comparaciones. |
| 2 · Nunca castiga | Si come, el mensaje dice que no pasa nada; la planta solo crece. |
| 4 · No diagnostica; deriva | "Esto me supera" y el aviso por uso frecuente recomiendan ayuda profesional. |
| 5 · Contenido validado | **Pendiente:** los textos aún no los valida el equipo clínico. |
| 6 · Tono de tú, sin juicios | Textos de tú. No usa las palabras a evitar. |
| 9 · Datos mínimos | Solo guarda lo del punto 7. |

## 7. Datos
Se guarda por cada uso (en el teléfono y, si hay cuenta, en la nube en `users/{uid}/cuestas/{id}`):
`id`, `fecha`, `hora`, `calmaAntes`, `calmaDespues`, `respiro`, `hambre`, `necesidad`, `trato`.
Las reglas de Firestore solo aceptan esos campos y exigen calma de 1 a 5. **No se guarda** nada de lo que come.

## 8. Textos y tono
Todos los mensajes del flujo están en `src/screens/MeCuesta.js` y `src/content.js` (`TIPOS_HAMBRE`, `NECESIDADES`,
`TRATOS`). **Borrador, pendiente de validación clínica.** El mensaje de "Esto me supera" no incluye teléfonos de ayuda.

## 9. Casos límite y riesgos
- **Sin conexión:** funciona; se sincroniza después si hay cuenta.
- **Cierra la app a mitad:** no se guarda el registro.
- **Vibración del móvil** durante la respiración: en la web no existe; en Android/iOS no está probada en un teléfono real.
- **Persona en crisis real:** la app **no** detecta riesgo por sí sola; solo ofrece el acceso manual. Riesgo clínico abierto.
- **Uso muy frecuente:** hoy solo hay un mensaje cálido; no hay protocolo definido.

## 10. Preguntas abiertas
- ¿Qué líneas de ayuda y qué texto exacto debe mostrar "Esto me supera"? (**decisión del equipo clínico**; depende del país)
- ¿Qué cuenta como "señal de riesgo" y qué hace la app entonces? (protocolo clínico)
- ¿"Esto me supera" debe quedar registrado (para las métricas) o es mejor no guardar nada?
- ¿Se agregan audios guiados a la respiración?
- ¿El botón es gratis o de pago en la suscripción? (Lean Canvas, punto 6)
