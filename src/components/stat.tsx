import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  /** Dim the value when it is a placeholder (e.g. no schedule yet). */
  pending?: boolean;
  className?: string;
}

export function Stat({ label, value, detail, pending = false, className }: StatProps) {
  return (
    <div className={cn("rounded-xl border bg-card p-5", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums",
          pending && "text-muted-foreground/60",
        )}
      >
        {value}
      </p>
      {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
    </div>
  );
}
