// ============================================================
// Khu Vườn Trên Mây - Game Constants
// ============================================================

import type {
  PlantDefinition,
  PotDefinition,
  FertilizerDefinition,
  ToolDefinition,
  MachineDefinition,
  PlantId,
  PotId,
  FertilizerId,
  PestType,
  MachineId,
} from "./types";

// --- Plants Catalog ---

export const PLANTS: Record<PlantId, PlantDefinition> = {
  linh_lan: {
    id: "linh_lan",
    name: "Linh Lan",
    growTimeSeconds: 300,
    pestType: "beetle",
    expReward: 10,
    goldReward: 100,
    unlockLevel: 1,
  },
  hoa_cuc: {
    id: "hoa_cuc",
    name: "Hoa Cúc",
    growTimeSeconds: 900,
    pestType: "beetle",
    expReward: 25,
    goldReward: 250,
    unlockLevel: 1,
  },
  hoa_hong: {
    id: "hoa_hong",
    name: "Hoa Hồng",
    growTimeSeconds: 1800,
    pestType: "beetle",
    expReward: 50,
    goldReward: 600,
    unlockLevel: 3,
  },
  hong_trang: {
    id: "hong_trang",
    name: "Hồng Trắng",
    growTimeSeconds: 3600,
    pestType: "caterpillar",
    expReward: 120,
    goldReward: 1500,
    unlockLevel: 5,
  },
  hoa_tulip: {
    id: "hoa_tulip",
    name: "Hoa Tulip",
    growTimeSeconds: 7200,
    pestType: "caterpillar",
    expReward: 300,
    goldReward: 4000,
    unlockLevel: 8,
  },
  hoa_huong_duong: {
    id: "hoa_huong_duong",
    name: "Hoa Hướng Dương",
    growTimeSeconds: 14400,
    pestType: "snail",
    expReward: 600,
    goldReward: 8000,
    unlockLevel: 12,
  },
  cay_tao: {
    id: "cay_tao",
    name: "Cây Táo",
    growTimeSeconds: 28800,
    pestType: "snail",
    expReward: 1200,
    goldReward: 15000,
    unlockLevel: 15,
  },
  cay_dau: {
    id: "cay_dau",
    name: "Cây Dâu",
    growTimeSeconds: 43200,
    pestType: "dragonfly",
    expReward: 2000,
    goldReward: 25000,
    unlockLevel: 20,
  },
};

export const PLANT_IDS: PlantId[] = Object.keys(PLANTS) as PlantId[];

// --- Pots Catalog ---

export const POTS: Record<PotId, PotDefinition> = {
  pot_soil: {
    id: "pot_soil",
    name: "Chậu Đất",
    expBuffPercent: 0,
    goldBuffPercent: 0,
    timeReductionPercent: 0,
  },
  pot_bronze: {
    id: "pot_bronze",
    name: "Chậu Đồng",
    expBuffPercent: 5,
    goldBuffPercent: 5,
    timeReductionPercent: 5,
    upgradeCost: {
      gold: 1000,
      pestType: "beetle",
      pestAmount: 5,
    },
  },
  pot_silver: {
    id: "pot_silver",
    name: "Chậu Bạc",
    expBuffPercent: 15,
    goldBuffPercent: 15,
    timeReductionPercent: 10,
    upgradeCost: {
      gold: 5000,
      pestType: "caterpillar",
      pestAmount: 10,
    },
  },
  pot_gold: {
    id: "pot_gold",
    name: "Chậu Vàng",
    expBuffPercent: 30,
    goldBuffPercent: 30,
    timeReductionPercent: 20,
    upgradeCost: {
      gold: 20000,
      pestType: "snail",
      pestAmount: 20,
    },
  },
  pot_diamond: {
    id: "pot_diamond",
    name: "Chậu Kim Cương",
    expBuffPercent: 60,
    goldBuffPercent: 60,
    timeReductionPercent: 40,
    upgradeCost: {
      gold: 100000,
      pestType: "dragonfly",
      pestAmount: 50,
    },
  },
};

export const POT_IDS: PotId[] = Object.keys(POTS) as PotId[];

// --- Fertilizers ---

export const FERTILIZERS: Record<FertilizerId, FertilizerDefinition> = {
  fertilizer_basic: {
    id: "fertilizer_basic",
    name: "Phân Thường",
    timeReductionPercent: 10,
    expBuffPercent: 0,
    goldBuffPercent: 0,
  },
  fertilizer_advanced: {
    id: "fertilizer_advanced",
    name: "Phân Cao Cấp",
    timeReductionPercent: 25,
    expBuffPercent: 10,
    goldBuffPercent: 10,
  },
  fertilizer_premium: {
    id: "fertilizer_premium",
    name: "Phân Đặc Biệt",
    timeReductionPercent: 50,
    expBuffPercent: 25,
    goldBuffPercent: 25,
  },
};

export const FERTILIZER_IDS: FertilizerId[] = Object.keys(FERTILIZERS) as FertilizerId[];

// --- Tools ---

export const TOOLS: Record<string, ToolDefinition> = {
  tool_plant: {
    id: "tool_plant",
    name: "Trồng",
    description: "Trồng hạt giống vào chậu",
  },
  tool_water: {
    id: "tool_water",
    name: "Tưới",
    description: "Tưới nước cho cây",
  },
  tool_pest: {
    id: "tool_pest",
    name: "Bắt Sâu",
    description: "Loại bỏ sâu bọ trên cây",
  },
  tool_fertilize: {
    id: "tool_fertilize",
    name: "Bón Phân",
    description: "Bón phân cho cây đang lớn",
  },
  tool_harvest: {
    id: "tool_harvest",
    name: "Thu Hoạch",
    description: "Thu hoạch cây đã trưởng thành",
  },
  tool_pick_pot: {
    id: "tool_pick_pot",
    name: "Cất Chậu",
    description: "Cất chậu về kho",
  },
  tool_place_pot: {
    id: "tool_place_pot",
    name: "Đặt Chậu",
    description: "Đặt chậu từ kho vào ô",
  },
};

// --- Pest Names ---

export const PEST_NAMES: Record<PestType, string> = {
  beetle: "Bọ Cánh Cứng",
  caterpillar: "Sâu Bướm",
  snail: "Ốc Sên",
  dragonfly: "Chuồn Chuồn",
};

// --- Level System ---

export function getExpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// --- Cloud Config ---

export const CLOUD_LAYER_COUNT = 8;
export const SLOTS_PER_LAYER = 9;

// --- Pest Spawn Config ---
// Chance per tick that a plant gets a pest (0-1)
export const PEST_SPAWN_CHANCE = 0.005;
// Chance per tick that a plant gets thirsty (0-1)
export const THIRSTY_CHANCE = 0.003;
// After how many seconds without water does a plant become thirsty deterministically
export const THIRSTY_TIMEOUT_SECONDS = 120;

// --- Monkey AI Config ---
export const MONKEY_ACTION_INTERVAL_MS = 200; // 0.2s per action

// --- Machines ---

export const MACHINES: Record<MachineId, MachineDefinition> = {
  juicer: {
    id: "juicer",
    name: "Máy Ép Trái Cây",
    icon: "🧃",
    recipes: [
      {
        name: "Nước Linh Lan",
        icon: "🥤",
        ingredients: [{ plantId: "linh_lan", amount: 3 }],
        craftTimeSeconds: 30,
        goldReward: 500,
        expReward: 20,
      },
      {
        name: "Nước Hoa Cúc",
        icon: "🍵",
        ingredients: [{ plantId: "hoa_cuc", amount: 3 }],
        craftTimeSeconds: 60,
        goldReward: 1200,
        expReward: 50,
      },
      {
        name: "Nước Hồng",
        icon: "🍷",
        ingredients: [{ plantId: "hoa_hong", amount: 2 }],
        craftTimeSeconds: 120,
        goldReward: 2500,
        expReward: 100,
      },
    ],
  },
  oven: {
    id: "oven",
    name: "Máy Nướng Bánh",
    icon: "🧁",
    recipes: [
      {
        name: "Bánh Cúc",
        icon: "🍰",
        ingredients: [{ plantId: "hoa_cuc", amount: 5 }],
        craftTimeSeconds: 90,
        goldReward: 2000,
        expReward: 80,
      },
      {
        name: "Bánh Tulip",
        icon: "🎂",
        ingredients: [{ plantId: "hoa_tulip", amount: 3 }],
        craftTimeSeconds: 180,
        goldReward: 8000,
        expReward: 250,
      },
    ],
  },
  dryer: {
    id: "dryer",
    name: "Máy Sấy",
    icon: "🌬️",
    recipes: [
      {
        name: "Hoa Hồng Sấy",
        icon: "🥀",
        ingredients: [{ plantId: "hoa_hong", amount: 4 }],
        craftTimeSeconds: 60,
        goldReward: 3000,
        expReward: 120,
      },
      {
        name: "Hoa Hướng Dương Sấy",
        icon: "🌻",
        ingredients: [{ plantId: "hoa_huong_duong", amount: 2 }],
        craftTimeSeconds: 150,
        goldReward: 12000,
        expReward: 400,
      },
    ],
  },
};

export const MACHINE_IDS: MachineId[] = ["juicer", "oven", "dryer"];
