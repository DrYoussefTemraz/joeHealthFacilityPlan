import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M4.5 20V7.5A1.5 1.5 0 016 6h5a1.5 1.5 0 011.5 1.5V20" />
          <path d="M12.5 20v-6.5A1.5 1.5 0 0114 12h4a1.5 1.5 0 011.5 1.5V20" />
          <path d="M3 20h18" />
          <path d="M7.5 10h2.5M7.5 13.5h2.5" />
        </svg>
      </span>
      <span className="text-base font-semibold tracking-tight">
        Joe<span className="text-brand">Health</span>Plan
      </span>
    </Link>
  );
}
