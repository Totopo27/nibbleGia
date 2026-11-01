# Issue 01: Entidades de Dominio y Contratos de Datos Compartidos

- **Milestone**: M0
- **Blocked by**: Ninguno (Frontier inicial)
- **Tipo**: Tracer Bullet Foundation (Modelo de Dominio & Contratos)

## Descripción
Modelar y formalizar las estructuras de datos de las entidades de dominio aprobadas en `GLOSSARY.md` tanto para el backend en Go como para el frontend en TypeScript, asegurando consistencia absoluta en serialización JSON.

## Entidades a definir
1. `Topic`: Identificador, título, descripción breve, categoría e icono.
2. `Capsule`: Identificador, topic_id, título, orden, tiempo_estimado_min, lista de pasos (`steps`).
3. `Step`: Identificador, orden, contenido_narrativo, imagen_url (opcional), desafio (`check`, opcional).
4. `Check` (Quiz): Identificador, pregunta, opciones (`CheckOption`: id, texto), opcion_correcta_id, explicacion.
5. `CheckAttempt`: check_id, opcion_seleccionada_id, es_correcta, explicacion_mostrada.
6. `StreakState`: total_dias, racha_actual, racha_maxima, ultima_fecha_activa.

## Criterios de Aceptación
- Tipos de Go definidos con etiquetas `json:"..."` bajo `server/internal/domain/`.
- Tipos de TypeScript equivalentes bajo `web/src/types/domain.ts`.
- Fixture JSON canónico de una cápsula de prueba que valida contra ambos lados.
- Tests unitarios en Go y en TypeScript que serializan/deserializan el fixture sin pérdida ni ambigüedad.
