import type { Role } from "@/domain/types";

/**
 * Visual identity per role. Class strings are written out in full so Tailwind
 * can detect them at build time.
 */
export const ROLE_STYLES: Record<Role, { dot: string; chip: string; color: string }> = {
  chef: {
    dot: "bg-role-chef",
    chip: "bg-role-chef/10 text-role-chef border-role-chef/25",
    color: "var(--role-chef)",
  },
  cook: {
    dot: "bg-role-cook",
    chip: "bg-role-cook/10 text-role-cook border-role-cook/25",
    color: "var(--role-cook)",
  },
  server: {
    dot: "bg-role-server",
    chip: "bg-role-server/10 text-role-server border-role-server/25",
    color: "var(--role-server)",
  },
  bartender: {
    dot: "bg-role-bartender",
    chip: "bg-role-bartender/10 text-role-bartender border-role-bartender/25",
    color: "var(--role-bartender)",
  },
  host: {
    dot: "bg-role-host",
    chip: "bg-role-host/10 text-role-host border-role-host/25",
    color: "var(--role-host)",
  },
  dishwasher: {
    dot: "bg-role-dishwasher",
    chip: "bg-role-dishwasher/10 text-role-dishwasher border-role-dishwasher/25",
    color: "var(--role-dishwasher)",
  },
};
