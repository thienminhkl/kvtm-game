// ============================================================
// Khu Vườn Trên Mây - Game Type Definitions
// ============================================================

// --- Enums ---

export type PlantId =
  | "linh_lan"
  | "hoa_cuc"
  | "hoa_hong"
  | "hong_trang"
  | "hoa_tulip"
  | "hoa_huong_duong"
  | "cay_tao"
  | "cay_dau";

export type PotId = "pot_soil" | "pot_bronze" | "pot_silver" | "pot_gold" | "pot_diamond";

export type ToolId =
  | "tool_plant"
  | "tool_water"
  | "tool_pest"
  | "tool_fertilize"
  | "tool_harvest"
  | "tool_pick_pot"
  | "tool_place_pot";

export type PestType = "beetle" | "caterpillar" | "snail" | "dragonfly";

export type FertilizerId = "fertilizer_basic" | "fertilizer_advanced" | "fertilizer_premium";

export type PlantGrowthStage = 0 | 1 | 2 | 3 | 4; // 0=empty, 1=25%, 2=50%, 3=75%, 4=100% ready

export type MachineId = "juicer" | "oven" | "dryer";

export type GameView = "cloud" | "ground";

// --- Data Models ---

export interface PlantDefinition {
  id: PlantId;
  name: string;
  growTimeSeconds: number;
  pestType: PestType;
  expReward: number;
  goldReward: number;
  unlockLevel: number;
}

export interface PotDefinition {
  id: PotId;
  name: string;
  expBuffPercent: number;
  goldBuffPercent: number;
  timeReductionPercent: number;
  upgradeCost?: {
    gold: number;
    pestType: PestType;
    pestAmount: number;
  };
}

export interface FertilizerDefinition {
  id: FertilizerId;
  name: string;
  timeReductionPercent: number;
  expBuffPercent: number;
  goldBuffPercent: number;
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
}

// --- Slot State ---

export interface SlotPlant {
  plantId: PlantId;
  totalGrowTime: number; // seconds, adjusted by pot
  remainingTime: number; // seconds left
  isPest: boolean;
  isThirsty: boolean;
  isFertilized: boolean;
  plantedAt: number; // timestamp
}

export interface Slot {
  id: string; // e.g. "cloud-0-slot-3"
  potId: PotId | null; // null = empty slot, no pot placed
  plant: SlotPlant | null; // null = no plant growing
}

// --- Cloud Layer ---

export interface CloudLayer {
  id: string; // e.g. "cloud-0"
  level: number; // 0-indexed
  slots: Slot[]; // always 9 slots (3x3)
}

// --- Inventory ---

export interface SeedInventory {
  [key: string]: number; // PlantId -> quantity
}

export interface PotInventory {
  [key: string]: number; // PotId -> quantity
}

export interface ToolInventory {
  waterCan: number;
  insectNet: number;
  harvestBasket: number;
  banana: number; // for monkey activation
}

export interface FertilizerInventory {
  [key: string]: number; // FertilizerId -> quantity
}

export interface PestInventory {
  [key: string]: number; // PestType -> quantity (caught pests)
}

export interface Inventory {
  seeds: SeedInventory;
  pots: PotInventory;
  tools: ToolInventory;
  fertilizers: FertilizerInventory;
  pests: PestInventory;
}

// --- User ---

export interface User {
  level: number;
  exp: number;
  expToNextLevel: number;
  gold: number;
  ruby: number;
}

// --- Monkey AI ---

export interface MonkeyAI {
  isActive: boolean;
  bananasRemaining: number;
  autoPlantSeedId: PlantId | null;
  currentSlotIndex: number;
  isActing: boolean; // true while performing an action (0.2s delay)
}

// --- Active Tool ---

export type ActiveTool = ToolId | null;

// --- Game Store ---

export interface GameStore {
  // Data
  user: User;
  inventory: Inventory;
  clouds: CloudLayer[];
  monkey: MonkeyAI;

  // UI State
  activeTool: ActiveTool;
  selectedSeedId: PlantId | null;
  selectedPotId: PotId | null;
  selectedFertilizerId: FertilizerId | null;
  activeCloudIndex: number; // which cloud layer is currently viewed

  // Actions - will be defined in store
  setActiveTool: (tool: ActiveTool) => void;
  setSelectedSeedId: (id: PlantId | null) => void;
  setSelectedPotId: (id: PotId | null) => void;
  setSelectedFertilizerId: (id: FertilizerId | null) => void;
  setActiveCloudIndex: (index: number) => void;

  // Game Actions
  plantSeed: (slotId: string, plantId: PlantId) => void;
  harvest: (slotId: string) => void;
  waterPlant: (slotId: string) => void;
  removePest: (slotId: string) => void;
  fertilize: (slotId: string, fertilizerId: FertilizerId) => void;
  pickPot: (slotId: string) => void;
  placePot: (slotId: string, potId: PotId) => void;

  // Engine
  tick: () => void; // called every second by growth engine

  // Monkey AI
  toggleMonkey: () => void;
  setMonkeyAutoPlant: (seedId: PlantId | null) => void;
  monkeyTick: () => void;

  // Utility
  addExp: (amount: number) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  // View
  currentView: GameView;
  setCurrentView: (view: GameView) => void;

  // Machines
  machines: MachineState[];
  startCraft: (machineId: MachineId, recipeIndex: number) => void;
  collectProduct: (machineId: MachineId) => void;
  machineTick: () => void;
}

// --- Machines ---

export interface RecipeIngredient {
  plantId: PlantId;
  amount: number;
}

export interface Recipe {
  name: string;
  icon: string;
  ingredients: RecipeIngredient[];
  craftTimeSeconds: number;
  goldReward: number;
  expReward: number;
}

export interface MachineDefinition {
  id: MachineId;
  name: string;
  icon: string;
  recipes: Recipe[];
}

export interface MachineState {
  id: MachineId;
  craftingRecipeIndex: number | null; // null = idle
  craftingRemainingTime: number; // seconds left
  hasProduct: boolean; // ready to collect
}
