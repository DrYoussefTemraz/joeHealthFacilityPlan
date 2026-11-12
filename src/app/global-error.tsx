"use client";

import { ErrorState, readErrorDigest } from "@/components/error-state";

import "./globals.css";

/**
 * Last-resort boundary for failures in the root layout itself. It replaces the
 * layout, so it renders its own document, imports the global stylesheet and
 * uses `<title>` because `metadata` is not available in a Client Component.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <title>Something went wrong | JoeHealthPlan</title>

        <main className="flex flex-1 items-center justify-center px-6 py-20">
          <div className="w-full max-w-xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand">
              JoeHealthPlan
            </p>

            <ErrorState
              title="The application could not load"
              description="Something failed outside the page content, so the usual header and footer are unavailable. Trying again reloads the affected segment."
              digest={readErrorDigest(error)}
              onRetry={retry}
            />
          </div>
        </main>
      </body>
    </html>
  );
}
