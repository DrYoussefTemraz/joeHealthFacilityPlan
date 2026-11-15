import type {
  AssetCategory,
  AssetInstallation,
  FacilityStatus,
  FacilityType,
  MedicalUtility,
  PlannerVertical,
  ProjectCategory,
  ProjectPhase,
  RoomCategory,
  ZoneCondition,
} from "@/lib/types";

import type { BadgeVariant } from "./badge";

export const facilityTypeLabels: Record<FacilityType, string> = {
  hospital: "Hospital",
  "surgical-center": "Surgical center",
  "outpatient-clinic": "Outpatient clinic",
  "diagnostic-center": "Diagnostic center",
};

export const facilityStatusLabels: Record<FacilityStatus, string> = {
  operational: "Operational",
  expansion: "Expansion",
  "under-construction": "Under construction",
  planning: "In planning",
};

export const facilityStatusVariants: Record<FacilityStatus, BadgeVariant> = {
  operational: "good",
  expansion: "warn",
  "under-construction": "brand",
  planning: "neutral",
};

export const zoneConditionLabels: Record<ZoneCondition, string> = {
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

export const zoneConditionVariants: Record<ZoneCondition, BadgeVariant> = {
  good: "good",
  fair: "warn",
  poor: "crit",
};

export const projectPhaseLabels: Record<ProjectPhase, string> = {
  concept: "Concept",
  design: "Design",
  approvals: "Approvals",
  construction: "Construction",
  commissioning: "Commissioning",
  complete: "Complete",
};

export const projectPhaseVariants: Record<ProjectPhase, BadgeVariant> = {
  concept: "neutral",
  design: "neutral",
  approvals: "warn",
  construction: "brand",
  commissioning: "warn",
  complete: "good",
};

/** Roadmap order: earliest phase first. */
export const PROJECT_PHASE_ORDER: ProjectPhase[] = [
  "concept",
  "design",
  "approvals",
  "construction",
  "commissioning",
  "complete",
];

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  "new-build": "New build",
  expansion: "Expansion",
  renovation: "Renovation",
  infrastructure: "Infrastructure",
  equipment: "Equipment",
};

/* Virtual building planner labels */

export const roomCategoryLabels: Record<RoomCategory, string> = {
  inpatient: "Inpatient & acute care",
  "critical-care": "Critical care",
  "maternal-pediatric": "Maternal & pediatric",
  "surgical-procedural": "Surgical & procedural",
  "emergency-trauma": "Emergency & trauma",
  "diagnostic-imaging": "Diagnostic imaging",
  "laboratory-pathology": "Laboratory & pathology",
  pharmacy: "Pharmacy",
  "sterile-processing": "Sterile processing",
  "renal-infusion": "Renal & infusion",
  rehabilitation: "Rehabilitation",
  ambulatory: "Ambulatory & outpatient",
  "support-logistics": "Support & logistics",
  "administrative-staff": "Administrative & staff",
  "plant-engineering": "Plant & engineering",
  "guest-rooms": "Guest rooms",
  suites: "Suites & apartments",
  "front-office": "Front office & lobby",
  "food-beverage": "Food & beverage",
  kitchen: "Kitchen & servery",
  "meeting-events": "Meeting & events",
  "wellness-leisure": "Wellness & leisure",
  "housekeeping-laundry": "Housekeeping & laundry",
  "back-of-house": "Back of house",
  "guest-services": "Guest services",
  "health-safety": "Health & safety",
  "parking-transport": "Parking & transport",
  "outdoor-leisure": "Outdoor & leisure",
  "engineering-plant": "Engineering & plant",
};

export const assetCategoryLabels: Record<AssetCategory, string> = {
  device: "Devices",
  equipment: "Equipment",
  "medical-furniture": "Medical furniture",
  "non-medical-furniture": "Non-medical furniture",
  "guest-furniture": "Guest room furniture",
  "public-furniture": "Public & staff furniture",
  machine: "Machines",
};

export const assetCategoryDescriptions: Record<AssetCategory, string> = {
  device: "Point-of-care, monitoring and handheld diagnostic devices.",
  equipment: "Major clinical, imaging, surgical, therapeutic and lab systems.",
  "medical-furniture": "Beds, stretchers, treatment chairs, carts and clinical storage.",
  "non-medical-furniture": "Office, waiting, meeting and staff furniture.",
  "guest-furniture": "Beds, casegoods, seating, softgoods and in-room fit-out.",
  "public-furniture": "Lobby, restaurant, meeting, office and outdoor furniture.",
  machine: "Plant, HVAC, electrical, IT, laundry and back-of-house machinery.",
};

export const plannerVerticalLabels: Record<PlannerVertical, string> = {
  healthcare: "Hospital planner",
  hospitality: "Hotel planner",
};

export const assetInstallationLabels: Record<AssetInstallation, string> = {
  mobile: "Mobile",
  fixed: "Fixed",
  "wall-mounted": "Wall mounted",
  "ceiling-mounted": "Ceiling mounted",
};

export const medicalUtilityLabels: Record<MedicalUtility, string> = {
  oxygen: "Oxygen",
  "medical-air": "Medical air",
  vacuum: "Vacuum",
  "nitrous-oxide": "Nitrous oxide",
  nitrogen: "Nitrogen",
  "emergency-power": "Emergency power",
  "isolated-power": "Isolated power",
  data: "Data",
  water: "Water",
  drain: "Drain",
  steam: "Steam",
  "natural-gas": "Natural gas",
  "compressed-air": "Compressed air",
  cooling: "Cooling",
  "negative-pressure": "Negative pressure",
  "hepa-filtration": "HEPA filtration",
  "radiation-shielding": "Radiation shielding",
  "rf-shielding": "RF shielding",
  exhaust: "Exhaust",
};
