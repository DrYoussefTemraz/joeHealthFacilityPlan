import Link from "next/link";

import { Badge } from "@/components/badge";
import { FacilityCard } from "@/components/facility-card";
import { FeatureCard } from "@/components/feature-card";
import { Icon } from "@/components/icons";
import {
  PROJECT_PHASE_ORDER,
  projectPhaseLabels,
  projectPhaseVariants,
} from "@/components/labels";
import { Stat } from "@/components/stat";
import {
  getCapitalProjects,
  getFacilities,
  getPlanningCapabilities,
} from "@/lib/data";
import { formatArea, formatCurrency } from "@/lib/format";

export default async function HomePage() {
  const [facilities, projects, capabilities] = await Promise.all([
    getFacilities(),
    getCapitalProjects(),
    getPlanningCapabilities(),
  ]);

  const facilityNames = new Map(
    facilities.map((facility) => [facility.slug, facility.name]),
  );
  const totalBeds = facilities.reduce(
    (total, facility) => total + (facility.licensedBeds ?? 0),
    0,
  );
  const totalFloorArea = facilities.reduce(
    (total, facility) => total + facility.grossFloorAreaSqm,
    0,
  );
  const activeProjects = projects.filter(
    (project) => project.phase !== "complete",
  );
  const committedCents = activeProjects.reduce(
    (total, project) => total + project.budgetCents,
    0,
  );

  return (
    <>
      <section className="border-b border-border bg-brand-soft">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <Icon name="calendar" className="size-3.5 text-brand" />
            2026&ndash;2031 capital program
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Master planning for healthcare facilities, from concept to
            commissioning.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            One view of site capacity, functional zones and every capital
            project in the portfolio, so the next decision is made on numbers
            rather than on the loudest voice in the room.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/facilities"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Explore facilities
              <Icon name="arrow-right" className="size-4" />
            </Link>
            <Link
              href="/#roadmap"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted"
            >
              See the roadmap
            </Link>
          </div>

          <dl className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon="building"
              label="Facilities in portfolio"
              value={String(facilities.length)}
            />
            <Stat
              icon="bed"
              label="Licensed inpatient beds"
              value={totalBeds.toLocaleString("en-US")}
            />
            <Stat
              icon="grid"
              label="Gross floor area"
              value={formatArea(totalFloorArea)}
            />
            <Stat
              icon="budget"
              label="Capital committed"
              value={formatCurrency(committedCents)}
              hint={`${activeProjects.length} active projects`}
            />
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            What the plan covers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Six things every facility plan answers before capital is released.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability) => (
            <FeatureCard
              key={capability.slug}
              icon={capability.icon}
              title={capability.title}
              summary={capability.summary}
            />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Facilities in the portfolio
              </h2>
              <p className="mt-3 text-muted-foreground">
                Acute, surgical, outpatient and diagnostic sites on one planning
                horizon.
              </p>
            </div>
            <Link
              href="/facilities"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-opacity hover:opacity-80"
            >
              Compare all facilities
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {facilities.map((facility) => (
              <FacilityCard key={facility.slug} facility={facility} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="roadmap"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-16 sm:py-20"
      >
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Capital roadmap
          </h2>
          <p className="mt-3 text-muted-foreground">
            All {projects.length} projects across the portfolio, grouped by the
            phase they sit in today.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECT_PHASE_ORDER.map((phase) => {
            const phaseProjects = projects.filter(
              (project) => project.phase === phase,
            );

            if (phaseProjects.length === 0) {
              return null;
            }

            const phaseBudgetCents = phaseProjects.reduce(
              (total, project) => total + project.budgetCents,
              0,
            );

            return (
              <article
                key={phase}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={projectPhaseVariants[phase]}>
                    {projectPhaseLabels[phase]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {phaseProjects.length}{" "}
                    {phaseProjects.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                <p className="mt-4 text-lg font-semibold tracking-tight">
                  {formatCurrency(phaseBudgetCents)}
                </p>

                <ul className="mt-4 space-y-3 text-sm">
                  {phaseProjects.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/facilities/${project.facilitySlug}`}
                        className="font-medium transition-colors hover:text-brand"
                      >
                        {project.name}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {facilityNames.get(project.facilitySlug)} &middot; target{" "}
                        {project.targetYear}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-4">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              Planning a new site or a major expansion?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Send us the site, the constraint you are hitting and your
              timeline, and the planning office will come back with an initial
              view.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Request a review
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
