"use client";

import { useState } from "react";

const fieldClassName =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/25";

const labelClassName = "block text-sm font-medium";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">Message queued locally</p>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          This form is a placeholder. Nothing was sent anywhere: wire it to a
          Server Action or an API route once the backend is in place.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted"
        >
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 rounded-2xl border border-border bg-card p-6"
      onSubmit={(event) => {
        // TODO: replace with a Server Action (or a POST to app/api/contact)
        // once a backend exists. No request is made today.
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={fieldClassName}
          placeholder="Joe Rivera"
        />
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
          autoComplete="email"
          className={fieldClassName}
          placeholder="joe@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="facility">
          Facility or site
        </label>
        <input
          id="facility"
          name="facility"
          type="text"
          className={fieldClassName}
          placeholder="Northside General Hospital"
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClassName} htmlFor="topic">
          What is this about?
        </label>
        <select id="topic" name="topic" className={fieldClassName}>
          <option value="new-facility">New facility planning</option>
          <option value="expansion">Expansion or capacity</option>
          <option value="capital">Capital budget and funding</option>
          <option value="approvals">Approvals and compliance</option>
          <option value="other">Something else</option>
        </select>
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
          className={`${fieldClassName} resize-y`}
          placeholder="Describe the site, the constraint you are hitting and the timeline you are working to."
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
      >
        Send message
      </button>

      <p className="text-xs leading-5 text-muted-foreground">
        Placeholder form: submitting only toggles local state and sends nothing.
      </p>
    </form>
  );
}
