# Spec Delta

## Purpose

Separar los textos de las pantallas para incorporar el documento de Nutrimind con procedencia y revisión clínica trazables.

## ADDED Requirements

### Requirement: Procedencia y aprobación
Cada pieza clínica SHALL identificar fuente, versión, trato, fase y estado de aprobación; el sistema MUST NOT publicar borradores como contenido validado.

#### Scenario: Importar documento
- **WHEN** se carga una frase del documento de contenido
- **THEN** mantiene su texto exacto y referencia de sección, y queda pendiente de aprobación salvo evidencia explícita del equipo clínico

#### Scenario: Variante ausente
- **WHEN** falta una variante de trato o un archivo de audio
- **THEN** se registra como pendiente editorial y no se inventa ni se declara entregada

### Requirement: Navegación y disponibilidad
El sistema SHALL abrir en Inicio y ofrecer Inicio, Herramientas, Aprende y Perfil; Mi organización SHALL quedar fuera de V1. El botón Me está costando SHALL ser destacado y accesible en Inicio.

#### Scenario: Inicio diario
- **WHEN** vuelve a abrir la app con onboarding terminado
- **THEN** ve saludo, frase, árbol, check-in si aún no lo hizo, Me está costando y sugerencia del día; tras tres días se muestra bienvenida sin contabilizar la ausencia en el mensaje

#### Scenario: Destino todavía pendiente
- **WHEN** una herramienta V1 todavía no está implementada en una entrega intermedia
- **THEN** no se muestra como acción disponible ni conduce a una pantalla vacía

### Requirement: Banco de frases
El sistema SHALL respetar los uno o dos estilos elegidos, permitir otra frase al deslizar y evitar repetición en un estilo hasta agotarlo; las sugerencias diarias SHALL evitar repetirse durante una semana.

#### Scenario: Agotar estilo
- **WHEN** solicita frases hasta consumir el banco de un estilo
- **THEN** no se repite ninguna antes de agotar ese banco y después comienza otro ciclo

### Requirement: Alcance editorial V1
El sistema SHALL reservar las cápsulas 1–4 para V1 y derivar temas de cápsulas futuras a la más cercana disponible; la edición remota por el equipo SHALL quedar como entrega posterior del plan V1.

#### Scenario: Tema futuro
- **WHEN** una sugerencia corresponde a una cápsula 5–14
- **THEN** abre la alternativa 1–4 acordada en el mapa editorial sin anunciar contenido futuro disponible
