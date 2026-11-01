# ADR 0001: Arquitectura Desacoplada (Backend en Go y Frontend en React/Tailwind)

## Contexto
El producto es una plataforma de microaprendizaje centrada en hábitos diarios de cápsulas cortas (3 a 7 minutos). La experiencia requiere:
1. Una interfaz de usuario móvil/web altamente reactiva, táctil y libre de parpadeos para responder lecciones interactivas y quizzes.
2. Un backend robusto, compilado, de alto rendimiento y bajo consumo de memoria para servir la taxonomía de contenidos, evaluar la validación de respuestas y procesar eventos de hábitos y rachas concurrentes.

## Decisión
Dividir el sistema en dos capas claramente delimitadas:
- **Backend API en Go (Golang)**: Expone endpoints REST/JSON ligeros y de baja latencia con tipado estricto, gestión idiomática de concurrencia y persistencia relacional (SQLite / PostgreSQL).
- **Frontend SPA / Web App en React con Tailwind CSS**: Diseñado bajo filosofía Mobile-First, centrado en microinteracciones, transiciones fluidas de pasos de cápsula, sonido/haptic y retroalimentación inmediata en desafíos de validación.

## Consecuencias
- **Positivas**:
  - Desacoplamiento total entre lógica de negocio/pedagogía en servidor y la capa de presentación.
  - El backend en Go ofrece binarios únicos autocontenidos, latencia submilisegundo en evaluación de reglas y facilidad de despliegue.
  - La interfaz de React puede evolucionar independientemente o empaquetarse para PWA / móvil nativo sin rehacer la API.
- **Negativas / Desafíos**:
  - Se requiere mantener contratos de datos sincronizados (DTOs de Go y tipos de TypeScript en el cliente).
  - Requiere instalar el runtime/toolchain de Go en el entorno de desarrollo si aún no se encuentra presente.
