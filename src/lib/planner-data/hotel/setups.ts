import type { RecommendedAsset } from "@/lib/types";

import { q } from "../setups";

/**
 * Reusable recommended setups for hotel rooms. They describe a plausible
 * opening-day FF&E and equipment package, not a brand standard or a
 * procurement schedule.
 */

/**
 * Combines setups while summing quantities for assets that appear more than
 * once. Suite setups build on the base guest-room package, and the database
 * stores one recommended line per room and asset.
 */
function mergeSetups(...setups: RecommendedAsset[][]): RecommendedAsset[] {
  const merged = new Map<string, RecommendedAsset>();

  for (const setup of setups) {
    for (const item of setup) {
      const existing = merged.get(item.assetId);
      merged.set(
        item.assetId,
        existing
          ? { assetId: item.assetId, quantity: existing.quantity + item.quantity }
          : { assetId: item.assetId, quantity: item.quantity },
      );
    }
  }

  return Array.from(merged.values());
}

/** In-room items shared by every guest room, excluding the bed system. */
const guestRoomCore: RecommendedAsset[] = [
  q("hotel-headboard"),
  q("hotel-nightstand", 2),
  q("hotel-writing-desk"),
  q("hotel-desk-chair"),
  q("hotel-wardrobe"),
  q("hotel-media-console"),
  q("hotel-minibar-cabinet"),
  q("hotel-luggage-bench"),
  q("hotel-luggage-rack"),
  q("hotel-lounge-chair"),
  q("hotel-coffee-table"),
  q("hotel-floor-lamp"),
  q("hotel-table-lamp", 2),
  q("hotel-full-length-mirror"),
  q("hotel-blackout-curtain"),
  q("hotel-sheer-curtain"),
  q("hotel-wall-art"),
  q("hotel-guest-smart-tv"),
  q("hotel-guest-tablet"),
  q("hotel-smart-thermostat"),
  q("hotel-smart-door-lock"),
  q("hotel-in-room-safe"),
  q("hotel-minibar-sensor"),
  q("hotel-bedside-charging-hub", 2),
  q("hotel-ip-desk-phone"),
  q("hotel-occupancy-sensor"),
  q("hotel-minibar-fridge"),
  q("hotel-guest-coffee-machine"),
  q("hotel-kettle"),
  q("hotel-hairdryer"),
  q("hotel-ironing-board"),
  q("hotel-towel-set"),
  q("hotel-bath-amenity-set"),
  q("hotel-hanger-set"),
  q("hotel-waste-bin"),
];

export const kingRoomSetup: RecommendedAsset[] = [
  ...guestRoomCore,
  q("hotel-king-bed-platform"),
  q("hotel-king-mattress"),
  q("hotel-king-linen-set"),
];

export const queenRoomSetup: RecommendedAsset[] = [
  ...guestRoomCore,
  q("hotel-queen-bed-platform"),
  q("hotel-queen-mattress"),
  q("hotel-queen-linen-set"),
];

export const doubleQueenSetup: RecommendedAsset[] = [
  ...guestRoomCore,
  q("hotel-queen-bed-platform", 2),
  q("hotel-queen-mattress", 2),
  q("hotel-queen-linen-set", 2),
];

export const twinRoomSetup: RecommendedAsset[] = [
  ...guestRoomCore,
  q("hotel-twin-bed-platform", 2),
  q("hotel-twin-mattress", 2),
  q("hotel-twin-linen-set", 2),
];

export const accessibleKingSetup: RecommendedAsset[] = mergeSetups(kingRoomSetup, [
  q("hotel-accessible-bathroom-kit"),
]);

export const familyRoomSetup: RecommendedAsset[] = mergeSetups(
  doubleQueenSetup,
  [q("hotel-sofa-bed"), q("hotel-crib"), q("hotel-rollaway-bed")],
);

export const studioSetup: RecommendedAsset[] = mergeSetups(kingRoomSetup, [
  q("hotel-kitchenette-unit"),
  q("hotel-cookware-set"),
]);

export const juniorSuiteSetup: RecommendedAsset[] = mergeSetups(kingRoomSetup, [
  q("hotel-sofa-bed"),
  q("hotel-dining-table"),
  q("hotel-lounge-chair", 2),
]);

export const executiveSuiteSetup: RecommendedAsset[] = mergeSetups(
  juniorSuiteSetup,
  [
    q("hotel-kitchenette-unit"),
    q("hotel-cookware-set"),
    q("hotel-lounge-chair", 2),
  ],
);

export const presidentialSuiteSetup: RecommendedAsset[] = mergeSetups(
  executiveSuiteSetup,
  [
    q("hotel-sofa-bed"),
    q("hotel-dining-table", 2),
    q("hotel-lounge-chair", 2),
    q("hotel-rollaway-bed"),
  ],
);

export const familySuiteSetup: RecommendedAsset[] = mergeSetups(
  doubleQueenSetup,
  [q("hotel-sofa-bed"), q("hotel-crib")],
);

export const apartmentSetup: RecommendedAsset[] = mergeSetups(studioSetup, [
  q("hotel-dining-table"),
  q("hotel-lounge-chair", 2),
]);

/* Front office and lobby */

export const lobbySetup: RecommendedAsset[] = [
  q("hotel-reception-desk"),
  q("hotel-concierge-desk"),
  q("hotel-bell-stand"),
  q("hotel-valet-desk"),
  q("hotel-lobby-sofa", 3),
  q("hotel-lobby-armchair", 6),
  q("hotel-lobby-coffee-table", 3),
  q("hotel-digital-signage", 2),
  q("hotel-cctv-camera", 2),
  q("hotel-wifi-access-point", 2),
  q("hotel-wall-art", 4),
  q("hotel-two-way-radio", 2),
  q("hotel-waste-bin", 2),
];

export const receptionSetup: RecommendedAsset[] = [
  q("hotel-reception-desk"),
  q("hotel-pms-workstation", 2),
  q("hotel-pms-licence"),
  q("hotel-pms-server"),
  q("hotel-key-card-encoder"),
  q("hotel-self-checkin-kiosk", 2),
  q("hotel-safe-deposit-boxes"),
  q("hotel-office-chair", 3),
  q("hotel-digital-signage"),
  q("hotel-cctv-camera"),
  q("hotel-ip-desk-phone", 2),
  q("hotel-waste-bin"),
];

export const conciergeSetup: RecommendedAsset[] = [
  q("hotel-concierge-desk"),
  q("hotel-office-chair"),
  q("hotel-ip-desk-phone"),
  q("hotel-digital-signage"),
  q("hotel-luggage-rack", 2),
  q("hotel-waste-bin"),
];

export const bellStandSetup: RecommendedAsset[] = [
  q("hotel-bell-stand"),
  q("hotel-bell-cart", 2),
  q("hotel-two-way-radio", 2),
  q("hotel-waste-bin"),
];

export const luggageStorageSetup: RecommendedAsset[] = [
  q("hotel-luggage-rack", 6),
  q("hotel-cctv-camera"),
  q("hotel-access-control-reader"),
  q("hotel-waste-bin"),
];

export const lobbyLoungeSetup: RecommendedAsset[] = [
  q("hotel-lobby-sofa", 4),
  q("hotel-lobby-armchair", 8),
  q("hotel-lobby-coffee-table", 4),
  q("hotel-digital-signage"),
  q("hotel-wall-art", 6),
  q("hotel-waste-bin", 3),
];

export const executiveLoungeSetup: RecommendedAsset[] = [
  q("hotel-lobby-sofa", 2),
  q("hotel-lobby-armchair", 4),
  q("hotel-lobby-coffee-table", 2),
  q("hotel-meeting-table"),
  q("hotel-office-chair", 4),
  q("hotel-digital-signage"),
  q("hotel-wall-art", 4),
  q("hotel-waste-bin", 2),
];

/* Food and beverage */

export const restaurantSetup: RecommendedAsset[] = [
  q("hotel-restaurant-table", 12),
  q("hotel-restaurant-chair", 48),
  q("hotel-booth-seating", 2),
  q("hotel-undercounter-fridge", 2),
  q("hotel-hot-holding-cabinet", 2),
  q("hotel-pos-terminal", 2),
  q("hotel-digital-signage"),
  q("hotel-wall-art", 4),
  q("hotel-waste-bin", 4),
];

export const barSetup: RecommendedAsset[] = [
  q("hotel-bar-counter"),
  q("hotel-bar-stool", 12),
  q("hotel-glasswasher"),
  q("hotel-bar-dispense-system"),
  q("hotel-ice-machine"),
  q("hotel-undercounter-fridge", 2),
  q("hotel-pos-terminal", 2),
  q("hotel-digital-signage"),
  q("hotel-waste-bin", 3),
];

export const cafeSetup: RecommendedAsset[] = [
  q("hotel-restaurant-table", 8),
  q("hotel-restaurant-chair", 24),
  q("hotel-undercounter-fridge"),
  q("hotel-commercial-espresso-machine"),
  q("hotel-display-case"),
  q("hotel-pos-terminal"),
  q("hotel-digital-signage"),
  q("hotel-waste-bin", 2),
];

export const roomServiceSetup: RecommendedAsset[] = [
  q("hotel-room-service-cart", 2),
  q("hotel-hot-holding-cabinet", 2),
  q("hotel-undercounter-fridge"),
  q("hotel-ip-desk-phone"),
  q("hotel-pos-terminal"),
  q("hotel-waste-bin"),
];

/* Kitchen and servery */

export const mainKitchenSetup: RecommendedAsset[] = [
  q("hotel-combi-oven", 2),
  q("hotel-range-six-burner"),
  q("hotel-convection-oven"),
  q("hotel-deep-fryer", 2),
  q("hotel-walk-in-cold-room"),
  q("hotel-walk-in-freezer"),
  q("hotel-blast-chiller"),
  q("hotel-undercounter-fridge", 3),
  q("hotel-pass-through-dishwasher"),
  q("hotel-exhaust-hood", 2),
  q("hotel-planetary-mixer"),
  q("hotel-slicer"),
  q("hotel-food-processor"),
  q("hotel-stainless-worktable", 4),
  q("hotel-kitchen-shelving", 4),
  q("hotel-preparation-sink", 2),
  q("hotel-grease-trap"),
  q("hotel-kitchen-extract-fan"),
  q("hotel-cold-room-condensing-unit"),
  q("hotel-hot-holding-cabinet", 2),
  q("hotel-ice-machine"),
  q("hotel-waste-bin", 4),
];

export const pastryKitchenSetup: RecommendedAsset[] = [
  q("hotel-deck-oven"),
  q("hotel-planetary-mixer", 2),
  q("hotel-undercounter-fridge", 2),
  q("hotel-blast-chiller"),
  q("hotel-stainless-worktable", 2),
  q("hotel-kitchen-shelving", 2),
  q("hotel-preparation-sink"),
  q("hotel-food-processor"),
  q("hotel-waste-bin", 2),
];

export const coldKitchenSetup: RecommendedAsset[] = [
  q("hotel-undercounter-fridge", 3),
  q("hotel-stainless-worktable", 2),
  q("hotel-preparation-sink"),
  q("hotel-kitchen-shelving", 2),
  q("hotel-slicer"),
  q("hotel-food-processor"),
  q("hotel-waste-bin", 2),
];

export const dishwashSetup: RecommendedAsset[] = [
  q("hotel-pass-through-dishwasher"),
  q("hotel-glasswasher"),
  q("hotel-preparation-sink", 2),
  q("hotel-kitchen-shelving", 2),
  q("hotel-kitchen-extract-fan"),
  q("hotel-grease-trap"),
  q("hotel-waste-bin", 3),
];

export const serverySetup: RecommendedAsset[] = [
  q("hotel-hot-holding-cabinet", 3),
  q("hotel-display-case", 2),
  q("hotel-undercounter-fridge", 2),
  q("hotel-ice-machine"),
  q("hotel-kitchen-shelving"),
  q("hotel-waste-bin", 2),
];

/* Meeting and events */

export const ballroomSetup: RecommendedAsset[] = [
  q("hotel-banquet-round-table", 20),
  q("hotel-banquet-chair", 200),
  q("hotel-stage-lighting"),
  q("hotel-sound-system"),
  q("hotel-projector", 2),
  q("hotel-led-video-wall"),
  q("hotel-conference-mic"),
  q("hotel-av-control-system"),
  q("hotel-hot-holding-cabinet", 2),
  q("hotel-pos-terminal", 2),
  q("hotel-waste-bin", 6),
];

export const meetingRoomSetup: RecommendedAsset[] = [
  q("hotel-meeting-table", 4),
  q("hotel-office-chair", 12),
  q("hotel-projector"),
  q("hotel-sound-system"),
  q("hotel-conference-mic"),
  q("hotel-av-control-system"),
  q("hotel-digital-signage"),
  q("hotel-waste-bin", 2),
];

export const boardroomSetup: RecommendedAsset[] = [
  q("hotel-boardroom-table"),
  q("hotel-office-chair", 10),
  q("hotel-led-video-wall"),
  q("hotel-conference-mic"),
  q("hotel-av-control-system"),
  q("hotel-digital-signage"),
  q("hotel-waste-bin"),
];

export const preFunctionSetup: RecommendedAsset[] = [
  q("hotel-lobby-sofa", 4),
  q("hotel-lobby-armchair", 8),
  q("hotel-lobby-coffee-table", 4),
  q("hotel-digital-signage", 2),
  q("hotel-pos-terminal"),
  q("hotel-wall-art", 4),
  q("hotel-waste-bin", 3),
];

export const avControlSetup: RecommendedAsset[] = [
  q("hotel-av-control-system"),
  q("hotel-av-console"),
  q("hotel-av-rack"),
  q("hotel-monitor-wall"),
  q("hotel-digital-signage"),
  q("hotel-waste-bin"),
];

/* Wellness and leisure */

export const fitnessSetup: RecommendedAsset[] = [
  q("hotel-treadmill", 4),
  q("hotel-elliptical", 2),
  q("hotel-strength-trainer", 2),
  q("hotel-free-weight-rack", 2),
  q("hotel-gym-reception-desk"),
  q("hotel-pos-terminal"),
  q("hotel-digital-signage"),
  q("hotel-commercial-vacuum"),
  q("hotel-waste-bin", 2),
];

export const spaSetup: RecommendedAsset[] = [
  q("hotel-spa-treatment-table", 2),
  q("hotel-spa-reception-desk"),
  q("hotel-lobby-armchair", 2),
  q("hotel-wall-art", 2),
  q("hotel-towel-set", 4),
  q("hotel-bath-amenity-set", 4),
  q("hotel-waste-bin"),
];

export const saunaSetup: RecommendedAsset[] = [
  q("hotel-sauna-heater"),
  q("hotel-steam-generator"),
  q("hotel-pool-lounger", 2),
  q("hotel-towel-set", 4),
  q("hotel-waste-bin"),
];

export const poolSetup: RecommendedAsset[] = [
  q("hotel-pool-filtration"),
  q("hotel-pool-heat-pump"),
  q("hotel-pool-circulation-pump"),
  q("hotel-pool-safety-alarm"),
  q("hotel-pool-lounger", 8),
  q("hotel-towel-set", 8),
  q("hotel-waste-bin", 2),
];

export const kidsClubSetup: RecommendedAsset[] = [
  q("hotel-kids-play-unit"),
  q("hotel-lobby-armchair", 4),
  q("hotel-lobby-coffee-table"),
  q("hotel-digital-signage"),
  q("hotel-waste-bin"),
];

/* Housekeeping and laundry */

export const housekeepingOfficeSetup: RecommendedAsset[] = [
  q("hotel-office-desk", 2),
  q("hotel-office-chair", 2),
  q("hotel-filing-cabinet"),
  q("hotel-housekeeping-handheld", 2),
  q("hotel-housekeeping-cart", 2),
  q("hotel-two-way-radio", 2),
  q("hotel-waste-bin"),
];

export const linenRoomSetup: RecommendedAsset[] = [
  q("hotel-kitchen-shelving", 6),
  q("hotel-laundry-cart", 2),
  q("hotel-king-linen-set", 10),
  q("hotel-queen-linen-set", 10),
  q("hotel-twin-linen-set", 6),
  q("hotel-towel-set", 20),
  q("hotel-hanger-set", 4),
  q("hotel-waste-bin"),
];

export const onPremiseLaundrySetup: RecommendedAsset[] = [
  q("hotel-commercial-washer", 2),
  q("hotel-commercial-dryer", 3),
  q("hotel-flatwork-ironer"),
  q("hotel-linen-folding-machine"),
  q("hotel-laundry-boiler"),
  q("hotel-water-softener"),
  q("hotel-laundry-chemical-dosing"),
  q("hotel-laundry-cart", 3),
  q("hotel-kitchen-shelving", 4),
  q("hotel-waste-bin"),
];

export const uniformValetSetup: RecommendedAsset[] = [
  q("hotel-staff-locker", 4),
  q("hotel-kitchen-shelving", 3),
  q("hotel-laundry-cart"),
  q("hotel-ironing-board"),
  q("hotel-waste-bin"),
];

/* Back of house */

export const loadingDockSetup: RecommendedAsset[] = [
  q("hotel-dock-leveller"),
  q("hotel-waste-compactor"),
  q("hotel-cctv-camera"),
  q("hotel-access-control-reader"),
  q("hotel-two-way-radio", 2),
  q("hotel-kitchen-shelving", 4),
  q("hotel-pallet-truck"),
];

export const receivingStorageSetup: RecommendedAsset[] = [
  q("hotel-kitchen-shelving", 10),
  q("hotel-storage-cabinet", 4),
  q("hotel-pallet-truck", 2),
  q("hotel-waste-bin"),
];

export const wasteRoomSetup: RecommendedAsset[] = [
  q("hotel-waste-compactor"),
  q("hotel-recycling-bins", 2),
  q("hotel-commercial-vacuum"),
  q("hotel-waste-bin", 6),
];

export const staffEntranceSetup: RecommendedAsset[] = [
  q("hotel-access-control-reader"),
  q("hotel-time-clock"),
  q("hotel-staff-locker", 2),
  q("hotel-two-way-radio"),
  q("hotel-waste-bin"),
];

/* Administrative and staff */

export const officeSetup: RecommendedAsset[] = [
  q("hotel-office-desk", 6),
  q("hotel-office-chair", 6),
  q("hotel-filing-cabinet", 2),
  q("hotel-meeting-table"),
  q("hotel-ip-desk-phone", 6),
  q("hotel-server-rack"),
  q("hotel-ups-system"),
  q("hotel-waste-bin", 2),
];

export const breakroomSetup: RecommendedAsset[] = [
  q("hotel-breakroom-table", 3),
  q("hotel-breakroom-chair", 12),
  q("hotel-undercounter-fridge", 2),
  q("hotel-commercial-espresso-machine"),
  q("hotel-waste-bin", 2),
];

export const lockerRoomSetup: RecommendedAsset[] = [
  q("hotel-staff-locker", 20),
  q("hotel-changing-bench", 2),
  q("hotel-waste-bin", 2),
];

export const trainingRoomSetup: RecommendedAsset[] = [
  q("hotel-meeting-table", 6),
  q("hotel-office-chair", 20),
  q("hotel-projector"),
  q("hotel-sound-system"),
  q("hotel-digital-signage"),
  q("hotel-waste-bin"),
];

/* Guest services */

export const businessCentreSetup: RecommendedAsset[] = [
  q("hotel-office-desk", 4),
  q("hotel-office-chair", 4),
  q("hotel-meeting-table", 2),
  q("hotel-digital-signage"),
  q("hotel-waste-bin"),
];

export const giftShopSetup: RecommendedAsset[] = [
  q("hotel-retail-display", 4),
  q("hotel-pos-terminal"),
  q("hotel-cctv-camera"),
  q("hotel-digital-signage"),
  q("hotel-waste-bin"),
];

export const guestLaundrySetup: RecommendedAsset[] = [
  q("hotel-commercial-washer", 2),
  q("hotel-commercial-dryer", 2),
  q("hotel-ironing-board", 2),
  q("hotel-laundry-cart"),
  q("hotel-waste-bin"),
];

/* Health and safety */

export const firstAidSetup: RecommendedAsset[] = [
  q("hotel-first-aid-cot"),
  q("hotel-first-aid-cabinet"),
  q("hotel-defibrillator"),
  q("hotel-waste-bin"),
];

export const securityOfficeSetup: RecommendedAsset[] = [
  q("hotel-office-desk"),
  q("hotel-office-chair"),
  q("hotel-cctv-nvr"),
  q("hotel-cctv-camera", 4),
  q("hotel-monitor-wall"),
  q("hotel-two-way-radio", 4),
  q("hotel-waste-bin"),
];

export const fireControlSetup: RecommendedAsset[] = [
  q("hotel-fire-alarm-panel"),
  q("hotel-monitor-wall"),
  q("hotel-office-desk"),
  q("hotel-office-chair"),
  q("hotel-two-way-radio"),
  q("hotel-waste-bin"),
];

/* Parking and transport */

export const parkingSetup: RecommendedAsset[] = [
  q("hotel-parking-barrier"),
  q("hotel-parking-ticket-kiosk"),
  q("hotel-cctv-camera", 2),
  q("hotel-waste-bin"),
];

export const evChargingSetup: RecommendedAsset[] = [
  q("hotel-ev-charger", 2),
  q("hotel-cctv-camera"),
  q("hotel-parking-barrier"),
  q("hotel-waste-bin"),
];

export const valetSetup: RecommendedAsset[] = [
  q("hotel-valet-desk"),
  q("hotel-office-chair"),
  q("hotel-two-way-radio", 2),
  q("hotel-cctv-camera"),
  q("hotel-waste-bin"),
];

/* Outdoor */

export const poolDeckSetup: RecommendedAsset[] = [
  q("hotel-pool-lounger", 20),
  q("hotel-patio-umbrella", 10),
  q("hotel-outdoor-lounge-set", 4),
  q("hotel-waste-bin", 6),
];

export const terraceSetup: RecommendedAsset[] = [
  q("hotel-outdoor-lounge-set", 6),
  q("hotel-patio-umbrella", 4),
  q("hotel-waste-bin", 3),
];

export const outdoorBarSetup: RecommendedAsset[] = [
  q("hotel-bar-counter"),
  q("hotel-bar-stool", 12),
  q("hotel-outdoor-lounge-set", 2),
  q("hotel-ice-machine"),
  q("hotel-undercounter-fridge", 2),
  q("hotel-pos-terminal"),
  q("hotel-waste-bin", 3),
];

/* Engineering and plant */

export const plantRoomSetup: RecommendedAsset[] = [
  q("hotel-chiller", 2),
  q("hotel-boiler"),
  q("hotel-air-handling-unit", 2),
  q("hotel-water-pump-set"),
  q("hotel-water-softener"),
  q("hotel-bms"),
  q("hotel-core-switch"),
  q("hotel-ups-system"),
];

export const electricalRoomSetup: RecommendedAsset[] = [
  q("hotel-switchgear"),
  q("hotel-diesel-generator"),
  q("hotel-ups-system"),
  q("hotel-bms"),
  q("hotel-core-switch"),
];

export const hvacPlantSetup: RecommendedAsset[] = [
  q("hotel-chiller"),
  q("hotel-air-handling-unit", 4),
  q("hotel-boiler"),
  q("hotel-bms"),
];

export const waterTreatmentSetup: RecommendedAsset[] = [
  q("hotel-water-softener"),
  q("hotel-water-pump-set"),
  q("hotel-building-water-tank"),
  q("hotel-solar-hot-water"),
];

export const generatorRoomSetup: RecommendedAsset[] = [
  q("hotel-diesel-generator", 2),
  q("hotel-ups-system"),
  q("hotel-switchgear"),
  q("hotel-fire-pump"),
];
