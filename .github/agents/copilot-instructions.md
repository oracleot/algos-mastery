# algos-mastery Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-27

## Active Technologies

- TypeScript ^5.0.0 (strict mode enabled) + React ^18.0.0, Vite ^5.0.0, Tailwind CSS ^3.0.0, Dexie.js ^4.0.0, Lucide React (icons) (001-mvp-project-setup)
- TypeScript ^5.0.0 (strict mode enabled) + vite-plugin-pwa (PWA), existing stack (004-practice-polish)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript ^5.0.0 (strict mode enabled): Follow standard conventions

## Recent Changes

- 001-mvp-project-setup: Added TypeScript ^5.0.0 (strict mode enabled) + React ^18.0.0, Vite ^5.0.0, Tailwind CSS ^3.0.0, Dexie.js ^4.0.0, Lucide React (icons)
- 004-practice-polish: Added TypeScript ^5.0.0 (strict mode enabled) + vite-plugin-pwa (PWA), existing stack

<!-- MANUAL ADDITIONS START -->

## UI Components

- **Always check shadcn/ui first** before implementing custom UI components
- Use `npx shadcn@latest add <component>` to add new components
- shadcn/ui components are located in `src/components/ui/`
- Prefer shadcn/ui for consistent styling and behavior across the app

<!-- MANUAL ADDITIONS END -->
