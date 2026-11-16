# Spec Delta

## Purpose

Permitir que una persona explore desde el navegador cómo un roble de prueba conserva, en su crecimiento y sus hojas, los registros emocionales de un mes.

## ADDED Requirements

### Requirement: Crecimiento acumulativo
El roble SHALL mostrar una semilla en el estado 0 y un avance estructural visible por registro hasta el día 30, conservando la identidad de sus ramas y grupos diarios.

#### Scenario: Recorrido completo
- **WHEN** se comparan estados consecutivos del 0 al 30
- **THEN** se distinguen germinación (1–3), plántula (4–7), árbol joven (8–12), desarrollo (13–18), maduración (19–25) y adulto (26–30), con una diferencia visible en cada paso.

#### Scenario: Tres siluetas en pantalla móvil
- **WHEN** se observan los días 1, 15 y 30
- **THEN** se distinguen una bellota abierta con radícula y cotiledones internos, un tronco con ramas secundarias y copa incipiente, y un roble de tronco robusto con copa ancha, asimétrica y hojas lobuladas.

#### Scenario: Reproducibilidad
- **WHEN** se renderiza dos veces la misma configuración o se recorre 30 → 10 → 30
- **THEN** coinciden las geometrías, los identificadores y los colores del mismo estado.

#### Scenario: Ocho registros en el árbol joven
- **WHEN** se recorre la germinación hasta el día 8
- **THEN** la bellota encoge hasta desaparecer, cada uno de los grupos 1 a 3 mantiene una hoja visible y consultable durante su traslado y se distinguen ocho hojas individuales en un tallo pequeño y delgado.

#### Scenario: Ramificación adulta
- **WHEN** se inspecciona la copa expandida
- **THEN** las ramas se unen al costado de su rama madre con madera continua a ambos lados de la unión, tienen codos y nudos y sostienen ramillas con distinta densidad, orientación y longitud de hojas.

### Requirement: Identidad emocional diaria
Cada registro SHALL tener un grupo seleccionable, con base, sombra, brillo y nervadura configurables para happy, calm, sad, anxious, energetic y neutral. Toda emoción SHALL mantener igual vigor y geometría.

#### Scenario: Corrección retrospectiva
- **WHEN** se modifica el mood del día 12 de un árbol adulto
- **THEN** solo cambia la paleta del grupo 12, el día 11 conserva sus cuatro colores y ambos registros pueden identificarse por día y nombre de emoción.

#### Scenario: Identificación en ambas direcciones
- **WHEN** se selecciona un día del historial o se toca una de sus hojas
- **THEN** se destaca el grupo y se indica su día y emoción mediante texto, incluso en la germinación.

### Requirement: Exploración animada
La demo SHALL ofrecer deslizador 0–30 y reproducción con pausa, con extensión de madera y aparición progresiva de hojas. Explorar un estado anterior SHALL conservar el crecimiento registrado.

#### Scenario: Control del movimiento
- **WHEN** se reproduce con movimiento normal
- **THEN** el tronco y las ramas se extienden y las hojas aparecen con escala, opacidad y un giro leve; pausar o arrastrar permite retomar el control.

#### Scenario: Movimiento reducido
- **WHEN** la persona solicita movimiento reducido
- **THEN** puede recorrer todos los estados con cambios directos y la reproducción solo comienza por acción explícita.

#### Scenario: Orientación durante el brote de una rama
- **WHEN** se reproduce el crecimiento entre dos días y una rama comienza a alargarse
- **THEN** las hojas visibles giran de forma continua y conservan su color mientras las hojas nuevas se despliegan.

### Requirement: Bosque local
La demo SHALL conservar hasta doce árboles por año, uno por mes, con su identificador, semilla, crecimiento e historial. La persona SHALL poder borrar los datos de prueba.

#### Scenario: Recuperar y ampliar
- **WHEN** se guarda un roble adulto, se crea otro mes y se recarga el navegador
- **THEN** ambos aparecen en el bosque y seleccionar el primero muestra su mes, la misma silueta y sus registros originales.

#### Scenario: Ausencia y mes incompleto
- **WHEN** se vuelve a la demo tras varios días con un árbol de diez registros
- **THEN** se recuperan esos diez registros y su crecimiento, sin añadir ni descontar etapas por el tiempo transcurrido.

### Requirement: SVG portable
La exportación SHALL producir un SVG autónomo, vectorial y editable con viewBox 0 0 1024 1024, grupos semánticos e identificadores diarios estables.

#### Scenario: Abrir fuera de la demo
- **WHEN** se descarga y abre el SVG del día 30
- **THEN** se ve el estado seleccionado con sus colores y se encuentran tree, seed, roots, trunk, primary-branches, secondary-branches, foliage y day-01 a day-30 con data-day y las cuatro clases de capa.
