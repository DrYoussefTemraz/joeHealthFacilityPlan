import type { IconName } from "@/lib/types";

import { Icon } from "./icons";

type FeatureCardProps = {
  icon: IconName;
  title: string;
  summary: string;
};

export function FeatureCard({ icon, title, summary }: FeatureCardProps) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand"
      >
        <Icon name={icon} className="size-5" />
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{summary}</p>
    </article>
  );
}
