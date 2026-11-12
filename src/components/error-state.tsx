"use client";

import Link from "next/link";

import { Icon } from "./icons";

/**
 * Shared fallback card for the route error boundary (`app/error.tsx`) and the
 * root-layout boundary (`app/global-error.tsx`).
 *
 * Errors forwarded from a Server Component arrive with a generic message and a
 * `digest` that matches the server logs, so the card shows the reference
 * instead of the (possibly sensitive) original message.
 */
type ErrorStateProps = {
  title: string;
  description: string;
  digest: string | null;
  onRetry: () => void;
};

/** `error` is forwarded as `unknown`; narrow it before reading `digest`. */
export function readErrorDigest(error: unknown): string | null {
  if (typeof error === "object" && error !== null && "digest" in error) {
    const digest = error.digest;
    return typeof digest === "string" ? digest : null;
  }

  return null;
}

export function ErrorState({
  title,
  description,
  digest,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 sm:p-10"
    >
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-2xl bg-crit-soft text-crit"
      >
        <Icon name="alert" className="size-6" />
      </span>

      <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>

      <p className="mt-3 leading-7 text-muted-foreground">{description}</p>

      {digest ? (
        <p className="mt-4 w-fit max-w-full truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
          Reference: {digest}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onRetry()}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          <Icon name="refresh" className="size-4" />
          Try again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
