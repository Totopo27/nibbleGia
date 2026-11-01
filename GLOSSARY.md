# Glosario Ubicuo del Dominio (GLOSSARY)

Documento vivo de lenguaje ubicuo para la plataforma de microaprendizaje basada en cápsulas diarias. Libre de detalles de infraestructura o frameworks técnicos.

---

### Actores

- **Aprendiz**: Persona que utiliza la plataforma para nutrir su curiosidad mediante cápsulas breves de estudio, resolver preguntas y mantener un hábito diario de aprendizaje.
- **Curador de Contenido**: Rol responsable de concebir, redactar, organizar y versionar temas, módulos, cápsulas y desafíos de validación.

---

### Entidades y Conceptos Clave

- **Tema (Topic)**: Área de conocimiento macro (ej. Pensamiento Crítico, Historia Antigua, Astronomía, Microeconomía).
- **Ruta de Aprendizaje (Learning Track)**: Secuencia guiada de temas organizada pedagógicamente para llevar al Aprendiz desde fundamentos hasta conceptos avanzados.
- **Cápsula (Bite / Capsule)**: Unidad atómica de aprendizaje diseñada para consumirse en un intervalo de 3 a 7 minutos. Compuesta por bloques progresivos de lectura y puntos de interacción.
- **Paso de Cápsula (Step / Screen)**: Fragmento individual de contenido interactivo presentado de forma secuencial al Aprendiz (narrativa breve, imagen contextual o ejemplo ilustrativo).
- **Desafío de Validación (Check / Quiz)**: Pregunta interactiva incrustada en o al final de una Cápsula para consolidar la retención inmediata (opción única, verdadero/falso, ordenamiento o emparejamiento conceptual).
- **Intento de Validación (Check Attempt)**: Registro de la respuesta emitida por el Aprendiz frente a un Desafío, evaluando acierto, error y retroalimentación explicativa recibida.
- **Racha Diaria (Streak)**: Métrica conductual de hábito que contabiliza los días calendario consecutivos en los que el Aprendiz ha completado al menos una Cápsula.
- **Sesión Diaria (Daily Goal)**: Compromiso autodefinido por el Aprendiz sobre la cantidad mínima de Cápsulas a completar por día.
- **Repaso Espaciado (Spaced Review)**: Mecanismo pedagógico mediante el cual conceptos previamente fallados o aprendidos son reintroducidos en sesiones futuras para afianzar la memoria de largo plazo.

---

### Reglas de Negocio Fundamentales

1. **Atomicidad de Cápsula**: Una cápsula no puede exceder los 7 minutos de lectura/interacción estimada; si un tema es extenso, debe subdividirse en cápsulas hijas.
2. **Refuerzo Inmediato**: Cada bloque conceptual nuevo debe ir acompañado o seguido de un Desafío de Validación para evitar la lectura pasiva.
3. **Persistencia del Hábito**: La racha se consolida al terminar una cápsula en el huso horario local del Aprendiz antes de la medianoche.
