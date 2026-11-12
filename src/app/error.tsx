"use client";

import { useEffect } from "react";

import { ErrorState, readErrorDigest } from "@/components/error-state";

/**
 * Route-level boundary: catches render errors below the root layout, so the
 * site header and footer stay in place. `retry` (Next 16) re-fetches and
 * re-renders the segment rather than only clearing the error state.
 */
export default function AppError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // Replace with an error-reporting service when one is wired up.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-6xl justify-center px-6 py-20">
      <ErrorState
        title="Something went wrong"
        description="This page could not be rendered. The rest of the site is still available — try again, or head back to the home page and pick up from there."
        digest={readErrorDigest(error)}
        onRetry={retry}
      />
    </div>
  );
}
