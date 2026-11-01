# Issue 04: Motor de Cápsula Interactiva & Desafíos de Validación (Tracer Bullet Principal)

- **Milestone**: M1
- **Blocked by**: Issue 02, Issue 03
- **Tipo**: Full-Stack Tracer Bullet (Cápsula + Step + Quiz + Feedback)

## Descripción
Construir el núcleo interactivo completo de microaprendizaje: un reproductor de cápsula paso a paso que guía al aprendiz a través de pantallas secuenciales, presenta preguntas interactivas, evalúa la respuesta en tiempo real y ofrece retroalimentación instantánea con avance bloqueado hasta responder.

## Capas involucradas
1. **Backend Go**:
   - Endpoint `GET /api/topics/{topicId}/capsules/{capsuleId}` con los pasos y desafíos.
   - Endpoint `POST /api/capsules/{capsuleId}/checks/{checkId}/attempts` para verificar la opción seleccionada y devolver si fue acierto junto a la explicación pedagógica.
2. **Frontend React**:
   - Componente `ProgressBar`: Barra superior segmentada por pasos con animación de avance suave.
   - Componente `StepView`: Visualizador de texto conciso con tipografía destacada y diseño ergonómico.
   - Componente `QuizView`: Lista de opciones táctiles que al hacer clic muestran de inmediato el estado (verde/rojo), sonido/vibración visual y explicación.
   - Componente `CapsuleSummary`: Pantalla de felicitación y métricas de precisión al terminar todos los pasos.

## Criterios de Aceptación
- Un usuario puede entrar a una cápsula de 5 minutos, avanzar paso a paso, responder una pregunta y recibir el feedback explicativo de inmediato.
- Si falla, puede reintentar o ver la explicación correcta según la regla pedagógica.
- Al llegar al último paso, se presenta el resumen de precisión de la lección y se registra la finalización.
- Tests E2E / integración que simulan el recorrido completo de la lección.
