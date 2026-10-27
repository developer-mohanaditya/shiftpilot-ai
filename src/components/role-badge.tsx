import { ROLE_LABELS } from "@/domain/labels";
import type { Role } from "@/domain/types";
import { ROLE_STYLES } from "@/lib/role-styles";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
  role: Role;
  /** Optional count shown after the label, e.g. "Server 2". */
  count?: number;
  /** Render with reduced emphasis, e.g. for secondary (cross-trained) roles. */
  subtle?: boolean;
  className?: string;
}

export function RoleBadge({ role, count, subtle = false, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap",
        subtle ? "border-border bg-transparent text-muted-foreground" : ROLE_STYLES[role].chip,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", ROLE_STYLES[role].dot)} aria-hidden />
      {ROLE_LABELS[role]}
      {count !== undefined && <span className="tabular-nums">{count}</span>}
    </span>
  );
}
