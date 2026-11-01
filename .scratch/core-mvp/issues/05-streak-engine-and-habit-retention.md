# Issue 05: Motor de Hábito y Persistencia de Racha Diaria

- **Milestone**: M2
- **Blocked by**: Issue 04
- **Tipo**: Full-Stack Feature (Streak Calculation & Habit Retention)

## Descripción
Implementar el motor de cálculo de racha diaria (*Streak*) y el registro de la finalización de cápsulas para fidelizar el hábito de estudio diario.

## Capas involucradas
1. **Backend Go**:
   - Servicio de racha `StreakService`: Recibe un evento de cápsula completada con la fecha y zona horaria del usuario.
   - Si la última fecha activa fue ayer, `racha_actual += 1`. Si fue hoy, mantiene racha. Si fue antes de ayer, reinicia `racha_actual = 1`.
   - Endpoint `POST /api/progress/complete-capsule`: Registra la cápsula y devuelve el nuevo estado de la racha.
   - Endpoint `GET /api/profile/streak`: Devuelve estadísticas de hábito (días activos, racha récord, racha actual).
2. **Frontend React**:
   - Componente `StreakBadge`: Indicador con icono de llama en la barra de navegación superior que muestra los días consecutivos.
   - Modal de celebración `StreakCelebrationModal`: Animación gratificante al completar la primera cápsula del día informando el nuevo hito alcanzado.

## Criterios de Aceptación
- Completar la primera cápsula en un nuevo día consecutivo incrementa la racha visible de inmediato.
- Completar una segunda cápsula el mismo día no duplica erróneamente la racha.
- Se preserva el progreso en almacenamiento local si no hay conexión y se sincroniza al restablecerse.
- Pruebas unitarias de límites de fechas y husos horarios en Go.
