# ADR 0002: Persistencia Local-First con Sincronización Relacional

## Contexto
El microaprendizaje ocurre en momentos de transición (metro, paradas de autobús, descansos de 5 minutos) donde la conectividad puede ser inestable o con alta latencia. Un Aprendiz no debe experimentar bloqueos de red mientras interactúa con una Cápsula o responde un Desafío de Validación.

## Decisión
Implementar un modelo de datos con persistencia híbrida:
1. **Frontend con Almacenamiento Local (Local Cache / IndexedDB encapsulado)**: Mantiene las cápsulas activas, el estado de los pasos y el progreso inmediato sin bloquear la UI esperando peticiones de red.
2. **Backend Relacional (SQLite en local / PostgreSQL en producción)**: Fuente de la verdad autoritativa para el catálogo de contenidos, verificación de integridad y consolidación del historial y rachas.
3. **Sincronización por Eventos**: Las finalizaciones de cápsula e intentos de validación se transmiten de forma asíncrona hacia el backend de Go.

## Consecuencias
- **Positivas**:
  - Experiencia de aprendizaje a latencia percibida cero (instantánea).
  - Tolerancia a desconexiones de red durante el consumo de lecciones.
- **Negativas / Desafíos**:
  - Requiere manejo cuidadoso de sincronización idempotente en el backend para evitar duplicar rachas o puntos de progreso ante reintentos de red.
