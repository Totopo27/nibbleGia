# Issue 03: Scaffolding del Frontend en React + Tailwind (Vite + TypeScript)

- **Milestone**: M0
- **Blocked by**: Issue 01
- **Tipo**: Frontend Scaffolding & Mobile-First Foundation

## Descripción
Crear e inicializar la aplicación web de React con Vite y TypeScript en el directorio `web/`, configurando Tailwind CSS y una base de diseño limpia optimizada para pantallas móviles.

## Tareas
1. Inicializar proyecto React + TypeScript con Vite en `web/`.
2. Configurar Tailwind CSS con soporte para tema claro/oscuro y fuentes limpias (sans-serif legible).
3. Configurar layout principal `MobileLayout` que mantenga un contenedor central de ancho máximo móvil (máx. 480px centrado en pantallas grandes) emulando la ergonomía de app nativa de Nibble.
4. Crear cliente HTTP ligero para comunicarse con el backend (`web/src/services/api.ts`).

## Criterios de Aceptación
- `npm run dev` en `web/` compila sin errores y levanta la interfaz.
- La vista base se adapta responsive a dispositivos móviles y escritorio.
- Test de renderizado de componente inicial pasando sin advertencias.
