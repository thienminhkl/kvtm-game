# Active Context: Khu Vườn Trên Mây (KVTM) Web Remake

## Current State

**Project Status**: Phase 8 Complete - Full game with notifications, achievements, tutorial, keyboard shortcuts

The project is a KVTM (Cloud Garden) game remake based on the official technical design spec (ZingMe 2008-2012). Built with Next.js 16 + React 19 + Zustand 5.

## Official Spec Compliance

### Plants (9 types, per spec P1-P9)
| ID | Name | Time | Pest | EXP | Gold | Unlock |
|----|------|------|------|-----|------|--------|
| P1 | Linh Lan | 300s (5m) | beetle | 10 | 100 | 1 |
| P2 | Hoa Cúc | 900s (15m) | beetle | 25 | 250 | 1 |
| P3 | Hoa Hồng | 1800s (30m) | beetle | 50 | 600 | 3 |
| P4 | Hồng Trắng | 3600s (1h) | caterpillar | 120 | 1500 | 5 |
| P5 | Hoa Tulip | 7200s (2h) | caterpillar | 300 | 4000 | 8 |
| P6 | Hướng Dương | 14400s (4h) | snail | 700 | 9000 | 12 |
| P7 | Cây Táo | 28800s (8h) | snail | 1500 | 20000 | 15 |
| P8 | Cây Dâu | 43200s (12h) | dragonfly | 2500 | 35000 | 20 |
| P9 | Cây Ngô | 86400s (24h) | dragonfly | 5000 | 80000 | 25 |

### Pots (5 tiers, per spec)
| Pot | EXP/Gold Buff | Time Reduction | Upgrade Cost |
|-----|--------------|----------------|-------------|
| Đất | +0% | -0% | - |
| Đồng | +5% | -5% | 1000g + 5 beetle |
| Bạc | +15% | -10% | 5000g + 10 caterpillar |
| Vàng | +30% | -20% | 20000g + 20 snail |
| Kim Cương | +60% | -40% | 100000g + 50 dragonfly |

### Core Mechanics (per spec)
- **Growth**: 1s tick, `isPest` or `isThirsty` pauses timer
- **Thirsty**: After planting, water once, then never again
- **Pest**: Random spawn ~5% per tick, pauses growth until caught
- **Monkey FSM**: Scan -> PestFound -> CallBird -> HarvestReady -> Planting -> Idle
- **Bird**: Fly to pest in ~0.5s, remove pest, fly away

## Completed Features (8 phases)

- [x] Zustand Store with types, constants, engine
- [x] UI Components (PotSlot, Toolbar, CloudGrid, UserBar)
- [x] Visual Polish (clouds, beanstalk, bird AI, monkey indicator)
- [x] Jack's House + 3 machines (juicer, oven, dryer)
- [x] Shop system (19 items, 4 categories, level-gated)
- [x] Pot upgrade system (2 pots + pests -> 1 higher tier)
- [x] Save/Load (localStorage, auto-save 30s)
- [x] Responsive layout (mobile/desktop)
- [x] Sandbox/Production toggle
- [x] Daily rewards (7-day cycle)
- [x] Toast notifications
- [x] Sell items system
- [x] Achievements (9 milestones)
- [x] Tutorial (8-step onboarding)
- [x] Keyboard shortcuts (1-7 tools, arrow keys, Q, Esc)

## GitHub
Repo: https://github.com/thienminhkl/kvtm-game

## Session History

| Date | Changes |
|------|---------|
| 2026-03-28 | Phase 1-8: Complete game implementation |
| 2026-03-28 | Tutorial + keyboard shortcuts + pushed to GitHub |
| 2026-03-28 | Aligned with official spec: added Cay Ngo (P9), restored pest pause |
