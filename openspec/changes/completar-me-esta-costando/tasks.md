# Tasks

## 1. Validación clínica de los textos

- [ ] 1.1 Entregar al equipo clínico los textos del flujo (`src/screens/MeCuesta.js` y `TIPOS_HAMBRE`, `NECESIDADES`, `TRATOS` de `src/content.js`)
- [ ] 1.2 Aplicar los cambios que pida el equipo clínico y dejar constancia de que los textos están validados
- [ ] 1.3 Acordar con el equipo clínico qué cuenta como señal de riesgo

## 2. Protocolo de riesgo y "Esto me supera"

- [ ] 2.1 Definir las líneas de ayuda y el texto exacto del mensaje de contención (depende del país)
- [ ] 2.2 Decidir si el uso de "Esto me supera" debe registrarse o no (privacidad frente a métricas)
- [ ] 2.3 Abrir un cambio nuevo con los requisitos resultantes, modificando la capacidad `me-esta-costando`

## 3. Verificación

- [ ] 3.1 Escribir pruebas de interfaz para: saltar la respiración, los tres tipos de hambre, salir a mitad sin guardar y "Esto me supera"
- [ ] 3.2 Probar el flujo completo en un Android y un iPhone reales, incluida la vibración de la respiración
- [ ] 3.3 Ejecutar `npm test` y comprobar que la pipeline queda en verde

## 4. Decisiones de producto

- [ ] 4.1 Decidir si se agregan audios guiados a la respiración
- [ ] 4.2 Decidir si el botón "Me está costando" es gratuito o de pago (Lean Canvas, punto 6)
