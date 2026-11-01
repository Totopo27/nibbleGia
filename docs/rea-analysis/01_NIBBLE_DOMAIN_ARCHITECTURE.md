# Análisis de Ingeniería Inversa: Arquitectura de Dominio e Interacción de Nibble

Análisis extraído a partir de la inspección del cliente web y el árbol de estados de Nibble (`__NEXT_DATA__` y modelos de cliente).

---

## 1. Jerarquía Estructural de Contenidos

El modelo de datos pedagógico de Nibble está organizado en una jerarquía fractal de 6 niveles de granularidad:

```text
Course (Curso / Tema)
  └── Level (Nivel / Módulo)
        └── Lesson (Lección - Cápsula de 3 a 10 min)
              └── Block (Bloque de Aprendizaje)
                    └── Step (Paso / Pantalla de contenido interactivo)
                          └── Atom (Átomo: elemento indivisible de texto, gráfica o desafío)
```

### Explicación de las Entidades Identificadas:
- **`courses`**: Tópicos principales (ej. *Statistics, Logic, History, Art, Biology, Philosophy, AI*).
- **`levels`**: Segmentación de dificultad o avance dentro de un curso.
- **`lessons`**: Unidades de aprendizaje autónomas (*Cápsulas*). Cuentan con un `lessonSnippet` (resumen y tiempo estimado).
- **`blocks`**: Sub-secciones pedagógicas dentro de una cápsula (representan hitos en la barra de progreso superior).
- **`steps`**: Cada pantalla que se le presenta al aprendiz (transición secuencial).
- **`atoms`**: Los componentes atómicos de un paso:
  - *Atomo Narrativo*: Texto explicativo con resaltado conceptual.
  - *Atomo Visual*: Ilustración, diagrama o animación contextual.
  - *Atomo Evaluativo / Quiz*: Pregunta con validación instantánea.

---

## 2. Modelo de Seguimiento de Progreso (`coursesProgressData`)

La persistencia del progreso del aprendiz se estructura de forma análoga a la jerarquía de contenido:

- `coursesProgress`: Porcentaje global completado del curso y estado de habilitación.
- `lessonsProgress`: Estado de la cápsula (`not_started`, `in_progress`, `completed`), precisión obtenida (`accuracy`) y marca de tiempo de finalización.
- `blocksProgress`: Bloques superados dentro de la cápsula.
- `stepsProgress`: Registro de pantallas visualizadas.
- `atomsProgress`: Historial de respuestas en los desafíos interactivos (acierto / error / reintento).

---

## 3. Dinámica de la Experiencia de Lección (`lesson`)

El estado de la sesión de aprendizaje activa sigue esta máquina de estados:
- **`phase`**: Ciclo de vida de la lección (`loading` -> `in_progress` -> `block_summary` -> `completed`).
- **`currentBlockIndex`**: Posición actual en la secuencia de bloques.
- **`accuracy`**: Medición en tiempo real de los aciertos en los desafíos de validación.
- **`closePrevention`**: Detección de abandono accidental para preservar el progreso del bloque actual.

---

## 4. Tutores IA y Personajes Históricos (`aiTutorData`)

El subsistema de diálogo se estructura en:
- **`personas`**: Entidades conversacionales (Cleopatra, Einstein, etc.) ligadas a cursos temáticos específicos (`courseFilter`).
- **`cards`**: Disparadores o misiones de conversación específicas (ej. "¿Por qué la proporción áurea?").
- **`conversations`**: Hilo de mensajes con contexto persistente del objetivo didáctico.

---

## 5. Conclusiones y Aplicabilidad para Nuestro Proyecto

1. **Adoptar la Jerarquía Simplificada**:
   Para nuestro núcleo inicial, simplificaremos la jerarquía a 4 niveles para reducir sobrecarga sin perder granularidad:
   `Tema (Topic)` -> `Cápsula (Capsule/Lesson)` -> `Paso (Step)` -> `Desafío (Check/Quiz)`.
2. **Máquina de Estados de Cápsula**:
   Implementar una experiencia de paso secuencial donde cada avance valida el entendimiento antes de dar el siguiente paso.
3. **Métrica de Hábito Desacoplada**:
   La racha diaria y el progreso se calculan a nivel de `Cápsula completada`, garantizando feedback gratificante en menos de 5 minutos.
