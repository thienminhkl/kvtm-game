// ============================================================
// Khu Vườn Trên Mây - Game Module Exports
// ============================================================

// Types
export type {
  PlantId,
  PotId,
  ToolId,
  PestType,
  FertilizerId,
  PlantGrowthStage,
  MachineId,
  GameView,
  ShopCategory,
  ShopItem,
  PlantDefinition,
  PotDefinition,
  FertilizerDefinition,
  ToolDefinition,
  Recipe,
  RecipeIngredient,
  MachineDefinition,
  MachineState,
  SlotPlant,
  Slot,
  CloudLayer,
  SeedInventory,
  PotInventory,
  ToolInventory,
  FertilizerInventory,
  PestInventory,
  Inventory,
  User,
  MonkeyAI,
  ActiveTool,
  GameStore,
} from "./types";

// Constants
export {
  PLANTS,
  PLANT_IDS,
  POTS,
  POT_IDS,
  FERTILIZERS,
  FERTILIZER_IDS,
  TOOLS,
  PEST_NAMES,
  MACHINES,
  MACHINE_IDS,
  SHOP_ITEMS,
  SHOP_ITEM_MAP,
  getExpForLevel,
  CLOUD_LAYER_COUNT,
  SLOTS_PER_LAYER,
  PEST_SPAWN_CHANCE,
  MONKEY_ACTION_INTERVAL_MS,
} from "./constants";

// Store
export { useGameStore, getGrowthStage } from "./store";

// Engine
export { useGameEngine } from "./engine";
