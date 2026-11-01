# 01: Hoja de Ruta Técnica & Wayfinding (Fase 01: Arquitectura)

Este documento traza los hitos de entrega de valor técnico, la arquitectura general y la demarcación de la "Niebla de Guerra" (*Fog of War*).

---

## 1. Topología del Repositorio

El proyecto se estructurará como un repositorio desacoplado y cohesionado:

```text
/
├── GLOSSARY.md
├── docs/
│   ├── 00_DISCOVERY.md
│   ├── 01_TECH_ROADMAP.md
│   ├── adr/
│   │   ├── 0001-go-backend-react-frontend.md
│   │   └── 0002-local-first-relational-sync.md
│   └── rea-analysis/
├── server/                    ← Backend en Go (API REST, reglas de dominio, persistencia)
│   ├── cmd/api/
│   ├── internal/domain/       ← Entidades puras (Topic, Capsule, Step, Check, Streak)
│   ├── internal/service/      ← Casos de uso (completar cápsula, evaluar respuesta, registrar hábito)
│   └── internal/storage/      ← Adaptadores de persistencia (SQLite/PostgreSQL)
└── web/                       ← Frontend en React + Tailwind CSS (Mobile-First)
    ├── src/components/        ← Componentes UI atómicos (ProgressBar, StepCard, QuizOption)
    ├── src/features/capsules/ ← Motor de reproducción de lección interactiva
    ├── src/features/streak/   ← Visualizador y estado de racha diaria
    └── src/services/          ← Cliente API y almacenamiento local
```

---

## 2. Milestones de Entrega de Valor

### M0: Scaffolding, Entorno & Tipos de Dominio
- **Objetivo**: Inicializar el entorno de Go en `server/` y el proyecto React + Tailwind en `web/`.
- **Entregables**:
  - Estructura base de paquetes en Go con tests unitarios.
  - Setup de Vite/React + Tailwind con componentes base.
  - Contratos de API compartidos (JSON schema o tipos paralelos Go/TS para `Topic`, `Capsule`, `Step`, `Check`, `Streak`).
- **Gate M0**: Builds limpios y tests ejecutables tanto en servidor como en cliente.

### M1: Motor de Cápsulas & Desafíos Interactivos (Tracer Bullet Principal)
- **Objetivo**: Implementar el ciclo completo vertical (API + UI + Interacción) de consumo de una cápsula.
- **Entregables**:
  - Backend Go: Endpoints para obtener cápsula (`GET /api/topics/:id/capsules/:cid`) y evaluar intento (`POST /api/capsules/:cid/checks/:chk_id/attempts`).
  - Frontend React: Reproductor de lección paso a paso (pantalla narrativa progresiva, selección de opción, feedback visual de acierto/error y pantalla final de resumen).
  - Fixture de prueba: Una cápsula real interactiva de 5 minutos sobre pensamiento crítico o lógica.
- **Gate M1**: El usuario puede completar una lección interactiva real de principio a fin recibiendo validación inmediata.

### M2: Motor de Racha & Hábitos Diarios
- **Objetivo**: Registrar la constancia diaria y consolidar el comportamiento del Aprendiz.
- **Entregables**:
  - Backend Go: Lógica de racha consecutiva por huso horario y cálculo de metas diarias (`POST /api/progress/complete`, `GET /api/profile/streak`).
  - Frontend React: Widget de racha diaria en el encabezado, calendario de actividad semanal y modal de celebración al cumplir el objetivo diario.
- **Gate M2**: Completar una cápsula actualiza la racha en tiempo real y la persiste confiablemente.

---

## 3. Niebla de Guerra (Fog of War / Not Yet Specified)

Las siguientes áreas están identificadas pero se mantienen deliberadamente congeladas sin diseñar en detalle hasta que M1 y M2 estén verificados en producción:

- **Tutores Conversacionales IA (M3+)**: Integración con modelos de lenguaje para chatear con personajes históricos (Cleopatra, Sócrates) con objetivos didácticos cerrados.
- **Catálogo Masivo & Curaduría CMS (M4+)**: Panel administrativo para autores de contenido con previsualización en vivo.
- **Gamificación Social & Ligas (M5+)**: Tablas de clasificación y desafíos entre aprendices.
