import { formatCurrency } from "@/lib/format";
import type { CapitalProject } from "@/lib/types";

import { Badge } from "./badge";
import {
  projectCategoryLabels,
  projectPhaseLabels,
  projectPhaseVariants,
} from "./labels";

export function CapitalProjectRow({ project }: { project: CapitalProject }) {
  return (
    <li className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <h3 className="font-semibold">{project.name}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={projectPhaseVariants[project.phase]}>
            {projectPhaseLabels[project.phase]}
          </Badge>
          <Badge variant="neutral">
            {projectCategoryLabels[project.category]}
          </Badge>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">Budget</dt>
          <dd className="mt-0.5 font-medium">
            {formatCurrency(project.budgetCents)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Timeline</dt>
          <dd className="mt-0.5 font-medium">
            {project.startYear}&ndash;{project.targetYear}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Progress</dt>
          <dd className="mt-0.5 font-medium">{project.progressPct}%</dd>
        </div>
      </dl>

      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={`${project.name} progress`}
        aria-valuenow={project.progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${project.progressPct}%` }}
        />
      </div>
    </li>
  );
}
