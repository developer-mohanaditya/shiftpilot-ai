import type { DayOfWeek, Role } from "./types";

export const DAY_LABELS: Record<DayOfWeek, { short: string; long: string }> = {
  mon: { short: "Mon", long: "Monday" },
  tue: { short: "Tue", long: "Tuesday" },
  wed: { short: "Wed", long: "Wednesday" },
  thu: { short: "Thu", long: "Thursday" },
  fri: { short: "Fri", long: "Friday" },
  sat: { short: "Sat", long: "Saturday" },
  sun: { short: "Sun", long: "Sunday" },
};

export const ROLE_LABELS: Record<Role, string> = {
  chef: "Chef",
  cook: "Cook",
  server: "Server",
  bartender: "Bartender",
  host: "Host",
  dishwasher: "Dishwasher",
};
