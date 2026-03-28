// ============================================================
// Khu Vườn Trên Mây - Zustand Game Store (Sandbox Mode)
// ============================================================

import { create } from "zustand";
import type {
  GameStore,
  CloudLayer,
  Slot,
  SlotPlant,
  PlantId,
  PotId,
  FertilizerId,
  PestType,
  PlantGrowthStage,
} from "./types";
import {
  PLANTS,
  POTS,
  FERTILIZERS,
  CLOUD_LAYER_COUNT,
  SLOTS_PER_LAYER,
  PEST_SPAWN_CHANCE,
  THIRSTY_CHANCE,
  THIRSTY_TIMEOUT_SECONDS,
  getExpForLevel,
} from "./constants";

// ============================================================
// Helper Functions
// ============================================================

function createSlot(cloudIndex: number, slotIndex: number): Slot {
  return {
    id: `cloud-${cloudIndex}-slot-${slotIndex}`,
    potId: null,
    plant: null,
  };
}

function createCloudLayer(level: number): CloudLayer {
  const slots: Slot[] = [];
  for (let i = 0; i < SLOTS_PER_LAYER; i++) {
    slots.push(createSlot(level, i));
  }
  return {
    id: `cloud-${level}`,
    level,
    slots,
  };
}

function createInitialClouds(): CloudLayer[] {
  const clouds: CloudLayer[] = [];
  for (let i = 0; i < CLOUD_LAYER_COUNT; i++) {
    clouds.push(createCloudLayer(i));
  }
  return clouds;
}

function calculateAdjustedGrowTime(
  plantId: PlantId,
  potId: PotId,
  isFertilized: boolean,
  fertilizerId?: FertilizerId
): number {
  const plant = PLANTS[plantId];
  const pot = POTS[potId];
  let time = plant.growTimeSeconds;

  // Apply pot time reduction
  time *= 1 - pot.timeReductionPercent / 100;

  // Apply fertilizer time reduction
  if (isFertilized && fertilizerId) {
    const fert = FERTILIZERS[fertilizerId];
    time *= 1 - fert.timeReductionPercent / 100;
  }

  return Math.max(1, Math.floor(time));
}

function getGrowthStage(plant: SlotPlant): PlantGrowthStage {
  if (!plant) return 0;
  const progress = 1 - plant.remainingTime / plant.totalGrowTime;
  if (progress >= 1) return 4;
  if (progress >= 0.75) return 3;
  if (progress >= 0.5) return 2;
  if (progress >= 0.25) return 1;
  return 1; // minimum stage 1 once planted
}

function calculateRewards(
  plantId: PlantId,
  potId: PotId,
  isFertilized: boolean,
  fertilizerId?: FertilizerId
): { exp: number; gold: number } {
  const plant = PLANTS[plantId];
  const pot = POTS[potId];

  let exp = plant.expReward;
  let gold = plant.goldReward;

  // Apply pot buffs
  exp *= 1 + pot.expBuffPercent / 100;
  gold *= 1 + pot.goldBuffPercent / 100;

  // Apply fertilizer buffs
  if (isFertilized && fertilizerId) {
    const fert = FERTILIZERS[fertilizerId];
    exp *= 1 + fert.expBuffPercent / 100;
    gold *= 1 + fert.goldBuffPercent / 100;
  }

  return { exp: Math.floor(exp), gold: Math.floor(gold) };
}

// ============================================================
// Sandbox Initial Data
// ============================================================

function createSandboxUser() {
  return {
    level: 99,
    exp: 0,
    expToNextLevel: getExpForLevel(99),
    gold: 9999999,
    ruby: 999,
  };
}

function createSandboxInventory() {
  return {
    seeds: {
      linh_lan: 99,
      hoa_cuc: 99,
      hoa_hong: 99,
      hong_trang: 99,
      hoa_tulip: 99,
      hoa_huong_duong: 99,
      cay_tao: 99,
      cay_dau: 99,
    },
    pots: {
      pot_soil: 99,
      pot_bronze: 99,
      pot_silver: 99,
      pot_gold: 99,
      pot_diamond: 99,
    },
    tools: {
      waterCan: 99,
      insectNet: 99,
      harvestBasket: 99,
      banana: 99,
    },
    fertilizers: {
      fertilizer_basic: 99,
      fertilizer_advanced: 99,
      fertilizer_premium: 99,
    },
    pests: {
      beetle: 99,
      caterpillar: 99,
      snail: 99,
      dragonfly: 99,
    },
  };
}

// ============================================================
// Store
// ============================================================

export const useGameStore = create<GameStore>((set, get) => ({
  // --- Initial Data (Sandbox Mode) ---
  user: createSandboxUser(),
  inventory: createSandboxInventory(),
  clouds: createInitialClouds(),
  monkey: {
    isActive: false,
    bananasRemaining: 99,
    autoPlantSeedId: null,
    currentSlotIndex: 0,
    isActiveScanning: false,
  },

  // --- UI State ---
  activeTool: null,
  selectedSeedId: null,
  selectedPotId: null,
  selectedFertilizerId: null,
  activeCloudIndex: 0,

  // --- UI Actions ---
  setActiveTool: (tool) => set({ activeTool: tool }),
  setSelectedSeedId: (id) => set({ selectedSeedId: id }),
  setSelectedPotId: (id) => set({ selectedPotId: id }),
  setSelectedFertilizerId: (id) => set({ selectedFertilizerId: id }),
  setActiveCloudIndex: (index) => set({ activeCloudIndex: index }),

  // --- Game Actions ---

  plantSeed: (slotId, plantId) => {
    set((s) => {
      if ((s.inventory.seeds[plantId] ?? 0) <= 0) return s;

      const slot = findSlot(s.clouds, slotId);
      if (!slot || !slot.potId || slot.plant) return s;

      const potId = slot.potId;
      const totalGrowTime = calculateAdjustedGrowTime(plantId, potId, false);
      const now = Date.now();

      const newPlant: SlotPlant = {
        plantId,
        totalGrowTime,
        remainingTime: totalGrowTime,
        isPest: false,
        isThirsty: false,
        isFertilized: false,
        plantedAt: now,
      };

      return {
        inventory: {
          ...s.inventory,
          seeds: {
            ...s.inventory.seeds,
            [plantId]: (s.inventory.seeds[plantId] ?? 0) - 1,
          },
        },
        clouds: updateSlotInClouds(s.clouds, slotId, { plant: newPlant }),
      };
    });
  },

  harvest: (slotId) => {
    set((s) => {
      const slot = findSlot(s.clouds, slotId);
      if (!slot || !slot.plant || !slot.potId) return s;
      if (slot.plant.remainingTime > 0) return s;

      const plant = slot.plant;
      const rewards = calculateRewards(plant.plantId, slot.potId, plant.isFertilized);

      const newUser = { ...s.user };
      newUser.gold += rewards.gold;
      newUser.exp += rewards.exp;

      while (newUser.exp >= newUser.expToNextLevel) {
        newUser.exp -= newUser.expToNextLevel;
        newUser.level += 1;
        newUser.expToNextLevel = getExpForLevel(newUser.level);
      }

      return {
        user: newUser,
        clouds: updateSlotInClouds(s.clouds, slotId, { plant: null }),
      };
    });
  },

  waterPlant: (slotId) => {
    set((s) => {
      const slot = findSlot(s.clouds, slotId);
      if (!slot || !slot.plant || !slot.plant.isThirsty) return s;
      if ((s.inventory.tools.waterCan ?? 0) <= 0) return s;

      return {
        inventory: {
          ...s.inventory,
          tools: { ...s.inventory.tools, waterCan: s.inventory.tools.waterCan - 1 },
        },
        clouds: updateSlotInClouds(s.clouds, slotId, {
          plant: { ...slot.plant, isThirsty: false },
        }),
      };
    });
  },

  removePest: (slotId) => {
    set((s) => {
      const slot = findSlot(s.clouds, slotId);
      if (!slot || !slot.plant || !slot.plant.isPest) return s;
      if ((s.inventory.tools.insectNet ?? 0) <= 0) return s;

      const pestType = PLANTS[slot.plant.plantId].pestType;

      return {
        inventory: {
          ...s.inventory,
          tools: { ...s.inventory.tools, insectNet: s.inventory.tools.insectNet - 1 },
          pests: { ...s.inventory.pests, [pestType]: (s.inventory.pests[pestType] ?? 0) + 1 },
        },
        clouds: updateSlotInClouds(s.clouds, slotId, {
          plant: { ...slot.plant, isPest: false },
        }),
      };
    });
  },

  fertilize: (slotId, fertilizerId) => {
    set((s) => {
      const slot = findSlot(s.clouds, slotId);
      if (!slot || !slot.plant || slot.plant.isFertilized) return s;
      if ((s.inventory.fertilizers[fertilizerId] ?? 0) <= 0) return s;

      const plant = slot.plant;
      const fert = FERTILIZERS[fertilizerId];
      const timeReduction = 1 - fert.timeReductionPercent / 100;
      const newRemainingTime = Math.max(1, Math.floor(plant.remainingTime * timeReduction));

      return {
        inventory: {
          ...s.inventory,
          fertilizers: {
            ...s.inventory.fertilizers,
            [fertilizerId]: (s.inventory.fertilizers[fertilizerId] ?? 0) - 1,
          },
        },
        clouds: updateSlotInClouds(s.clouds, slotId, {
          plant: {
            ...plant,
            remainingTime: newRemainingTime,
            totalGrowTime: Math.max(newRemainingTime, Math.floor(plant.totalGrowTime * timeReduction)),
            isFertilized: true,
          },
        }),
      };
    });
  },

  pickPot: (slotId) => {
    set((s) => {
      const slot = findSlot(s.clouds, slotId);
      if (!slot || !slot.potId) return s;
      if (slot.plant) return s;

      const potId = slot.potId;
      return {
        inventory: {
          ...s.inventory,
          pots: {
            ...s.inventory.pots,
            [potId]: (s.inventory.pots[potId] ?? 0) + 1,
          },
        },
        clouds: updateSlotInClouds(s.clouds, slotId, { potId: null }),
      };
    });
  },

  placePot: (slotId, potId) => {
    // All validation inside set() to avoid stale state
    set((s) => {
      const slot = findSlot(s.clouds, slotId);
      if (!slot || slot.potId) return s; // slot not found or already has pot
      if ((s.inventory.pots[potId] ?? 0) <= 0) return s; // no pot in inventory

      return {
        inventory: {
          ...s.inventory,
          pots: {
            ...s.inventory.pots,
            [potId]: (s.inventory.pots[potId] ?? 0) - 1,
          },
        },
        clouds: updateSlotInClouds(s.clouds, slotId, { potId }),
      };
    });
  },

  // --- Growth Engine Tick ---
  tick: () => {
    set((state) => {
      let changed: boolean = false;
      const newClouds = state.clouds.map((cloud) => ({
        ...cloud,
        slots: cloud.slots.map((slot) => {
          if (!slot.plant) return slot;
          const plant = slot.plant;

          // Paused if pest or thirsty
          if (plant.isPest || plant.isThirsty) return slot;

          changed = true;
          let newRemaining = plant.remainingTime - 1;
          if (newRemaining < 0) newRemaining = 0;

          // Random pest spawn
          let hasPest: boolean = plant.isPest;
          if (!hasPest && newRemaining > 0 && Math.random() < PEST_SPAWN_CHANCE) {
            hasPest = true;
            changed = true;
          }

          // Random thirsty
          let hasThirsty: boolean = plant.isThirsty;
          const timeElapsed = plant.totalGrowTime - newRemaining;
          if (
            !hasThirsty &&
            newRemaining > 0 &&
            (timeElapsed > THIRSTY_TIMEOUT_SECONDS ||
              Math.random() < THIRSTY_CHANCE)
          ) {
            hasThirsty = true;
            changed = true;
          }

          return {
            ...slot,
            plant: {
              ...plant,
              remainingTime: newRemaining,
              isPest: hasPest,
              isThirsty: hasThirsty,
            },
          };
        }),
      }));

      if (!changed) return state;
      return { clouds: newClouds };
    });
  },

  // --- Monkey AI ---
  toggleMonkey: () =>
    set((s) => ({
      monkey: {
        ...s.monkey,
        isActive: !s.monkey.isActive,
        bananasRemaining: s.monkey.isActive
          ? s.monkey.bananasRemaining
          : s.monkey.bananasRemaining > 0
            ? s.monkey.bananasRemaining - 1
            : 0,
      },
    })),

  setMonkeyAutoPlant: (seedId) =>
    set((s) => ({
      monkey: { ...s.monkey, autoPlantSeedId: seedId },
    })),

  monkeyTick: () => {
    const state = get();
    const { monkey } = state;
    if (!monkey.isActive || monkey.bananasRemaining <= 0) return;

    const cloud = state.clouds[state.activeCloudIndex];
    if (!cloud) return;

    const slotIndex = monkey.currentSlotIndex;
    const slot = cloud.slots[slotIndex];

    // FSM: scan current slot
    if (slot) {
      // Priority 1: Remove pest
      if (slot.plant?.isPest && state.inventory.tools.insectNet > 0) {
        get().removePest(slot.id);
      }
      // Priority 2: Harvest ready plant
      else if (slot.plant && slot.plant.remainingTime <= 0) {
        get().harvest(slot.id);
      }
      // Priority 3: Auto-plant in empty pot
      else if (
        !slot.plant &&
        slot.potId &&
        monkey.autoPlantSeedId &&
        (state.inventory.seeds[monkey.autoPlantSeedId] ?? 0) > 0
      ) {
        get().plantSeed(slot.id, monkey.autoPlantSeedId);
      }
    }

    // Move to next slot
    const nextIndex = (slotIndex + 1) % SLOTS_PER_LAYER;
    set((s) => ({
      monkey: { ...s.monkey, currentSlotIndex: nextIndex },
    }));
  },

  // --- Utility ---
  addExp: (amount) =>
    set((s) => {
      const newUser = { ...s.user };
      newUser.exp += amount;
      while (newUser.exp >= newUser.expToNextLevel) {
        newUser.exp -= newUser.expToNextLevel;
        newUser.level += 1;
        newUser.expToNextLevel = getExpForLevel(newUser.level);
      }
      return { user: newUser };
    }),

  addGold: (amount) =>
    set((s) => ({
      user: { ...s.user, gold: s.user.gold + amount },
    })),

  spendGold: (amount) => {
    const state = get();
    if (state.user.gold < amount) return false;
    set((s) => ({
      user: { ...s.user, gold: s.user.gold - amount },
    }));
    return true;
  },
}));

// ============================================================
// Internal Helpers
// ============================================================

function findSlot(clouds: CloudLayer[], slotId: string): Slot | null {
  for (const cloud of clouds) {
    for (const slot of cloud.slots) {
      if (slot.id === slotId) return slot;
    }
  }
  return null;
}

function updateSlotInClouds(
  clouds: CloudLayer[],
  slotId: string,
  updates: Partial<Slot>
): CloudLayer[] {
  return clouds.map((cloud) => ({
    ...cloud,
    slots: cloud.slots.map((slot) =>
      slot.id === slotId ? { ...slot, ...updates } : slot
    ),
  }));
}

// Export growth stage helper for UI use
export { getGrowthStage };
export type { PlantGrowthStage };
