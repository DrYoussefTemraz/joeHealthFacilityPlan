import type { IconName } from "@/lib/types";

import { Icon } from "./icons";

type StatProps = {
  icon?: IconName;
  label: string;
  value: string;
  hint?: string;
};

/**
 * A single label/value pair. Wrap a group of these in a `<dl>`; the inner
 * `div` is a valid child of `dl` in HTML5.
 */
export function Stat({ icon, label, value, hint }: StatProps) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon ? <Icon name={icon} className="size-4 text-brand" /> : null}
        {label}
      </dt>
      <dd className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</dd>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
