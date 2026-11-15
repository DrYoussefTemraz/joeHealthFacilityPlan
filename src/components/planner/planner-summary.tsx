import { Badge } from "@/components/badge";
import {
  assetCategoryLabels,
  medicalUtilityLabels,
} from "@/components/labels";
import { formatArea, formatCurrency } from "@/lib/format";
import type { BuildingSummary } from "@/lib/planner";

type PlannerSummaryProps = {
  summary: BuildingSummary;
};

export function PlannerSummary({ summary }: PlannerSummaryProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Building summary</h2>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Floors</dt>
            <dd className="mt-0.5 text-lg font-semibold">
              {summary.floorCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Rooms</dt>
            <dd className="mt-0.5 text-lg font-semibold">
              {summary.roomCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Beds</dt>
            <dd className="mt-0.5 text-lg font-semibold">
              {summary.patientBeds}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Floor area</dt>
            <dd className="mt-0.5 text-lg font-semibold">
              {formatArea(summary.areaSqm)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 rounded-xl bg-brand-soft p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Estimated asset cost
          </p>
          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(summary.assetCostCents)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.assetQuantity}{" "}
            {summary.assetQuantity === 1 ? "item" : "items"} across all rooms
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">By category</h2>
        <ul className="mt-3 space-y-2.5 text-xs">
          {summary.categories.map((category) => (
            <li
              key={category.category}
              className="flex items-baseline justify-between gap-3"
            >
              <span className="text-muted-foreground">
                {assetCategoryLabels[category.category]}{" "}
                <span className="font-medium text-foreground">
                  ({category.quantity})
                </span>
              </span>
              <span className="shrink-0 font-medium">
                {formatCurrency(category.costCents)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold">Utility requirements</h2>
        {summary.utilities.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Add rooms or items to see the building services this plan needs.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {summary.utilities.map((utility) => (
              <Badge key={utility} variant="neutral">
                {medicalUtilityLabels[utility]}
              </Badge>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
