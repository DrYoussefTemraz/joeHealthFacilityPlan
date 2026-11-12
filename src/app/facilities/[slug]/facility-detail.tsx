import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
import { CapitalProjectRow } from "@/components/capital-project-row";
import { Icon } from "@/components/icons";
import {
  facilityStatusLabels,
  facilityStatusVariants,
  facilityTypeLabels,
  zoneConditionLabels,
  zoneConditionVariants,
} from "@/components/labels";
import { Stat } from "@/components/stat";
import { getFacilityBySlug } from "@/lib/data";
import { formatArea, formatCurrency, formatPercent } from "@/lib/format";

/**
 * Everything on the facility plan depends on the slug, so this component owns
 * the `params` read. The page renders it inside `<Suspense>`, which keeps the
 * shared App Shell URL-independent and lets a navigation paint immediately
 * while the plan streams in.
 *
 * Data still comes from the seam in `src/lib/data.ts`: swapping the fixtures
 * for a real backend only changes that module, not this component.
 */
export async function FacilityDetail({
  params,
}: Pick<PageProps<"/facilities/[slug]">, "params">) {
  const { slug } = await params;
  const facility = await getFacilityBySlug(slug);

  if (!facility) {
    notFound();
  }

  const activeProjects = facility.projects.filter(
    (project) => project.phase !== "complete",
  );
  const committedCents = activeProjects.reduce(
    (total, project) => total + project.budgetCents,
    0,
  );
  const plannedZoneArea = facility.zones.reduce(
    (total, zone) => total + zone.areaSqm,
    0,
  );

  return (
    <>
      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{facilityTypeLabels[facility.type]}</Badge>
          <Badge variant={facilityStatusVariants[facility.status]}>
            {facilityStatusLabels[facility.status]}
          </Badge>
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {facility.name}
        </h1>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icon name="pin" className="size-4" />
          {facility.city}, {facility.region} &middot; opened {facility.openedYear}
        </p>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
          {facility.summary}
        </p>
      </header>

      <dl className="mt-10 grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon="bed"
          label="Licensed beds"
          value={
            facility.licensedBeds === null
              ? "—"
              : facility.licensedBeds.toLocaleString("en-US")
          }
          hint={facility.licensedBeds === null ? "Outpatient site" : undefined}
        />
        <Stat
          icon="building"
          label="Gross floor area"
          value={formatArea(facility.grossFloorAreaSqm)}
        />
        <Stat
          icon="gauge"
          label="Occupancy"
          value={formatPercent(facility.occupancyPct)}
        />
        <Stat
          icon="blueprint"
          label="Planned zone area"
          value={formatArea(plannedZoneArea)}
          hint={`Across ${facility.zones.length} zones`}
        />
      </dl>

      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Capital program
          </h2>
          <p className="text-sm text-muted-foreground">
            {activeProjects.length} active{" "}
            {activeProjects.length === 1 ? "project" : "projects"} &middot;{" "}
            {formatCurrency(committedCents)} committed
          </p>
        </div>

        <ul className="mt-6 space-y-4">
          {facility.projects.map((project) => (
            <CapitalProjectRow key={project.id} project={project} />
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">
          Functional zones
        </h2>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">
              Zones at {facility.name} with area, utilization and condition
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Zone
                </th>
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Function
                </th>
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Area
                </th>
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Utilization
                </th>
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Condition
                </th>
              </tr>
            </thead>
            <tbody>
              {facility.zones.map((zone) => (
                <tr
                  key={zone.id}
                  className="border-b border-border last:border-0"
                >
                  <th scope="row" className="p-4 text-left font-medium">
                    {zone.name}
                  </th>
                  <td className="p-4 text-muted-foreground">{zone.function}</td>
                  <td className="p-4">{formatArea(zone.areaSqm)}</td>
                  <td className="p-4">{formatPercent(zone.utilizationPct)}</td>
                  <td className="p-4">
                    <Badge variant={zoneConditionVariants[zone.condition]}>
                      {zoneConditionLabels[zone.condition]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">Service lines</h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {facility.serviceLines.map((serviceLine) => (
            <li key={serviceLine}>
              <Badge variant="neutral">{serviceLine}</Badge>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-10">
        <div className="max-w-xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Questions about this facility plan?
          </h2>
          <p className="mt-3 text-muted-foreground">
            The planning office can walk through the phasing, the budget
            assumptions or the approvals path for {facility.name}.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Talk to the planning office
          <Icon name="arrow-right" className="size-4" />
        </Link>
      </section>
    </>
  );
}
