import type { Metadata } from "next";

import { BuildingPlanner } from "@/components/planner/building-planner";
import { getPlannerCatalog } from "@/lib/data";

export const metadata: Metadata = {
  title: "Building planner",
  description:
    "Build a virtual hospital floor by floor and choose the devices, equipment, medical furniture, non-medical furniture and machines for every room.",
};

const steps = [
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
];

export default async function PlannerPage() {
  const catalog = await getPlannerCatalog();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Interactive planning tool
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Build a virtual hospital
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Add rooms floor by floor, then equip each one with the devices,
          equipment, medical furniture, non-medical furniture and machines it
          needs. The building, totals and bill of materials update as you go.
        </p>
      </header>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <dt className="flex items-center gap-2 text-sm font-semibold">
              <span
                aria-hidden="true"
                className="grid size-6 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand"
              >
                {index + 1}
              </span>
              {step.title}
            </dt>
            <dd className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.description}
            </dd>
          </div>
        ))}
      </dl>

      <BuildingPlanner catalog={catalog} />
    </div>
  );
}
