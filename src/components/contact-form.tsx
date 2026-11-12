"use client";

import { useActionState, useState } from "react";

import { submitReviewRequest } from "@/app/contact/actions";
import {
  initialReviewRequestFormState,
  reviewRequestTopics,
} from "@/lib/review-request";

const fieldClassName =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25";

const labelClassName = "block text-sm font-medium";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="text-xs text-crit">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [formKey, setFormKey] = useState(0);

  return (
    <ReviewRequestForm
      key={formKey}
      onReset={() => setFormKey((key) => key + 1)}
    />
  );
}

function ReviewRequestForm({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(
    submitReviewRequest,
    initialReviewRequestFormState,
  );

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">Request received</p>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          {state.message}
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Send another message
        </button>
      </div>
    );
  }

  const errors = state.fieldErrors;

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-border bg-card p-6"
    >
      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-xl border border-crit/30 bg-crit/10 px-3.5 py-2.5 text-sm text-crit"
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          aria-invalid={errors?.name ? true : undefined}
          aria-describedby={errors?.name ? "name-error" : undefined}
          className={fieldClassName}
          placeholder="Joe Rivera"
        />
        <FieldError id="name-error" message={errors?.name} />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          aria-invalid={errors?.email ? true : undefined}
          aria-describedby={errors?.email ? "email-error" : undefined}
          className={fieldClassName}
          placeholder="joe@example.com"
        />
        <FieldError id="email-error" message={errors?.email} />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="facility">
          Facility or site
        </label>
        <input
          id="facility"
          name="facility"
          type="text"
          maxLength={160}
          aria-invalid={errors?.facility ? true : undefined}
          aria-describedby={errors?.facility ? "facility-error" : undefined}
          className={fieldClassName}
          placeholder="Northside General Hospital"
        />
        <FieldError id="facility-error" message={errors?.facility} />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="topic">
          What is this about?
        </label>
        <select
          id="topic"
          name="topic"
          aria-invalid={errors?.topic ? true : undefined}
          aria-describedby={errors?.topic ? "topic-error" : undefined}
          className={fieldClassName}
        >
          {reviewRequestTopics.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
        <FieldError id="topic-error" message={errors?.topic} />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={4_000}
          aria-invalid={errors?.message ? true : undefined}
          aria-describedby={errors?.message ? "message-error" : undefined}
          className={`${fieldClassName} resize-y`}
          placeholder="Describe the site, the constraint you are hitting and the timeline you are working to."
        />
        <FieldError id="message-error" message={errors?.message} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>

      <p className="text-xs leading-5 text-muted-foreground">
        Your request is saved for the planning office. We usually reply within
        two business days.
      </p>
    </form>
  );
}
