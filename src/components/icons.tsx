import type { ReactNode } from "react";

import type { IconName } from "@/lib/types";

type IconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, ReactNode> = {
  building: (
    <>
      <path d="M4 21V6.5a2 2 0 012-2h6a2 2 0 012 2V21" />
      <path d="M14 21V11.5a2 2 0 012-2h2a2 2 0 012 2V21" />
      <path d="M2.5 21h19" />
      <path d="M7.5 8h3M7.5 11.5h3M7.5 15h3M17 13.5h1M17 16.5h1" />
    </>
  ),
  bed: (
    <>
      <path d="M2.5 19v-9.5" />
      <path d="M2.5 13h13a4.5 4.5 0 014.5 4.5V19" />
      <path d="M2.5 19h19" />
      <path d="M6.5 13V9.5A1.5 1.5 0 018 8h3.5a1.5 1.5 0 011.5 1.5V13" />
    </>
  ),
  blueprint: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2" />
      <path d="M2.5 9.5h7M9.5 4v5.5M14 9.5h7.5M14 9.5V20M9.5 14h4.5" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>
  ),
  gauge: (
    <>
      <path d="M3.5 17.5a8.5 8.5 0 1117 0" />
      <path d="M12 17.5l4-5.5" />
      <circle cx="12" cy="17.5" r="1.3" />
    </>
  ),
  budget: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6.5 9.5v5M17.5 9.5v5" />
    </>
  ),
  clipboard: (
    <>
      <path d="M9 4.5H7.5a2 2 0 00-2 2v13a2 2 0 002 2h9a2 2 0 002-2v-13a2 2 0 00-2-2H15" />
      <rect x="9" y="2.5" width="6" height="4" rx="1.5" />
      <path d="M9 14l2 2 4-4.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10.4c0 5.6-8 11.6-8 11.6s-8-6-8-11.6a8 8 0 1116 0z" />
      <circle cx="12" cy="10" r="2.8" />
    </>
  ),
  phone: (
    <path d="M21.5 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 011.6 4.2 2 2 0 013.6 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.6a2 2 0 01-.5 2.1L7.6 9.5a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.8.3 1.7.5 2.6.6a2 2 0 011.7 2z" />
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3 7.5l9 6 9-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  alert: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V13" />
      <path d="M12 16.5h.01" />
    </>
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0115-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 01-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </>
  ),
  "arrow-right": <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
};

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
