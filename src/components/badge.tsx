import type { ReactNode } from "react";

export type BadgeVariant = "brand" | "neutral" | "good" | "warn" | "crit";

const variantClasses: Record<BadgeVariant, string> = {
  brand: "bg-brand text-brand-foreground",
  neutral: "bg-muted text-muted-foreground",
  good: "bg-good-soft text-good",
  warn: "bg-warn-soft text-warn",
  crit: "bg-crit-soft text-crit",
};

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
};

export function Badge({ variant = "neutral", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
