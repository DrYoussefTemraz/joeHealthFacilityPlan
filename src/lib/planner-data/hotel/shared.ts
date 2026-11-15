import type {
  AssetCategory,
  AssetInstallation,
  AssetTemplate,
  MedicalUtility,
  RoomCategory,
} from "@/lib/types";

/** Universal item, such as a waste bin or a Wi-Fi access point. */
export const ALL = "all" as const;

/* Room-category groups reused across the hotel asset files. */
export const GUEST_ROOMS: RoomCategory[] = ["guest-rooms", "suites"];
export const FRONT_OF_HOUSE: RoomCategory[] = [
  "front-office",
  "food-beverage",
  "meeting-events",
  "wellness-leisure",
  "guest-services",
  "outdoor-leisure",
];
export const STAFF_AREAS: RoomCategory[] = [
  "administrative-staff",
  "back-of-house",
  "housekeeping-laundry",
];
export const KITCHEN: RoomCategory[] = ["kitchen"];
export const MEETING: RoomCategory[] = ["meeting-events"];
export const WELLNESS: RoomCategory[] = ["wellness-leisure"];
export const LAUNDRY: RoomCategory[] = ["housekeeping-laundry"];
export const BACK_OF_HOUSE: RoomCategory[] = ["back-of-house"];
export const ENGINEERING: RoomCategory[] = ["engineering-plant"];
export const HEALTH_SAFETY: RoomCategory[] = ["health-safety"];
export const PARKING: RoomCategory[] = ["parking-transport"];
export const OUTDOOR: RoomCategory[] = ["outdoor-leisure"];
export const ADMIN: RoomCategory[] = ["administrative-staff"];
export const FRONT_OFFICE: RoomCategory[] = ["front-office"];

/**
 * Compact asset factory for the hotel catalogue. The position-by-position
 * signature keeps the data files readable; every field still ends up on a
 * plain, serialisable `AssetTemplate`.
 */
export function a(
  id: string,
  name: string,
  category: AssetCategory,
  unitCostCents: number,
  description: string,
  roomCategories: RoomCategory[] | "all",
  utilities: MedicalUtility[] = [],
  installation: AssetInstallation = "mobile",
): AssetTemplate {
  return {
    id,
    name,
    category,
    description,
    unitCostCents,
    utilities,
    roomCategories,
    installation,
  };
}
