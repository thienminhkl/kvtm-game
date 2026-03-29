// ============================================================
// Khu Vườn Trên Mây - Zustand Game Store (Sandbox Mode)
// ============================================================

import { create } from "zustand";
import type {
  GameStore,
  CloudLayer,
  Slot,
  SlotPlant,
  MachineState,
  MachineId,
  Notification,
  PlantId,
  PotId,
  FertilizerId,
  PestType,
  PlantGrowthStage,
  GameView,
} from "./types";
import {
  PLANTS,
  POTS,
  FERTILIZERS,
  MACHINES,
  SHOP_ITEM_MAP,
  POT_UPGRADE_CHAIN,
  DAILY_REWARDS,
  DAILY_REWARD_COOLDOWN_MS,
  CLOUD_LAYER_COUNT,
  SLOTS_PER_LAYER,
  PEST_SPAWN_CHANCE,
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
      cay_ngo: 99,
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

// --- Production Mode Initial Data ---

function createProductionUser() {
  return {
    level: 1,
    exp: 0,
    expToNextLevel: getExpForLevel(1),
    gold: 500,
    ruby: 0,
  };
}

function createProductionInventory() {
  return {
    seeds: {
      linh_lan: 5,
      hoa_cuc: 3,
      hoa_hong: 0,
      hong_trang: 0,
      hoa_tulip: 0,
      hoa_huong_duong: 0,
      cay_tao: 0,
      cay_dau: 0,
    },
    pots: {
      pot_soil: 3,
      pot_bronze: 0,
      pot_silver: 0,
      pot_gold: 0,
      pot_diamond: 0,
    },
    tools: {
      waterCan: 10,
      insectNet: 10,
      harvestBasket: 0,
      banana: 0,
    },
    fertilizers: {
      fertilizer_basic: 2,
      fertilizer_advanced: 0,
      fertilizer_premium: 0,
    },
    pests: {
      beetle: 0,
      caterpillar: 0,
      snail: 0,
      dragonfly: 0,
    },
  };
}

const IS_SANDBOX = true; // Toggle this for production mode

// ============================================================
// Store
// ============================================================

export const useGameStore = create<GameStore>((set, get) => ({
  // --- Initial Data ---
  user: IS_SANDBOX ? createSandboxUser() : createProductionUser(),
  inventory: IS_SANDBOX ? createSandboxInventory() : createProductionInventory(),
  clouds: createInitialClouds(),
  monkey: {
    isActive: false,
    bananasRemaining: IS_SANDBOX ? 99 : 0,
    autoPlantSeedId: null,
    currentSlotIndex: 0,
    isActing: false,
  },

  // --- View State ---
  currentView: "cloud" as GameView,
  setCurrentView: (view) => set({ currentView: view }),

  // --- Machine State ---
  machines: [
    { id: "juicer" as MachineId, craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
    { id: "oven" as MachineId, craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
    { id: "dryer" as MachineId, craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
  ] as MachineState[],

  // --- UI State ---
  activeTool: null,
  selectedSeedId: null,
  selectedPotId: null,
  selectedFertilizerId: null,
  activeCloudIndex: 0,

  // --- Sandbox/Production ---
  isSandbox: IS_SANDBOX,

  // --- Daily Reward ---
  lastDailyReward: null,
  dailyRewardStreak: 0,

  // --- Notifications ---
  notifications: [] as Notification[],

  // --- Stats & Achievements ---
  stats: {
    totalHarvested: 0,
    totalGoldEarned: 0,
    totalPlanted: 0,
    totalPestsKilled: 0,
    totalUpgrades: 0,
    maxLevel: 1,
  },
  achievements: [
    { id: "harvest_10", name: "Nông Dân", icon: "🌾", description: "Thu hoạch 10 cây", target: 10, current: 0, claimed: false, reward: { gold: 500, ruby: 0 } },
    { id: "harvest_50", name: "Nông Gia", icon: "🏡", description: "Thu hoạch 50 cây", target: 50, current: 0, claimed: false, reward: { gold: 2000, ruby: 5 } },
    { id: "harvest_200", name: "Địa Chủ", icon: "👑", description: "Thu hoạch 200 cây", target: 200, current: 0, claimed: false, reward: { gold: 10000, ruby: 20 } },
    { id: "gold_10k", name: "Giàu Có", icon: "💰", description: "Kiếm 10.000 vàng", target: 10000, current: 0, claimed: false, reward: { gold: 1000, ruby: 0 } },
    { id: "gold_100k", name: "Triệu Phú", icon: "💎", description: "Kiếm 100.000 vàng", target: 100000, current: 0, claimed: false, reward: { gold: 5000, ruby: 10 } },
    { id: "pest_20", name: "Diệt Sâu", icon: "🐛", description: "Bắt 20 con sâu", target: 20, current: 0, claimed: false, reward: { gold: 500, ruby: 0 } },
    { id: "upgrade_3", name: "Thợ Rèn", icon: "🔨", description: "Nâng cấp 3 chậu", target: 3, current: 0, claimed: false, reward: { gold: 1000, ruby: 3 } },
    { id: "level_5", name: "Nông Gia Lv.5", icon: "⭐", description: "Đạt level 5", target: 5, current: 0, claimed: false, reward: { gold: 2000, ruby: 5 } },
    { id: "level_10", name: "Bậc Thầy Lv.10", icon: "🌟", description: "Đạt level 10", target: 10, current: 0, claimed: false, reward: { gold: 5000, ruby: 10 } },
  ] as { id: string; name: string; icon: string; description: string; target: number; current: number; claimed: boolean; reward: { gold: number; ruby: number } }[],

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
        isThirsty: true,
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
    let harvestGold = 0;
    let harvestExp = 0;
    set((s) => {
      const slot = findSlot(s.clouds, slotId);
      if (!slot || !slot.plant || !slot.potId) return s;
      if (slot.plant.remainingTime > 0) return s;

      const plant = slot.plant;
      const rewards = calculateRewards(plant.plantId, slot.potId, plant.isFertilized);
      harvestGold = rewards.gold;
      harvestExp = rewards.exp;

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
        stats: { ...s.stats, totalHarvested: s.stats.totalHarvested + 1, totalGoldEarned: s.stats.totalGoldEarned + rewards.gold },
      };
    });
    if (harvestGold > 0) {
      get().addNotification(`Thu hoạch! +${harvestGold}💰 +${harvestExp}⭐`, "success");
      get().checkAchievements();
    }
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
        stats: { ...s.stats, totalPestsKilled: s.stats.totalPestsKilled + 1 },
      };
    });
    get().addNotification("Bắt sâu thành công! 🐛", "success");
    get().checkAchievements();
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

      // Preserve current progress % so the bar doesn't freeze.
      // progress = 1 - remainingTime/totalGrowTime => totalGrowTime = newRemaining / (1 - progress)
      const currentProgress = plant.totalGrowTime > 0
        ? 1 - plant.remainingTime / plant.totalGrowTime
        : 0;
      const denominator = Math.max(0.001, 1 - currentProgress);
      const newTotalGrowTime = Math.max(newRemainingTime, Math.ceil(newRemainingTime / denominator));

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
            totalGrowTime: newTotalGrowTime,
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

          // Paused if pest or thirsty (per spec: isPest pauses growth)
          if (plant.isPest || plant.isThirsty) return slot;

          changed = true;
          let newRemaining = plant.remainingTime - 1;
          if (newRemaining < 0) newRemaining = 0;

          // Random pest spawn
          let hasPest: boolean = plant.isPest;
          if (!hasPest && newRemaining > 0 && Math.random() < PEST_SPAWN_CHANCE) {
            hasPest = true;
          }

          // Pest auto-clears when plant matures
          if (hasPest && newRemaining <= 0) {
            hasPest = false;
          }

          return {
            ...slot,
            plant: {
              ...plant,
              remainingTime: newRemaining,
              isPest: hasPest,
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
        isActing: false,
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

    // If currently performing an action, wait
    if (monkey.isActing) return;

    const cloud = state.clouds[state.activeCloudIndex];
    if (!cloud) return;

    const slotIndex = monkey.currentSlotIndex;
    const slot = cloud.slots[slotIndex];
    if (!slot) {
      // Move to next slot
      set((s) => ({
        monkey: { ...s.monkey, currentSlotIndex: (s.monkey.currentSlotIndex + 1) % SLOTS_PER_LAYER },
      }));
      return;
    }

    // Scan and decide on action
    let action: "removePest" | "harvest" | "water" | "plant" | "fertilize" | null = null;

    if (slot.plant?.isPest && state.inventory.tools.insectNet > 0) {
      action = "removePest";
    } else if (slot.plant && slot.plant.remainingTime <= 0) {
      action = "harvest";
    } else if (slot.plant?.isThirsty && state.inventory.tools.waterCan > 0) {
      action = "water";
    } else if (
      !slot.plant && slot.potId && monkey.autoPlantSeedId &&
      (state.inventory.seeds[monkey.autoPlantSeedId] ?? 0) > 0
    ) {
      action = "plant";
    } else if (slot.plant && !slot.plant.isFertilized) {
      const hasFert = Object.values(state.inventory.fertilizers).some(q => q > 0);
      if (hasFert) action = "fertilize";
    }

    if (action) {
      // Mark as acting (0.2s delay)
      set((s) => ({ monkey: { ...s.monkey, isActing: true } }));

      // Execute action after a micro-delay to let UI update
      queueMicrotask(() => {
        const currentState = get();
        switch (action) {
          case "removePest":
            get().removePest(slot.id);
            break;
          case "harvest":
            get().harvest(slot.id);
            break;
          case "water":
            get().waterPlant(slot.id);
            break;
          case "plant":
            if (monkey.autoPlantSeedId) get().plantSeed(slot.id, monkey.autoPlantSeedId);
            break;
          case "fertilize": {
            const fertId = (Object.keys(currentState.inventory.fertilizers) as FertilizerId[])
              .find(id => (currentState.inventory.fertilizers[id] ?? 0) > 0);
            if (fertId) get().fertilize(slot.id, fertId);
            break;
          }
        }

        // After action, move to next slot
        set((s) => ({
          monkey: {
            ...s.monkey,
            isActing: false,
            currentSlotIndex: (s.monkey.currentSlotIndex + 1) % SLOTS_PER_LAYER,
          },
        }));
      });
    } else {
      // No action needed, move to next slot immediately
      set((s) => ({
        monkey: { ...s.monkey, currentSlotIndex: (s.monkey.currentSlotIndex + 1) % SLOTS_PER_LAYER },
      }));
    }
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

  // --- Machines ---
  startCraft: (machineId, recipeIndex) => {
    set((s) => {
      const machineDef = MACHINES[machineId];
      if (!machineDef) return s;
      const recipe = machineDef.recipes[recipeIndex];
      if (!recipe) return s;

      // Check machine is idle
      const machineState = s.machines.find(m => m.id === machineId);
      if (!machineState || machineState.craftingRecipeIndex !== null || machineState.hasProduct) return s;

      // Check ingredients
      for (const ing of recipe.ingredients) {
        if ((s.inventory.seeds[ing.plantId] ?? 0) < ing.amount) return s;
      }

      // Consume ingredients
      const newSeeds = { ...s.inventory.seeds };
      for (const ing of recipe.ingredients) {
        newSeeds[ing.plantId] = (newSeeds[ing.plantId] ?? 0) - ing.amount;
      }

      // Start crafting
      const newMachines = s.machines.map(m =>
        m.id === machineId
          ? { ...m, craftingRecipeIndex: recipeIndex, craftingRemainingTime: recipe.craftTimeSeconds, hasProduct: false }
          : m
      );

      return {
        inventory: { ...s.inventory, seeds: newSeeds },
        machines: newMachines,
      };
    });
  },

  collectProduct: (machineId) => {
    set((s) => {
      const machineState = s.machines.find(m => m.id === machineId);
      if (!machineState || !machineState.hasProduct || machineState.craftingRecipeIndex === null) return s;

      const machineDef = MACHINES[machineId];
      const recipe = machineDef?.recipes[machineState.craftingRecipeIndex];
      if (!recipe) return s;

      const newMachines = s.machines.map(m =>
        m.id === machineId
          ? { ...m, craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false }
          : m
      );

      const newUser = { ...s.user };
      newUser.gold += recipe.goldReward;
      newUser.exp += recipe.expReward;
      while (newUser.exp >= newUser.expToNextLevel) {
        newUser.exp -= newUser.expToNextLevel;
        newUser.level += 1;
        newUser.expToNextLevel = getExpForLevel(newUser.level);
      }

      return { user: newUser, machines: newMachines };
    });
  },

  machineTick: () => {
    set((s) => {
      let changed = false;
      const newMachines = s.machines.map(m => {
        if (m.craftingRecipeIndex === null || m.hasProduct) return m;
        changed = true;
        const newTime = m.craftingRemainingTime - 1;
        if (newTime <= 0) {
          return { ...m, craftingRemainingTime: 0, hasProduct: true };
        }
        return { ...m, craftingRemainingTime: newTime };
      });
      if (!changed) return s;
      return { machines: newMachines };
    });
  },

  // --- Shop ---
  buyItem: (shopItemId) => {
    const item = SHOP_ITEM_MAP[shopItemId];
    if (!item) return false;

    const state = get();
    if (state.user.level < item.unlockLevel) return false;

    // Check currency
    if (item.currency === "gold") {
      if (state.user.gold < item.price) return false;
    } else {
      if (state.user.ruby < item.price) return false;
    }

    set((s) => {
      const newInventory = { ...s.inventory };
      const newUser = { ...s.user };

      // Deduct currency
      if (item.currency === "gold") {
        newUser.gold -= item.price;
      } else {
        newUser.ruby -= item.price;
      }

      // Add item to inventory
      switch (item.target.type) {
        case "seed":
          newInventory.seeds = {
            ...newInventory.seeds,
            [item.target.id]: (newInventory.seeds[item.target.id] ?? 0) + item.quantity,
          };
          break;
        case "pot":
          newInventory.pots = {
            ...newInventory.pots,
            [item.target.id]: (newInventory.pots[item.target.id] ?? 0) + item.quantity,
          };
          break;
        case "fertilizer":
          newInventory.fertilizers = {
            ...newInventory.fertilizers,
            [item.target.id]: (newInventory.fertilizers[item.target.id] ?? 0) + item.quantity,
          };
          break;
        case "tool":
          newInventory.tools = {
            ...newInventory.tools,
            [item.target.id]: (newInventory.tools[item.target.id as keyof typeof newInventory.tools] ?? 0) + item.quantity,
          };
          break;
      }

      return { user: newUser, inventory: newInventory };
    });

    get().addNotification(`Mua ${item.name} thành công! ✅`, "success");
    return true;
  },

  // --- Pot Upgrade ---
  upgradePot: (fromPotId) => {
    const upgrade = POT_UPGRADE_CHAIN[fromPotId];
    if (!upgrade) return false; // max tier

    const state = get();

    // Need 2 pots of current tier
    if ((state.inventory.pots[fromPotId] ?? 0) < 2) return false;

    // Need pests
    if ((state.inventory.pests[upgrade.pestType] ?? 0) < upgrade.pestAmount) return false;

    set((s) => ({
      inventory: {
        ...s.inventory,
        pots: {
          ...s.inventory.pots,
          [fromPotId]: (s.inventory.pots[fromPotId] ?? 0) - 2,
          [upgrade.to]: (s.inventory.pots[upgrade.to] ?? 0) + 1,
        },
        pests: {
          ...s.inventory.pests,
          [upgrade.pestType]: (s.inventory.pests[upgrade.pestType] ?? 0) - upgrade.pestAmount,
        },
      },
      stats: { ...s.stats, totalUpgrades: s.stats.totalUpgrades + 1 },
    }));

    get().addNotification(`Nâng cấp thành công! ${POTS[upgrade.to].name}! 🔨`, "success");
    get().checkAchievements();
    return true;
  },

  // --- Save/Load ---
  saveGame: () => {
    const state = get();
    const saveData = {
      user: state.user,
      inventory: state.inventory,
      clouds: state.clouds,
      machines: state.machines,
      monkey: state.monkey,
      activeCloudIndex: state.activeCloudIndex,
      savedAt: Date.now(),
    };
    try {
      localStorage.setItem("kvtm_save", JSON.stringify(saveData));
    } catch {
      // localStorage not available
    }
  },

  loadGame: () => {
    try {
      const raw = localStorage.getItem("kvtm_save");
      if (!raw) return false;
      const data = JSON.parse(raw);
      set({
        user: data.user,
        inventory: data.inventory,
        clouds: data.clouds,
        machines: data.machines,
        monkey: data.monkey,
        activeCloudIndex: data.activeCloudIndex ?? 0,
      });
      return true;
    } catch {
      return false;
    }
  },

  resetGame: () => {
    localStorage.removeItem("kvtm_save");
    set({
      user: IS_SANDBOX ? createSandboxUser() : createProductionUser(),
      inventory: IS_SANDBOX ? createSandboxInventory() : createProductionInventory(),
      clouds: createInitialClouds(),
      machines: [
        { id: "juicer", craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
        { id: "oven", craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
        { id: "dryer", craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
      ],
      monkey: { isActive: false, bananasRemaining: IS_SANDBOX ? 99 : 0, autoPlantSeedId: null, currentSlotIndex: 0, isActing: false },
      activeCloudIndex: 0,
      activeTool: null,
      selectedSeedId: null,
      selectedPotId: null,
      selectedFertilizerId: null,
      currentView: "cloud",
    });
  },

  // --- Sandbox Toggle ---
  toggleSandbox: () => {
    set((s) => {
      const newIsSandbox = !s.isSandbox;
      return {
        isSandbox: newIsSandbox,
        user: newIsSandbox ? createSandboxUser() : createProductionUser(),
        inventory: newIsSandbox ? createSandboxInventory() : createProductionInventory(),
        clouds: createInitialClouds(),
        machines: [
          { id: "juicer", craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
          { id: "oven", craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
          { id: "dryer", craftingRecipeIndex: null, craftingRemainingTime: 0, hasProduct: false },
        ],
        monkey: { isActive: false, bananasRemaining: newIsSandbox ? 99 : 0, autoPlantSeedId: null, currentSlotIndex: 0, isActing: false },
        activeCloudIndex: 0,
        activeTool: null,
        selectedSeedId: null,
        selectedPotId: null,
        selectedFertilizerId: null,
      };
    });
  },

  // --- Daily Reward ---
  canClaimDailyReward: () => {
    const state = get();
    if (!state.lastDailyReward) return true;
    return Date.now() - state.lastDailyReward >= DAILY_REWARD_COOLDOWN_MS;
  },

  claimDailyReward: () => {
    const state = get();
    if (!state.canClaimDailyReward()) return false;

    const now = Date.now();
    let newStreak = state.dailyRewardStreak;

    // Check if streak should continue or reset
    if (state.lastDailyReward) {
      const hoursSince = (now - state.lastDailyReward) / (1000 * 60 * 60);
      if (hoursSince > 48) {
        newStreak = 0; // Reset if more than 48 hours
      }
    }

    newStreak = (newStreak + 1) % 7;
    const reward = DAILY_REWARDS[newStreak];

    set((s) => {
      const newUser = { ...s.user };
      newUser.gold += reward.gold;

      const newSeeds = { ...s.inventory.seeds };
      for (const [plantId, amount] of Object.entries(reward.seeds)) {
        newSeeds[plantId] = (newSeeds[plantId] ?? 0) + amount;
      }

      const newPots = { ...s.inventory.pots };
      if (reward.pots > 0) {
        newPots.pot_soil = (newPots.pot_soil ?? 0) + reward.pots;
      }

      return {
        user: newUser,
        inventory: {
          ...s.inventory,
          seeds: newSeeds,
          pots: newPots,
        },
        lastDailyReward: now,
        dailyRewardStreak: newStreak,
      };
    });

    get().addNotification(`🎁 Nhận thưởng ngày ${newStreak + 1}/7! +${reward.gold}💰`, "success");
    return true;
  },

  // --- Notifications ---
  addNotification: (msg, type = "info") => {
    set((s) => {
      const id = Date.now() + Math.random();
      const notif: Notification = { id, message: msg, type: type as Notification["type"], timestamp: Date.now() };
      const notifs = [...s.notifications, notif].slice(-5);
      setTimeout(() => {
        useGameStore.getState().removeNotification(id);
      }, 4000);
      return { notifications: notifs };
    });
  },

  removeNotification: (id) => {
    set((s) => ({
      notifications: s.notifications.filter(n => n.id !== id),
    }));
  },

  // --- Sell Items ---
  sellItem: (itemType, id, qty) => {
    const state = get();
    let have = 0;
    let sellPrice = 0;

    switch (itemType) {
      case "seed":
        have = state.inventory.seeds[id] ?? 0;
        sellPrice = Math.floor((PLANTS[id as PlantId]?.goldReward ?? 100) * 0.3);
        break;
      case "pot":
        have = state.inventory.pots[id] ?? 0;
        sellPrice = Math.floor((POTS[id as PotId]?.expBuffPercent ?? 1) * 100);
        break;
      case "fertilizer":
        have = state.inventory.fertilizers[id] ?? 0;
        sellPrice = Math.floor((FERTILIZERS[id as FertilizerId]?.timeReductionPercent ?? 1) * 20);
        break;
      case "pest":
        have = state.inventory.pests[id as PestType] ?? 0;
        sellPrice = 10;
        break;
    }

    if (have < qty) return false;
    const totalGold = sellPrice * qty;

    set((s) => {
      const newInv = { ...s.inventory };
      const newUser = { ...s.user, gold: s.user.gold + totalGold };

      switch (itemType) {
        case "seed":
          newInv.seeds = { ...newInv.seeds, [id]: (newInv.seeds[id] ?? 0) - qty };
          break;
        case "pot":
          newInv.pots = { ...newInv.pots, [id]: (newInv.pots[id] ?? 0) - qty };
          break;
        case "fertilizer":
          newInv.fertilizers = { ...newInv.fertilizers, [id]: (newInv.fertilizers[id] ?? 0) - qty };
          break;
        case "pest":
          newInv.pests = { ...newInv.pests, [id as PestType]: (newInv.pests[id as PestType] ?? 0) - qty };
          break;
      }

      return { user: newUser, inventory: newInv };
    });

    get().addNotification(`Bán ${qty} item được ${totalGold}💰`, "success");
    return true;
  },

  // --- Achievements ---
  checkAchievements: () => {
    set((s) => {
      const stats = { ...s.stats };
      stats.maxLevel = Math.max(stats.maxLevel, s.user.level);

      const newAchievements = s.achievements.map(a => {
        let current = a.current;
        switch (a.id) {
          case "harvest_10": case "harvest_50": case "harvest_200":
            current = stats.totalHarvested; break;
          case "gold_10k": case "gold_100k":
            current = stats.totalGoldEarned; break;
          case "pest_20":
            current = stats.totalPestsKilled; break;
          case "upgrade_3":
            current = stats.totalUpgrades; break;
          case "level_5": case "level_10":
            current = stats.maxLevel; break;
        }
        return { ...a, current };
      });

      return { stats, achievements: newAchievements };
    });
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
