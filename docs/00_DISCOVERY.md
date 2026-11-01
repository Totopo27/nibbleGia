# 00: Descubrimiento & Modelo de Dominio (Fase 00: Negocio Puro)

Este documento condensa los fundamentos de negocio, objetivos, actores y límites del sistema antes de cualquier definición de arquitectura o tecnología de implementación.

---

## 1. Problema Central y Propuesta de Valor

- **Problema**: Las personas pierden diariamente decenas de minutos en "doom scrolling" y consumo pasivo de redes sociales, generando fatiga mental y sensación de tiempo desperdiciado sin adquirir conocimiento útil.
- **Solución**: Una plataforma de microaprendizaje estructurada en **hábitos diarios** y **cápsulas de 3 a 7 minutos**, combinando lectura progresiva con desafíos interactivos de validación inmediata que fomenten la retención activa y la constancia diaria.
- **Factor Diferencial Inicial**: Inspirada en la ergonomía de aprendizaje de Nibble (mapeada meticulosamente con ingeniería inversa limpia mediante REA), evolucionando hacia un estilo propio con mayor profundidad pedagógica y enfoque en retención real.

---

## 2. Actores del Sistema

1. **Aprendiz**:
   - Descubre temas y rutas temáticas.
   - Avanza en cápsulas paso a paso.
   - Responde desafíos de validación inmediatos recibiendo retroalimentación contextual.
   - Gestiona y monitorea su hábito diario, racha y objetivos de aprendizaje.
2. **Curador de Contenido**:
   - Estructura las rutas de aprendizaje y temas.
   - Redacta el contenido atómico de las cápsulas y configura los desafíos asociados.
   - Monitorea métricas agregadas de dificultad (tasa de acierto por pregunta) para calibrar la pedagogía.

---

## 3. Delimitación de Alcance

### Dentro del Alcance (In Scope) - Núcleo Inicial:
- Catálogo de temas y rutas de aprendizaje divididas en cápsulas.
- Experiencia interactiva de consumo de cápsula: pasos progresivos secuenciales.
- Desafíos de validación formativa (quizzes) con evaluación instantánea y explicación.
- Motor de hábito: seguimiento de racha diaria y registro de lecciones completadas.
- Perfil del aprendiz con histórico de temas completados y estado de hábito.

### Fuera del Alcance (Out of Scope) - Fases Posteriores:
- Formato de video enriquecido y podcast de audio streaming.
- Minijuegos arcade o desafíos complejos de física/gráficos.
- Chat abierto libre con personajes sin metas pedagógicas acotadas (se modelará formalmente en una fase posterior).
- Marketplace o creación pública de contenido por terceros no curadores.
- Pasarela de suscripciones monetizadas complejas (el enfoque inicial es validar retención y experiencia de aprendizaje).

---

## 4. Historias de Usuario Esenciales

1. **Como Aprendiz**, quiero seleccionar un tema de interés para iniciar una cápsula que pueda completar en menos de 5 minutos durante un descanso.
   - *Criterio de Aceptación*: La cápsula indica su tiempo estimado de consumo y muestra una barra de progreso que avanza con cada paso completado.
2. **Como Aprendiz**, quiero responder preguntas de validación durante la lección para verificar si comprendí el concepto antes de continuar.
   - *Criterio de Aceptación*: Al responder, el sistema indica de inmediato si la respuesta es correcta o no, junto con una breve explicación reforzadora, permitiendo reintentar si se falló.
3. **Como Aprendiz**, quiero ver reflejada mi racha diaria al completar al menos una cápsula para mantenerme motivado con mi hábito de aprendizaje constante.
   - *Criterio de Aceptación*: Completar una cápsula en el día actual incrementa la racha en 1 si el día anterior estuvo activo, o inicia la racha en 1 si se interrumpió el hábito.
4. **Como Curador**, quiero estructurar una cápsula en fragmentos breves con preguntas asociadas para garantizar que el contenido no abrume al lector.
   - *Criterio de Aceptación*: El sistema valida que una cápsula posea al menos un paso de contenido y al menos un desafío evaluativo.
