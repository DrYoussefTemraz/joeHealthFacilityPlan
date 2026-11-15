import Link from "next/link";

import { plannerVerticals } from "@/lib/planner-verticals";
import type { PlannerVertical } from "@/lib/types";

const PLANNER_ORDER: PlannerVertical[] = ["healthcare", "hospitality"];

type PlannerSwitcherProps = {
  current: PlannerVertical;
};

/** Tabs that jump between the hospital and hotel planners. */
export function PlannerSwitcher({ current }: PlannerSwitcherProps) {
  return (
    <nav
      aria-label="Planner type"
      className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-card p-1 text-sm font-medium"
    >
      {PLANNER_ORDER.map((vertical) => {
        const option = plannerVerticals[vertical];
        const active = vertical === current;

        return (
          <Link
            key={vertical}
            href={option.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-full bg-brand px-4 py-1.5 text-brand-foreground"
                : "rounded-full px-4 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            }
          >
            {option.label}
          </Link>
        );
      })}
    </nav>
  );
}
