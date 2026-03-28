# Active Context: Khu Vườn Trên Mây (KVTM) Web Remake

## Current State

**Project Status**: Phase 1 Complete - Game Data Layer & Zustand Store (Sandbox Mode)

The project is a KVTM (Cloud Garden) game remake using Next.js 16 + React 19 + Zustand. Currently in Sandbox mode with all items unlocked (x99).

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Zustand 5.x installed
- [x] Game type system (`src/lib/game/types.ts`) - all interfaces and enums
- [x] Game constants (`src/lib/game/constants.ts`) - plants, pots, fertilizers, tools, level system, config
- [x] Zustand store (`src/lib/game/store.ts`) - sandbox data, all game actions, growth tick, monkey AI
- [x] Growth engine (`src/lib/game/engine.ts`) - timer hooks for plant growth and monkey AI
- [x] Module barrel export (`src/lib/game/index.ts`)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/game/types.ts` | Type definitions (Plant, Pot, Slot, Cloud, Inventory, User, GameStore) | ✅ Complete |
| `src/lib/game/constants.ts` | Game data catalogs (8 plants, 5 pots, 3 fertilizers, 7 tools, config values) | ✅ Complete |
| `src/lib/game/store.ts` | Zustand store with sandbox data (x99), all actions, tick engine, monkey FSM | ✅ Complete |
| `src/lib/game/engine.ts` | React hook for setInterval-based growth engine (1s tick) and monkey AI | ✅ Complete |
| `src/lib/game/index.ts` | Barrel export for game module | ✅ Complete |

## Game Data Summary

### Plants (8 types)
| Plant | Grow Time | Pest | EXP | Gold | Unlock Level |
|-------|-----------|------|-----|------|-------------|
| Linh Lan | 5min | beetle | 10 | 100 | 1 |
| Hoa Cúc | 15min | beetle | 25 | 250 | 1 |
| Hoa Hồng | 30min | beetle | 50 | 600 | 3 |
| Hồng Trắng | 1hr | caterpillar | 120 | 1500 | 5 |
| Hoa Tulip | 2hr | caterpillar | 300 | 4000 | 8 |
| Hoa Hướng Dương | 4hr | snail | 600 | 8000 | 12 |
| Cây Táo | 8hr | snail | 1200 | 15000 | 15 |
| Cây Dâu | 12hr | dragonfly | 2000 | 25000 | 20 |

### Pots (5 tiers)
| Pot | EXP/Gold Buff | Time Reduction | Upgrade Cost |
|-----|--------------|----------------|-------------|
| Đất | 0% | 0% | - |
| Đồng | +5% | -5% | 1000g + 5 beetle |
| Bạc | +15% | -10% | 5000g + 10 caterpillar |
| Vàng | +30% | -20% | 20000g + 20 snail |
| Kim Cương | +60% | -40% | 100000g + 50 dragonfly |

### Store Actions Implemented
- `plantSeed(slotId, plantId)` - Plant seed in pot
- `harvest(slotId)` - Harvest mature plant (gold + exp)
- `waterPlant(slotId)` - Water thirsty plant
- `removePest(slotId)` - Remove pest, catch into inventory
- `fertilize(slotId, fertilizerId)` - Apply fertilizer (time reduction + buff)
- `pickPot(slotId)` - Pick up pot from slot
- `placePot(slotId, potId)` - Place pot into empty slot
- `tick()` - Growth engine tick (1s interval)
- `monkeyTick()` - Monkey AI FSM scan
- `toggleMonkey()` / `setMonkeyAutoPlant(seedId)` - Monkey control

## Pending (Next Phases)

### Phase 2: PotSlot Component
- [ ] Visual pot slot component (empty/plant states)
- [ ] Plant growth stage rendering (25%/50%/75%/100%)
- [ ] Countdown timer display

### Phase 3: Toolbar & Tool System
- [ ] Toolbar UI with tool selection
- [ ] Tool cursor/interaction feedback
- [ ] Seed selection panel

### Phase 4: Monkey & Bird AI
- [ ] Monkey sprite animation
- [ ] Bird AI for pest removal
- [ ] Visual feedback for AI actions

### Phase 5: Cloud View & Jack's House
- [ ] Cloud layer navigation
- [ ] Scroll between layers
- [ ] Jack's house ground view

### Phase 6: Production Mode
- [ ] Inventory/shop system
- [ ] Locked items by level
- [ ] Real-time progression

## Session History

| Date | Changes |
|------|---------|
| 2026-03-28 | Phase 1: Installed Zustand, created game types, constants, store (sandbox x99), growth engine |
