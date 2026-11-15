import type { PlannerVertical } from "./types";

export interface PlannerStep {
  title: string;
  description: string;
}

export interface PlannerVerticalContent {
  vertical: PlannerVertical;
  href: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: PlannerStep[];
  defaultBuildingName: string;
  storageKey: string;
  disclaimer: string;
}

/**
 * Page copy and client-state keys for each planner vertical. Keeping these in
 * one place stops the hospital and hotel planners from sharing a saved building
 * in localStorage or drifting apart in wording.
 */
export const plannerVerticals: Record<
  PlannerVertical,
  PlannerVerticalContent
> = {
  healthcare: {
    vertical: "healthcare",
    href: "/planner",
    label: "Hospital planner",
    eyebrow: "Interactive planning tool",
    title: "Build a virtual hospital",
    description:
      "Add rooms floor by floor, then equip each one with the devices, equipment, medical furniture, non-medical furniture and machines it needs. The building, totals and bill of materials update as you go.",
    steps: [
      {
        title: "Add rooms",
        description:
          "Pick a hospital room type from the dropdown on any floor, from ICU bays and operating rooms to labs, pharmacies and plant rooms.",
      },
      {
        title: "Equip every room",
        description:
          "Choose from five item groups — devices, equipment, medical furniture, non-medical furniture and machines — filtered to what fits that room.",
      },
      {
        title: "Review the plan",
        description:
          "See patient beds, floor area, utility requirements, estimated asset cost and an aggregated bill of materials as the building grows.",
      },
    ],
    defaultBuildingName: "New virtual hospital",
    storageKey: "joehealthplan.virtual-building.v1",
    disclaimer:
      "Illustrative catalog with preliminary cost estimates — not for procurement or clinical guidance.",
  },
  hospitality: {
    vertical: "hospitality",
    href: "/planner/hotels",
    label: "Hotel planner",
    eyebrow: "Interactive planning tool",
    title: "Build a virtual hotel",
    description:
      "Add guest rooms and back-of-house spaces floor by floor, then equip each one with the devices, equipment, guest furniture, public furniture and machines it needs. The property, totals and bill of materials update as you go.",
    steps: [
      {
        title: "Add rooms",
        description:
          "Pick a hotel space from the dropdown on any floor, from guest rooms and suites to kitchens, meeting rooms, laundry and plant rooms.",
      },
      {
        title: "Equip every room",
        description:
          "Choose from five item groups — devices, equipment, guest furniture, public furniture and machines — filtered to what fits that space.",
      },
      {
        title: "Review the plan",
        description:
          "See beds, floor area, utility requirements, estimated FF&E cost and an aggregated bill of materials as the property grows.",
      },
    ],
    defaultBuildingName: "New virtual hotel",
    storageKey: "joehealthplan.virtual-hotel.v1",
    disclaimer:
      "Illustrative catalog with preliminary cost estimates — not for procurement or design guidance.",
  },
};
