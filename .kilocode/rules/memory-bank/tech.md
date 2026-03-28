# Technical Context: KVTM Web Remake

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.x    | React framework with App Router |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.9.x   | Type-safe JavaScript            |
| Tailwind CSS | 4.x     | Utility-first CSS               |
| Zustand      | 5.x     | Global state management         |
| Bun          | Latest  | Package manager & runtime       |

## Development Environment

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 20+ (for compatibility)

### Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server (http://localhost:3000)
bun build          # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
```

## Project Configuration

### Next.js Config (`next.config.ts`)

- App Router enabled
- Default settings for flexibility

### TypeScript Config (`tsconfig.json`)

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Target: ESNext

### Tailwind CSS 4 (`postcss.config.mjs`)

- Uses `@tailwindcss/postcss` plugin
- CSS-first configuration (v4 style)

### ESLint (`eslint.config.mjs`)

- Uses `eslint-config-next`
- Flat config format

## Key Dependencies

### Production Dependencies

```json
{
  "next": "^16.1.3",
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "zustand": "^5.0.12"
}
```

### Dev Dependencies

```json
{
  "typescript": "^5.9.3",
  "@types/node": "^24.10.2",
  "@types/react": "^19.2.7",
  "@types/react-dom": "^19.2.3",
  "@tailwindcss/postcss": "^4.1.17",
  "tailwindcss": "^4.1.17",
  "eslint": "^9.39.1",
  "eslint-config-next": "^16.0.0"
}
```

## Game Architecture

### State Management (Zustand)

- Single global store at `src/lib/game/store.ts`
- Sandbox mode: all items x99, level 99
- Actions: plantSeed, harvest, waterPlant, removePest, fertilize, pickPot, placePot
- Growth engine: 1-second tick interval for plant countdown
- Monkey AI: FSM-based auto-scan every 2 seconds

### Module Structure

```
src/lib/game/
├── index.ts       # Barrel exports
├── types.ts       # TypeScript interfaces & enums
├── constants.ts   # Game data catalogs & config
├── store.ts       # Zustand store + actions
└── engine.ts      # React hook for timer intervals
```

### Design Principles

- Data separated from UI (store = data, components = display)
- All game logic in store actions, not in components
- Time-based growth with pause on pest/thirsty states
- Pot buffs stack additively with fertilizer buffs
- Monkey AI uses finite state machine (slot scanning)

## File Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles
│   │   └── favicon.ico         # Site icon
│   └── lib/
│       └── game/               # Game engine module
│           ├── index.ts
│           ├── types.ts
│           ├── constants.ts
│           ├── store.ts
│           └── engine.ts
├── .kilocode/                  # AI context & recipes
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## Performance Considerations

- Zustand selectors for minimal re-renders
- Growth tick updates only slots with active plants
- Monkey AI runs only when active and bananas > 0
- Cloud layers rendered on-demand (active layer priority)

## Browser Support

- Modern browsers (ES2020+)
- No IE11 support
