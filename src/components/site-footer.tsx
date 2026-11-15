import Link from "next/link";

import { getContactDetails } from "@/lib/data";

import { Icon } from "./icons";
import { Logo } from "./logo";

const exploreLinks = [
  { href: "/facilities", label: "Facilities" },
  { href: "/planner", label: "Hospital planner" },
  { href: "/planner/hotels", label: "Hotel planner" },
  { href: "/#roadmap", label: "Capital roadmap" },
  { href: "/contact", label: "Contact" },
];

/**
 * Hard-coded on purpose. With `cacheComponents` enabled (see next.config.ts),
 * synchronous IO such as `new Date()` throws during prerendering, so the
 * copyright year cannot be computed at render time.
 */
const COPYRIGHT_YEAR = 2026;

export async function SiteFooter() {
  const contactDetails = await getContactDetails();

  return (
    <footer className="mt-20 border-t border-border bg-muted">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            Master planning and capital programs for healthcare facilities, from
            first concept through to commissioning.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Planning office</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {contactDetails.map((detail) => (
              <li key={detail.label} className="flex items-start gap-2.5">
                <Icon
                  name={detail.icon}
                  className="mt-0.5 size-4 shrink-0 text-brand"
                />
                <span>{detail.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {COPYRIGHT_YEAR} JoeHealthPlan. All rights reserved.</p>
          <p>
            Starter project with sample facility data. No real capital program,
            budget or approval is represented here.
          </p>
        </div>
      </div>
    </footer>
  );
}
