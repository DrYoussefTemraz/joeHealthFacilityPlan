import type { AssetTemplate, PlannerCatalog } from "@/lib/types";

import { hotelDeviceAssets } from "./devices";
import { hotelEquipmentAssets } from "./equipment";
import { hotelGuestFurnitureAssets } from "./guest-furniture";
import { hotelMachineAssets } from "./machines";
import { hotelBuildingPresets } from "./presets";
import { hotelPublicFurnitureAssets } from "./public-furniture";
import { hotelRoomTemplates } from "./rooms";

export const hotelAssetTemplates: AssetTemplate[] = [
  ...hotelDeviceAssets,
  ...hotelEquipmentAssets,
  ...hotelGuestFurnitureAssets,
  ...hotelPublicFurnitureAssets,
  ...hotelMachineAssets,
];

export { hotelBuildingPresets, hotelRoomTemplates };

export const hotelPlannerCatalog: PlannerCatalog = {
  vertical: "hospitality",
  roomTemplates: hotelRoomTemplates,
  assetTemplates: hotelAssetTemplates,
  buildingPresets: hotelBuildingPresets,
};
