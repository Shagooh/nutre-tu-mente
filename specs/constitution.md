# Principios del proyecto · Nutre tu mente

Estas reglas **no se negocian por funcionalidad**. Toda especificación, plan y Pull Request se revisa contra ellas.
Salen del [Lean Canvas](../docs/lean-canvas.md) (sobre todo de los puntos J, B, L y M). Cambiarlas requiere acuerdo
explícito del **equipo clínico** y de las **dos personas de desarrollo**, y se hace en un Pull Request propio.

## A. Principios de producto y clínicos

1. **Nada que empuje al control.** La app **no** cuenta calorías ni pasos, **no** pide ni muestra peso o medidas, **no**
   fomenta el chequeo corporal, **no** premia rachas y **no** compara con otras usuarias.
2. **Nunca castiga.** No hay penalizaciones por no entrar. La planta **solo crece**, nunca se debilita. Volver tras días de
   ausencia se recibe con calidez ("Qué bueno verte de nuevo"), sin culpa.
3. **No es una dieta ni promete resultados.** No promete bajar de peso ni resultados rápidos.
4. **No diagnostica ni reemplaza la atención profesional.** Ante señales de riesgo (atracones frecuentes, señales de TCA,
   crisis) ofrece contención y **deriva a ayuda profesional**. Toda pantalla nueva que toque estos temas pasa por el
   equipo clínico.
5. **El contenido clínico lo valida el equipo.** Ninguna lección, frase, audio o mensaje sobre comida, cuerpo o emociones se
   publica sin aprobación del equipo clínico. Los textos en borrador se marcan como tal.
6. **Tono de tú, cálido y sin juicios.** Evitar siempre: *dieta, prohibido, permitido, "deberías", fuerza de voluntad,
   compensar, quemar, "todo o nada"*, promesas mágicas, autoridad rígida, imposición y juicios.
7. **Ella decide.** Los recordatorios los elige ella (horario y cantidad), tienen tono de invitación y son fáciles de
   pausar. Nada se activa sin que lo elija.
8. **La métrica nunca se vuelve una exigencia.** Se mide ánimo, calma y espacio mental; no cumplimiento, peso ni puntajes.
   Los logros son constructivos.

## B. Principios de datos y privacidad

9. **Datos mínimos.** Solo se guarda: apodo, respuestas de la encuesta, check-ins, uso de "Me está costando", horarios de
   recordatorio y flor elegida. **Nunca** peso, medidas, fotos del cuerpo ni calorías (las reglas de Firestore lo impiden).
10. **Consentimiento explícito y borrado total.** Se acepta el uso de datos al inicio, y la persona puede borrar todo (también
    la copia en la nube) y eliminar su cuenta cuando quiera.
11. **La nube es opcional.** La app funciona completa **sin cuenta y sin conexión**. Cada persona solo accede a sus propios
    datos, y los datos de dos cuentas nunca se mezclan en un mismo teléfono.
12. **Analítica anónima y agregada.** Nada que identifique a una persona se envía al equipo.
13. **Sin secretos en el repositorio.** Claves privadas, tokens y cuentas de servicio nunca se suben. (Los valores públicos
    de configuración de Firebase tampoco se escriben en documentos.)

## C. Principios de ingeniería

14. **Todo requisito es verificable.** Cada funcionalidad tiene criterios de aceptación escritos de forma que se puedan
    comprobar. Lo que se puede automatizar, se prueba con tests.
15. **La pipeline en verde es el criterio de "terminado".** No se une nada a `staging` ni a `main` con `1 · Probar` o
    `2 · Compilar` fallando.
16. **Cambios a producción siempre con revisión humana.** `main` solo recibe cambios por Pull Request y la publicación a
    `Production` requiere aprobación manual.
17. **Dos entornos que nunca se mezclan:** `staging` usa el proyecto Firebase de pruebas y `main` el de producción.
18. **Mantener lo simple.** Antes de añadir una dependencia o un servicio, se justifica en el plan. No se construye lo que el
    Lean Canvas marca como "puede esperar" sin una especificación que lo apruebe.
19. **Accesible y para móvil.** La app es móvil (Android e iOS). Toda pantalla nueva debe verse y usarse bien en un teléfono,
    con textos legibles y áreas táctiles amplias.
20. **La especificación y el código no se contradicen.** Si la realidad cambia, se actualiza la especificación **en el mismo
    Pull Request** que el código.
