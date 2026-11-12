/**
 * Fallback shown while `FacilityDetail` resolves the slug and loads the plan.
 * It mirrors the real layout — header, stat grid, then the sections — so the
 * page keeps its shape instead of collapsing to the back link.
 */
export function FacilityDetailSkeleton() {
  return (
    <div className="mt-8 animate-pulse" role="status" aria-live="polite">
      <span className="sr-only">Loading facility plan…</span>

      <div className="flex flex-wrap items-center gap-2">
        <div className="h-6 w-28 rounded-full bg-muted" />
        <div className="h-6 w-24 rounded-full bg-muted" />
      </div>

      <div className="mt-4 h-10 w-full max-w-md rounded-lg bg-muted" />

      <div className="mt-3 h-4 w-64 rounded bg-muted" />

      <div className="mt-5 space-y-3">
        <div className="h-4 w-full max-w-3xl rounded bg-muted" />
        <div className="h-4 w-full max-w-2xl rounded bg-muted" />
      </div>

      <div className="mt-10 grid gap-6 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="mt-2 h-7 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="mt-16 space-y-4">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-28 rounded-2xl border border-border bg-card" />
        <div className="h-28 rounded-2xl border border-border bg-card" />
      </div>
    </div>
  );
}
