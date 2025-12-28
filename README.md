# Algorithms Mastery Tracker

A local-first React web app to help master LeetCode-style problems through structured topic progression, spaced repetition reviews, and a multi-language solution journal.

## Features

- **Problem Management** - Add, edit, and track coding problems with topic, difficulty, and status
- **Structured Topics** - 15 ordered topics following a logical learning path
- **Filtering** - Filter problems by topic, difficulty, and status
- **Local-first** - All data stored in browser via IndexedDB (no account required)

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Dexie.js** - IndexedDB wrapper
- **Vitest** - Testing

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint

# Build for production
pnpm build
```

## Project Structure

```
src/
├── components/     # UI components
│   └── ui/         # shadcn/ui base components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and database
├── data/           # Static data (topics)
├── types/          # TypeScript interfaces
└── pages/          # Route components
```

## Roadmap

See [PRODUCT_PLAN.md](PRODUCT_PLAN.md) for the full roadmap including:
- Solution journal with code editor
- Pattern templates library
- Spaced repetition system (SM-2)
- Timed practice mode
- Progress dashboard

## License

MIT
