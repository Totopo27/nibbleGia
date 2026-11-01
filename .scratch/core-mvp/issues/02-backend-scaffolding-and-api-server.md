# Issue 02: Scaffolding del Backend en Go y Servidor HTTP Base

- **Milestone**: M0
- **Blocked by**: Issue 01
- **Tipo**: Backend Scaffolding & API Router

## Descripción
Inicializar el módulo de Go (`go.mod`), la estructura de directorios estándar y un servidor HTTP estándar (usando la librería estándar `net/http` de Go 1.22+ con su router nativo de rutas mejoradas o Chi para máxima ligereza sin bloat).

## Tareas
1. `go mod init nibble-server` en `server/`.
2. Servidor con graceful shutdown y middleware básico (CORS para el frontend local, logging y recuperación de pánico).
3. Endpoint de salud: `GET /api/health`.
4. Endpoint de catálogo inicial con datos en memoria/fixture: `GET /api/topics`.

## Criterios de Aceptación
- Servidor compila y levanta en puerto configurable (por defecto `:8080`).
- `GET /api/health` retorna `{"status": "ok"}` con código 200.
- `GET /api/topics` retorna la lista de temas según el contrato de dominio.
- Suite de pruebas de integración HTTP en Go (`httptest`) que valida respuestas y headers CORS.
