# System Patterns: KVTM Web Remake

## Architecture Overview

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page (game view)
│   ├── globals.css         # Tailwind imports + global styles
│   └── favicon.ico         # Site icon
├── lib/
│   └── game/               # Game engine (data + logic, no UI)
│       ├── index.ts        # Barrel exports
│       ├── types.ts        # All TypeScript interfaces & enums
│       ├── constants.ts    # Plants, pots, tools, config values
│       ├── store.ts        # Zustand store + all game actions
│       └── engine.ts       # React hook for game loop timers
└── components/             # (Phase 2+) React UI components
    ├── game/               # Game-specific components
    └── ui/                 # Reusable UI primitives
```

## Key Design Patterns

### 1. Data-UI Separation (Core Principle)

Game state and logic live entirely in `src/lib/game/`. Components are pure display + interaction:

```
Store (data + logic)  →  Components (display + events)
     ↑                           ↓
  engine.ts              user interactions
```

- Store holds ALL game data (user, inventory, clouds, monkey)
- Store actions contain ALL game logic (plant, harvest, water, etc.)
- Components ONLY read state via selectors and call actions

### 2. Zustand Store Pattern

Single global store with typed actions:
```typescript
// Read state in components
const gold = useGameStore((s) => s.user.gold);
const slot = useGameStore((s) => s.clouds[0].slots[0]);

// Call actions
useGameStore.getState().plantSeed(slotId, "hoa_cuc");
```

### 3. Growth Engine Pattern

Timer-based game loop using `setInterval`:
- 1-second tick decrements plant `remainingTime`
- Tick skips plants with `isPest` or `isThirsty` (paused)
- Random events (pest spawn, thirsty) checked per tick
- Monkey AI runs on separate 2-second interval

### 4. Monkey AI FSM (Finite State Machine)

Scans slots sequentially (0→8) on active cloud layer:
```
Scan slot → Has pest? → removePest()
         → Ready to harvest? → harvest()
         → Empty pot + auto-seed? → plantSeed()
         → Next slot (mod 9)
```

### 5. Server Components by Default

All components are Server Components unless marked with `"use client"`. Game components must be client components since they interact with Zustand store:
```tsx
"use client";
import { useGameStore } from "@/lib/game";
```

## Data Flow

```
User clicks slot with "plant" tool active
  → Component calls store.plantSeed(slotId, seedId)
  → Store checks inventory, validates slot
  → Store updates: inventory -= 1, slot.plant = new Plant
  → React re-renders affected components via Zustand selectors

Growth Engine tick (every 1s)
  → store.tick() called
  → Scans all slots, decrements remainingTime
  → Random pest/thirsty events
  → React re-renders plant progress displays
```

## Styling Conventions

### Tailwind CSS Usage
- Utility classes directly on elements
- Responsive: `sm:`, `md:`, `lg:`, `xl:`
- Game UI: fixed layout sizes, animated transitions for plant growth

## File Naming Conventions

- Components: PascalCase (`PotSlot.tsx`, `Toolbar.tsx`)
- Game module: camelCase (`store.ts`, `engine.ts`, `types.ts`)
- Pages/Routes: lowercase (`page.tsx`, `layout.tsx`)
- Directories: kebab-case (`game-ui/`) or lowercase (`game/`)

## State Management

- **Zustand** for ALL game state (user, inventory, clouds, UI state)
- **useState** for local component UI state (modals, panels)
- **No server state** yet (Sandbox mode is fully client-side)
