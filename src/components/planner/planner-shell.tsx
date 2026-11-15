import { plannerVerticals } from "@/lib/planner-verticals";
import type { PlannerCatalog, PlannerVertical } from "@/lib/types";

import { BuildingPlanner } from "./building-planner";
import { PlannerSwitcher } from "./planner-switcher";

type PlannerShellProps = {
  vertical: PlannerVertical;
  catalog: PlannerCatalog;
};

/**
 * Shared page frame for the hospital and hotel planners: intro copy, the
 * three-step explainer, the vertical switcher and the interactive planner.
 */
export function PlannerShell({ vertical, catalog }: PlannerShellProps) {
  const content = plannerVerticals[vertical];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <header className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {content.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            {content.description}
          </p>
        </header>

        <PlannerSwitcher current={vertical} />
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        {content.steps.map((step, index) => (
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

      <BuildingPlanner
        catalog={catalog}
        storageKey={content.storageKey}
        defaultBuildingName={content.defaultBuildingName}
        disclaimer={content.disclaimer}
      />
    </div>
  );
}
