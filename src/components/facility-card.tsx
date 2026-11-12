import Link from "next/link";

import { formatArea, formatCurrency, formatPercent } from "@/lib/format";
import type { Facility } from "@/lib/types";

import { Badge } from "./badge";
import { Icon } from "./icons";
import {
  facilityStatusLabels,
  facilityStatusVariants,
  facilityTypeLabels,
} from "./labels";

export function FacilityCard({ facility }: { facility: Facility }) {
  const activeProjects = facility.projects.filter(
    (project) => project.phase !== "complete",
  );
  const committedCents = activeProjects.reduce(
    (total, project) => total + project.budgetCents,
    0,
  );

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{facility.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icon name="pin" className="size-3.5" />
            {facility.city}, {facility.region}
          </p>
        </div>
        <Badge variant={facilityStatusVariants[facility.status]}>
          {facilityStatusLabels[facility.status]}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {facility.summary}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-border py-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Type</dt>
          <dd className="mt-0.5 font-medium">
            {facilityTypeLabels[facility.type]}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Licensed beds</dt>
          <dd className="mt-0.5 font-medium">
            {facility.licensedBeds ?? "Outpatient"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Gross floor area</dt>
          <dd className="mt-0.5 font-medium">
            {formatArea(facility.grossFloorAreaSqm)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Occupancy</dt>
          <dd className="mt-0.5 font-medium">
            {formatPercent(facility.occupancyPct)}
          </dd>
        </div>
      </dl>

      <p className="mt-5 text-sm text-muted-foreground">
        {activeProjects.length} active{" "}
        {activeProjects.length === 1 ? "project" : "projects"} &middot;{" "}
        {formatCurrency(committedCents)} committed
      </p>

      <div className="mt-auto pt-6">
        <Link
          href={`/facilities/${facility.slug}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          View facility plan
          <Icon name="arrow-right" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
