import type {
  AssetCategory,
  AssetTemplate,
  BuildingPlan,
  MedicalUtility,
  PlacedRoom,
  PlannerCatalog,
  PlannerVertical,
  RoomCategory,
  RoomTemplate,
} from "./types";

/** Presentation order for the five healthcare asset groups. */
export const ASSET_CATEGORY_ORDER: AssetCategory[] = [
  "device",
  "equipment",
  "medical-furniture",
  "non-medical-furniture",
  "machine",
];

/** Presentation order for the five hospitality asset groups. */
export const HOSPITALITY_ASSET_CATEGORY_ORDER: AssetCategory[] = [
  "device",
  "equipment",
  "guest-furniture",
  "public-furniture",
  "machine",
];

export function getAssetCategoryOrder(
  vertical: PlannerVertical,
): AssetCategory[] {
  return vertical === "hospitality"
    ? HOSPITALITY_ASSET_CATEGORY_ORDER
    : ASSET_CATEGORY_ORDER;
}

/** Presentation order for the healthcare room dropdown groups. */
export const ROOM_CATEGORY_ORDER: RoomCategory[] = [
  "inpatient",
  "critical-care",
  "maternal-pediatric",
  "surgical-procedural",
  "emergency-trauma",
  "diagnostic-imaging",
  "laboratory-pathology",
  "pharmacy",
  "sterile-processing",
  "renal-infusion",
  "rehabilitation",
  "ambulatory",
  "support-logistics",
  "administrative-staff",
  "plant-engineering",
];

/** Presentation order for the hospitality room dropdown groups. */
export const HOSPITALITY_ROOM_CATEGORY_ORDER: RoomCategory[] = [
  "guest-rooms",
  "suites",
  "front-office",
  "food-beverage",
  "kitchen",
  "meeting-events",
  "wellness-leisure",
  "housekeeping-laundry",
  "back-of-house",
  "guest-services",
  "health-safety",
  "parking-transport",
  "outdoor-leisure",
  "engineering-plant",
  "administrative-staff",
];

export function getRoomCategoryOrder(
  vertical: PlannerVertical,
): RoomCategory[] {
  return vertical === "hospitality"
    ? HOSPITALITY_ROOM_CATEGORY_ORDER
    : ROOM_CATEGORY_ORDER;
}

/** Presentation order for utility badges. */
export const MEDICAL_UTILITY_ORDER: MedicalUtility[] = [
  "oxygen",
  "medical-air",
  "vacuum",
  "nitrous-oxide",
  "nitrogen",
  "emergency-power",
  "isolated-power",
  "data",
  "water",
  "drain",
  "steam",
  "natural-gas",
  "compressed-air",
  "cooling",
  "negative-pressure",
  "hepa-filtration",
  "radiation-shielding",
  "rf-shielding",
  "exhaust",
];

export interface AssetCategoryBreakdown {
  category: AssetCategory;
  quantity: number;
  costCents: number;
}

export interface BuildingSummary {
  floorCount: number;
  roomCount: number;
  patientBeds: number;
  areaSqm: number;
  assetQuantity: number;
  assetCostCents: number;
  categories: AssetCategoryBreakdown[];
  utilities: MedicalUtility[];
}

export interface BillOfMaterialsRow {
  asset: AssetTemplate;
  quantity: number;
  roomCount: number;
  extendedCostCents: number;
}

export interface RecommendedAssetView {
  asset: AssetTemplate;
  quantity: number;
}

export function createAssetMap(catalog: PlannerCatalog): Map<string, AssetTemplate> {
  return new Map(catalog.assetTemplates.map((asset) => [asset.id, asset]));
}

export function createRoomMap(catalog: PlannerCatalog): Map<string, RoomTemplate> {
  return new Map(catalog.roomTemplates.map((room) => [room.id, room]));
}

export function isCompatible(asset: AssetTemplate, room: RoomTemplate): boolean {
  return (
    asset.roomCategories === "all" ||
    asset.roomCategories.includes(room.category)
  );
}

/**
 * Items offered inside a room. The category check keeps imaging systems out of
 * patient rooms and office furniture out of operating theatres while still
 * allowing deliberate `"all"` items such as waste bins.
 */
export function getCompatibleAssets(
  catalog: PlannerCatalog,
  room: RoomTemplate,
): AssetTemplate[] {
  const order = getAssetCategoryOrder(catalog.vertical);

  return catalog.assetTemplates
    .filter((asset) => isCompatible(asset, room))
    .sort(
      (a, b) =>
        order.indexOf(a.category) - order.indexOf(b.category) ||
        a.name.localeCompare(b.name),
    );
}

export function groupAssetsByCategory(
  assets: AssetTemplate[],
  order: AssetCategory[] = ASSET_CATEGORY_ORDER,
): Array<{ category: AssetCategory; assets: AssetTemplate[] }> {
  return order
    .map((category) => ({
      category,
      assets: assets.filter((asset) => asset.category === category),
    }))
    .filter((group) => group.assets.length > 0);
}

export function getRecommendedAssets(
  catalog: PlannerCatalog,
  room: RoomTemplate,
): RecommendedAssetView[] {
  const assets = createAssetMap(catalog);

  return room.recommendedSetup.flatMap((item) => {
    const asset = assets.get(item.assetId);
    return asset ? [{ asset, quantity: item.quantity }] : [];
  });
}

export function getRoomAssetCost(
  room: PlacedRoom,
  catalog: PlannerCatalog,
): number {
  const assets = createAssetMap(catalog);
  return room.assets.reduce((total, placed) => {
    const asset = assets.get(placed.assetId);
    return total + (asset ? asset.unitCostCents * placed.quantity : 0);
  }, 0);
}

export function getRoomAssetQuantity(room: PlacedRoom): number {
  return room.assets.reduce((total, asset) => total + asset.quantity, 0);
}

export function calculateBuildingSummary(
  building: BuildingPlan,
  catalog: PlannerCatalog,
): BuildingSummary {
  const rooms = createRoomMap(catalog);
  const assets = createAssetMap(catalog);
  const categoryOrder = getAssetCategoryOrder(catalog.vertical);
  const categoryTotals = new Map<AssetCategory, AssetCategoryBreakdown>(
    categoryOrder.map((category) => [
      category,
      { category, quantity: 0, costCents: 0 },
    ]),
  );
  const utilities = new Set<MedicalUtility>();
  let patientBeds = 0;
  let areaSqm = 0;
  let assetQuantity = 0;
  let assetCostCents = 0;

  for (const room of building.rooms) {
    const template = rooms.get(room.templateId);
    if (template) {
      patientBeds += template.patientBeds;
      areaSqm += room.areaSqm;
      template.utilities.forEach((utility) => utilities.add(utility));
    }

    for (const placed of room.assets) {
      const asset = assets.get(placed.assetId);
      if (!asset) {
        continue;
      }

      assetQuantity += placed.quantity;
      const cost = asset.unitCostCents * placed.quantity;
      assetCostCents += cost;

      const category = categoryTotals.get(asset.category);
      if (category) {
        category.quantity += placed.quantity;
        category.costCents += cost;
      }

      asset.utilities.forEach((utility) => utilities.add(utility));
    }
  }

  return {
    floorCount: building.floors.length,
    roomCount: building.rooms.length,
    patientBeds,
    areaSqm,
    assetQuantity,
    assetCostCents,
    categories: categoryOrder.map(
      (category) => categoryTotals.get(category)!,
    ),
    utilities: MEDICAL_UTILITY_ORDER.filter((utility) => utilities.has(utility)),
  };
}

export function calculateBillOfMaterials(
  building: BuildingPlan,
  catalog: PlannerCatalog,
): BillOfMaterialsRow[] {
  const assets = createAssetMap(catalog);
  const categoryOrder = getAssetCategoryOrder(catalog.vertical);
  const rows = new Map<
    string,
    { asset: AssetTemplate; quantity: number; roomIds: Set<string> }
  >();

  for (const room of building.rooms) {
    for (const placed of room.assets) {
      const asset = assets.get(placed.assetId);
      if (!asset) {
        continue;
      }

      const existing = rows.get(asset.id);
      if (existing) {
        existing.quantity += placed.quantity;
        existing.roomIds.add(room.id);
      } else {
        rows.set(asset.id, {
          asset,
          quantity: placed.quantity,
          roomIds: new Set([room.id]),
        });
      }
    }
  }

  return Array.from(rows.values())
    .map((row) => ({
      asset: row.asset,
      quantity: row.quantity,
      roomCount: row.roomIds.size,
      extendedCostCents: row.asset.unitCostCents * row.quantity,
    }))
    .sort(
      (a, b) =>
        categoryOrder.indexOf(a.asset.category) -
          categoryOrder.indexOf(b.asset.category) ||
        a.asset.name.localeCompare(b.asset.name),
    );
}
