import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Icon } from "@/components/icons";
import { getContactDetails } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the JoeHealthPlan planning office about a new facility, an expansion, capital budgets or approvals.",
};

export default async function ContactPage() {
  const contactDetails = await getContactDetails();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Contact
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          New site, capacity pressure or a business case that needs sharpening?
          Send a note and the planning office will come back with an initial
          view.
        </p>
      </header>

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ContactForm />

        <div className="space-y-6">
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {contactDetails.map((detail) => (
              <li
                key={detail.label}
                className="flex items-center gap-4 p-5"
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"
                >
                  <Icon name={detail.icon} className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{detail.label}</p>
                  <p className="font-medium">{detail.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
