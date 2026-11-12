import type { ReactNode } from "react";

/**
 * Placeholder blocks for the route-level `loading.tsx` files.
 *
 * Each skeleton mirrors the real page shell — same container width, heading,
 * card grid and table — so a slow data read keeps the layout from collapsing
 * into a blank screen. The blocks are decorative: they are hidden from
 * assistive technology and the wrapper announces what is loading.
 */
type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={`animate-pulse bg-muted ${className ?? ""}`} />
  );
}

function SkeletonGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-6 py-16"
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Generic page shape used while any route without its own `loading.tsx` resolves. */
export function PageSkeleton() {
  return (
    <SkeletonGroup label="Loading page…">
      <div className="max-w-2xl">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="mt-4 h-10 w-72 rounded-lg" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-4 w-full max-w-xl rounded" />
          <Skeleton className="h-4 w-full max-w-md rounded" />
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <Skeleton className="h-5 w-2/3 rounded" />
            <Skeleton className="mt-3 h-4 w-1/3 rounded" />
            <div className="mt-5 space-y-2">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
            </div>
            <Skeleton className="mt-6 h-10 w-full rounded-full" />
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}

/** Mirrors `/facilities`: intro, facility card grid and the comparison table. */
export function ListingSkeleton() {
  return (
    <SkeletonGroup label="Loading facilities…">
      <div className="max-w-2xl">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full max-w-2xl rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-2/3 rounded" />
                <Skeleton className="mt-2 h-4 w-28 rounded" />
              </div>
              <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
            </div>

            <div className="mt-5 space-y-2">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {Array.from({ length: 4 }).map((_, cell) => (
                <div key={cell}>
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="mt-1.5 h-4 w-24 rounded" />
                </div>
              ))}
            </div>

            <Skeleton className="mt-6 h-10 w-full rounded-full" />
          </div>
        ))}
      </div>

      <div className="mt-16">
        <Skeleton className="h-6 w-56 rounded" />
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          <Skeleton className="h-12 w-full rounded-none" />
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} className="border-t border-border p-4">
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonGroup>
  );
}

/** Mirrors `/planner`: intro, three step cards, toolbar, floors and summary. */
export function PlannerSkeleton() {
  return (
    <SkeletonGroup label="Loading the building planner…">
      <div className="max-w-3xl">
        <Skeleton className="h-4 w-44 rounded" />
        <Skeleton className="mt-3 h-10 w-96 max-w-full rounded-lg" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-4 w-full max-w-2xl rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <Skeleton className="h-5 w-32 rounded" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Skeleton className="h-9 w-64 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="mt-3 h-3 w-full max-w-xl rounded" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
        <div className="space-y-5">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </SkeletonGroup>
  );
}
