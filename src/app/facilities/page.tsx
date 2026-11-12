import type { Metadata } from "next";

import { FacilityCard } from "@/components/facility-card";
import {
  facilityStatusLabels,
  facilityTypeLabels,
} from "@/components/labels";
import { getFacilities } from "@/lib/data";
import { formatArea, formatCurrency, formatPercent } from "@/lib/format";
import type { Facility } from "@/lib/types";

export const metadata: Metadata = {
  title: "Facilities",
  description:
    "The healthcare facilities in the portfolio, with capacity, condition and capital commitments side by side.",
};

type ComparisonRow = {
  label: string;
  value: (facility: Facility) => string;
};

const comparisonRows: ComparisonRow[] = [
  { label: "Type", value: (facility) => facilityTypeLabels[facility.type] },
  {
    label: "Status",
    value: (facility) => facilityStatusLabels[facility.status],
  },
  {
    label: "Licensed beds",
    value: (facility) =>
      facility.licensedBeds === null
        ? "Outpatient"
        : facility.licensedBeds.toLocaleString("en-US"),
  },
  {
    label: "Gross floor area",
    value: (facility) => formatArea(facility.grossFloorAreaSqm),
  },
  {
    label: "Site area",
    value: (facility) => formatArea(facility.siteAreaSqm),
  },
  {
    label: "Occupancy",
    value: (facility) => formatPercent(facility.occupancyPct),
  },
  {
    label: "Functional zones",
    value: (facility) => String(facility.zones.length),
  },
  {
    label: "Active projects",
    value: (facility) =>
      String(
        facility.projects.filter((project) => project.phase !== "complete")
          .length,
      ),
  },
  {
    label: "Committed capital",
    value: (facility) =>
      formatCurrency(
        facility.projects
          .filter((project) => project.phase !== "complete")
          .reduce((total, project) => total + project.budgetCents, 0),
      ),
  },
];

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Facilities
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Four sites on one planning horizon. Each facility plan sets out
          capacity, the zones that carry it, and the capital projects in flight.
        </p>
      </header>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {facilities.map((facility) => (
          <FacilityCard key={facility.slug} facility={facility} />
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">
          Portfolio comparison
        </h2>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[52rem] border-collapse text-sm">
            <caption className="sr-only">
              Capacity, condition and capital comparison across the portfolio
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th
                  scope="col"
                  className="p-4 text-left font-medium text-muted-foreground"
                >
                  Measure
                </th>
                {facilities.map((facility) => (
                  <th
                    key={facility.slug}
                    scope="col"
                    className="p-4 text-left font-semibold"
                  >
                    {facility.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-border last:border-0"
                >
                  <th
                    scope="row"
                    className="p-4 text-left font-normal text-muted-foreground"
                  >
                    {row.label}
                  </th>
                  {facilities.map((facility) => (
                    <td key={facility.slug} className="p-4">
                      {row.value(facility)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-dashed border-border bg-muted p-6">
        <h2 className="font-semibold">About this data</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          These facilities are fixtures returned by{" "}
          <code className="rounded bg-background px-1.5 py-0.5 font-mono text-xs">
            src/lib/data.ts
          </code>
          . Swapping that file for Prisma queries or the Appwrite SDK is the
          only change needed to make this page read real records.
        </p>
      </section>
    </div>
  );
}
