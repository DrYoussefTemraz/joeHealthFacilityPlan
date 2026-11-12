import type { Metadata } from "next";
import Link from "next/link";

import { Icon } from "@/components/icons";

/**
 * Branded 404 for unmatched URLs and for `notFound()` calls such as an unknown
 * facility slug. It renders inside the root layout, so the header and footer
 * are preserved. Next.js injects `noindex` for this response automatically.
 */
export const metadata: Metadata = {
  title: "Page not found",
};

const secondaryLinkClassName =
  "inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-20">
      <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-crit" />
        404
      </p>

      <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
        This page is not on the plan
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
        The address you followed does not match anything in this portfolio. It
        may have moved, or the link may be out of date. Start from one of these
        instead.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          Back to home
          <Icon name="arrow-right" className="size-4" />
        </Link>

        <Link href="/facilities" className={secondaryLinkClassName}>
          Browse facilities
        </Link>

        <Link href="/planner" className={secondaryLinkClassName}>
          Open the planner
        </Link>
      </div>
    </div>
  );
}
