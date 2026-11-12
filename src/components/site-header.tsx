import Link from "next/link";

import { Logo } from "./logo";

const navLinks = [
  { href: "/facilities", label: "Facilities" },
  { href: "/planner", label: "Planner" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-3.5">
        <Logo />

        <nav aria-label="Main" className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex rounded-full px-3.5 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/contact"
          className="inline-flex items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          Request a review
        </Link>
      </div>
    </header>
  );
}
