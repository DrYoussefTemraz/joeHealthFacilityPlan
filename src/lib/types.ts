/**
 * Domain types for JoeHealthPlan — healthcare facility master and capital planning.
 *
 * These are intentionally free of any data-source imports. When the mock layer
 * in `src/lib/data.ts` is replaced with Prisma or the Appwrite SDK, these
 * shapes should stay the same (or map onto your schema) so the UI components
 * do not need to change.
 *
 * Money is stored in cents. Areas are stored in square meters.
 */

export type FacilityType =
  | "hospital"
  | "surgical-center"
  | "outpatient-clinic"
  | "diagnostic-center";

export type FacilityStatus =
  | "operational"
  | "expansion"
  | "under-construction"
  | "planning";

/** Facility condition index style rating for a zone. */
export type ZoneCondition = "good" | "fair" | "poor";

export type ProjectPhase =
  | "concept"
  | "design"
  | "approvals"
  | "construction"
  | "commissioning"
  | "complete";

export type ProjectCategory =
  | "new-build"
  | "expansion"
  | "renovation"
  | "infrastructure"
  | "equipment";

export interface Zone {
  id: string;
  name: string;
  /** Clinical function: acute care, diagnostic, surgical, support, and so on. */
  function: string;
  areaSqm: number;
  utilizationPct: number;
  condition: ZoneCondition;
}

export interface CapitalProject {
  id: string;
  /** Points at `Facility.slug`. Becomes a foreign key in the database. */
  facilitySlug: string;
  name: string;
  category: ProjectCategory;
  phase: ProjectPhase;
  budgetCents: number;
  startYear: number;
  targetYear: number;
  progressPct: number;
  description: string;
}

export interface Facility {
  /** URL-safe identifier. Becomes the primary key / unique field in the DB. */
  slug: string;
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  city: string;
  region: string;
  openedYear: number;
  siteAreaSqm: number;
  grossFloorAreaSqm: number;
  /** `null` for outpatient sites with no inpatient beds. */
  licensedBeds: number | null;
  occupancyPct: number;
  summary: string;
  serviceLines: string[];
  zones: Zone[];
  projects: CapitalProject[];
}

/** Icon keys are resolved to SVG components in `src/components/icons.tsx`. */
export type IconName =
  | "building"
  | "bed"
  | "blueprint"
  | "grid"
  | "gauge"
  | "budget"
  | "clipboard"
  | "calendar"
  | "pin"
  | "phone"
  | "mail"
  | "clock"
  | "check"
  | "arrow-right";

export interface PlanningCapability {
  slug: string;
  title: string;
  summary: string;
  icon: IconName;
}

export interface ContactDetail {
  icon: IconName;
  label: string;
  value: string;
}

/**
 * Virtual building planner
 * ------------------------
 * The planner is a client-side building model fed by the same data seam as the
 * rest of the site. Room templates and asset templates are backend-ready: they
 * are plain serialisable records, so `getPlannerCatalog()` can be swapped for a
 * database or API call without changing the UI.
 */

/** Functional grouping used by the "Add room" dropdown. */
export type RoomCategory =
  | "inpatient"
  | "critical-care"
  | "maternal-pediatric"
  | "surgical-procedural"
  | "emergency-trauma"
  | "diagnostic-imaging"
  | "laboratory-pathology"
  | "pharmacy"
  | "sterile-processing"
  | "renal-infusion"
  | "rehabilitation"
  | "ambulatory"
  | "support-logistics"
  | "administrative-staff"
  | "plant-engineering";

/**
 * The five item groups exposed in the planner. The split keeps clinical
 * point-of-care devices separate from major equipment, furniture and the
 * building/back-of-house machinery.
 */
export type AssetCategory =
  | "device"
  | "equipment"
  | "medical-furniture"
  | "non-medical-furniture"
  | "machine";

/** Services a room or item can require from the building. */
export type MedicalUtility =
  | "oxygen"
  | "medical-air"
  | "vacuum"
  | "nitrous-oxide"
  | "nitrogen"
  | "emergency-power"
  | "isolated-power"
  | "data"
  | "water"
  | "drain"
  | "steam"
  | "natural-gas"
  | "compressed-air"
  | "cooling"
  | "negative-pressure"
  | "hepa-filtration"
  | "radiation-shielding"
  | "rf-shielding"
  | "exhaust";

export type AssetInstallation =
  | "mobile"
  | "fixed"
  | "wall-mounted"
  | "ceiling-mounted";

export interface RecommendedAsset {
  assetId: string;
  quantity: number;
}

export interface RoomTemplate {
  id: string;
  name: string;
  category: RoomCategory;
  description: string;
  defaultAreaSqm: number;
  patientBeds: number;
  utilities: MedicalUtility[];
  recommendedSetup: RecommendedAsset[];
}

export interface AssetTemplate {
  id: string;
  name: string;
  category: AssetCategory;
  description: string;
  /** Money is stored in cents, consistent with the rest of the site. */
  unitCostCents: number;
  utilities: MedicalUtility[];
  /** `"all"` marks items such as waste bins that fit any room. */
  roomCategories: RoomCategory[] | "all";
  installation: AssetInstallation;
}

export interface BuildingPresetRoom {
  templateId: string;
  floorIndex: number;
  /** Defaults to the room template's recommended setup when omitted. */
  assets?: RecommendedAsset[];
}

export interface BuildingPreset {
  id: string;
  name: string;
  description: string;
  floors: string[];
  rooms: BuildingPresetRoom[];
}

/** Everything the planner needs from the data layer. */
export interface PlannerCatalog {
  roomTemplates: RoomTemplate[];
  assetTemplates: AssetTemplate[];
  buildingPresets: BuildingPreset[];
}

export interface Floor {
  id: string;
  name: string;
  level: number;
}

export interface PlacedAsset {
  /** Instance id, unique inside the building plan. */
  id: string;
  assetId: string;
  quantity: number;
}

export interface PlacedRoom {
  id: string;
  templateId: string;
  name: string;
  floorId: string;
  areaSqm: number;
  assets: PlacedAsset[];
}

/** The client-side building state. Designed to be POSTed to an API later. */
export interface BuildingPlan {
  name: string;
  floors: Floor[];
  rooms: PlacedRoom[];
}
