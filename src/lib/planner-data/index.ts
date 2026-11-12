import type { AssetTemplate, PlannerCatalog } from "@/lib/types";

import { deviceAssets } from "./devices";
import { equipmentAssets } from "./equipment";
import { machineAssets } from "./machines";
import { medicalFurnitureAssets } from "./medical-furniture";
import { nonMedicalFurnitureAssets } from "./non-medical-furniture";
import { buildingPresets } from "./presets";
import { roomTemplates } from "./rooms";

export const assetTemplates: AssetTemplate[] = [
  ...deviceAssets,
  ...equipmentAssets,
  ...medicalFurnitureAssets,
  ...nonMedicalFurnitureAssets,
  ...machineAssets,
];

export { buildingPresets, roomTemplates };

export const plannerCatalog: PlannerCatalog = {
  roomTemplates,
  assetTemplates,
  buildingPresets,
};
