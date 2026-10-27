import {
  DAYS_OF_WEEK,
  ROLES,
  type DayOfWeek,
  type Restaurant,
  type Role,
  type ShiftPeriod,
  type StaffingRequirement,
} from "./types";

/** Length of a service period in hours. */
export function periodHours(period: ShiftPeriod): number {
  return (period.endMinute - period.startMinute) / 60;
}

export interface DemandSummary {
  /** Total positions required across the week. */
  positions: number;
  /** Total staff-hours required across the week. */
  staffHours: number;
  /** Days with at least one requirement. */
  openDays: DayOfWeek[];
  /** Required staff-hours per day, split by role. */
  hoursByDay: Array<{ day: DayOfWeek } & Record<Role, number>>;
  /** Required staff-hours per role across the week. */
  hoursByRole: Record<Role, number>;
}

function emptyRoleRecord(): Record<Role, number> {
  return Object.fromEntries(ROLES.map((role) => [role, 0])) as Record<Role, number>;
}

/** Aggregate staffing requirements into weekly totals. Pure and deterministic. */
export function summarizeDemand(
  restaurant: Restaurant,
  requirements: readonly StaffingRequirement[],
): DemandSummary {
  const hoursByRole = emptyRoleRecord();
  const byDay = new Map<DayOfWeek, Record<Role, number>>(
    DAYS_OF_WEEK.map((day) => [day, emptyRoleRecord()]),
  );
  let positions = 0;
  let staffHours = 0;

  for (const requirement of requirements) {
    const hours = periodHours(restaurant.shiftPeriods[requirement.periodId]) * requirement.count;
    positions += requirement.count;
    staffHours += hours;
    hoursByRole[requirement.role] += hours;
    const dayRecord = byDay.get(requirement.day);
    if (dayRecord) dayRecord[requirement.role] += hours;
  }

  const hoursByDay = DAYS_OF_WEEK.map((day) => ({ day, ...(byDay.get(day) ?? emptyRoleRecord()) }));
  const openDays = hoursByDay
    .filter((entry) => ROLES.some((role) => entry[role] > 0))
    .map((entry) => entry.day);

  return { positions, staffHours, openDays, hoursByDay, hoursByRole };
}

/** Number of people required for a role in one shift (0 if none). */
export function requiredCount(
  requirements: readonly StaffingRequirement[],
  day: DayOfWeek,
  periodId: StaffingRequirement["periodId"],
  role: Role,
): number {
  return requirements
    .filter((r) => r.day === day && r.periodId === periodId && r.role === role)
    .reduce((sum, r) => sum + r.count, 0);
}
