# Active Context: Khu Vườn Trên Mây (KVTM) Web Remake

## Current State

**Project Status**: Phase 2 Complete - Game UI Components (PotSlot, Toolbar, CloudGrid, Inventory)

The project is a KVTM (Cloud Garden) game remake using Next.js 16 + React 19 + Zustand. Currently in Sandbox mode with all items unlocked (x99). Phase 2 UI is fully functional with interactive pot slots, tool selection, inventory, and monkey AI toggle.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] Zustand 5.x installed
- [x] Game type system (`src/lib/game/types.ts`)
- [x] Game constants (`src/lib/game/constants.ts`)
- [x] Zustand store (`src/lib/game/store.ts`) - sandbox data, all actions, growth tick, monkey AI
- [x] Growth engine (`src/lib/game/engine.ts`)
- [x] Phase 2 UI Components:
  - [x] `PotSlot` - Interactive slot with growth stages, progress bar, pest/thirsty alerts
  - [x] `Toolbar` - 7 tool selection (plant, water, pest, fertilize, harvest, pick/place pot)
  - [x] `CloudGrid` - 3x3 grid of PotSlots for active cloud layer
  - [x] `CloudNavigator` - Up/down cloud layer navigation (8 layers)
  - [x] `UserBar` - Level, EXP bar, gold, ruby display
  - [x] `InventoryPanel` - Tabbed inventory (seeds, pots, fertilizers, pests) with selection
  - [x] `MonkeyToggle` - Monkey AI on/off + auto-plant seed selector
  - [x] `GameBoard` - Main orchestrator, starts growth engine, layouts all components

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/game/types.ts` | Type definitions | ✅ |
| `src/lib/game/constants.ts` | Game data catalogs | ✅ |
| `src/lib/game/store.ts` | Zustand store + actions | ✅ |
| `src/lib/game/engine.ts` | Growth engine hooks | ✅ |
| `src/lib/game/index.ts` | Barrel export | ✅ |
| `src/components/game/PotSlot.tsx` | Single slot UI | ✅ |
| `src/components/game/Toolbar.tsx` | Tool selection bar | ✅ |
| `src/components/game/CloudGrid.tsx` | 3x3 cloud layer grid | ✅ |
| `src/components/game/CloudNavigator.tsx` | Cloud layer up/down | ✅ |
| `src/components/game/UserBar.tsx` | Player stats display | ✅ |
| `src/components/game/InventoryPanel.tsx` | Tabbed inventory | ✅ |
| `src/components/game/MonkeyToggle.tsx` | Monkey AI controls | ✅ |
| `src/components/game/GameBoard.tsx` | Main game orchestrator | ✅ |
| `src/app/page.tsx` | Game page | ✅ |
| `src/app/layout.tsx` | Root layout (KVTM metadata) | ✅ |

## How to Play (Current UI)

1. **Select a tool** from the left sidebar (e.g. 🌱 Trồng)
2. **Select a seed** from the right inventory panel (Hạt tab)
3. **Click an empty pot** in the cloud grid to plant
4. **Watch the plant grow** - progress bar + countdown timer
5. **Handle events**: Click 💧 tool then thirsty plant, 🪲 tool then pest plant
6. **Harvest**: Select 🌾 tool, click mature plant (green ring)
7. **Navigate clouds**: Use ▲▼ buttons to switch layers
8. **Monkey AI**: Toggle ON, select auto-plant seed, monkey scans slots automatically

## Pending (Next Phases)

### Phase 3: Cloud View & Visual Polish
- [ ] Cloud layer visual styling (white puffy clouds)
- [ ] Beanstalk/vine between layers
- [ ] Animated plant growth transitions
- [ ] Bird AI visual (fly to pest, remove, fly away)
- [ ] Monkey walking animation across slots

### Phase 4: Jack's House & Ground View
- [ ] Ground view with Jack character
- [ ] Production machines (juicer, oven, dryer)
- [ ] Machine crafting UI

### Phase 5: Production Mode
- [ ] Locked items by level
- [ ] Shop system (buy seeds, pots, tools)
- [ ] Real-time progression (no x99 sandbox)

## Session History

| Date | Changes |
|------|---------|
| 2026-03-28 | Phase 1: Zustand store, types, constants, engine |
| 2026-03-28 | Phase 2: Full UI - PotSlot, Toolbar, CloudGrid, Inventory, UserBar, MonkeyToggle, GameBoard |
