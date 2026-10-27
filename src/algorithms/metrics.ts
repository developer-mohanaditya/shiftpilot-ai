import {
  DAYS_OF_WEEK,
  type DayOfWeek,
  type Employee,
  type Restaurant,
  type ScheduleMetrics,
  type ShiftAssignment,
  type StaffingRequirement,
} from "@/domain/types";
import { periodHours } from "@/domain/demand";

export const PENALTY_WEIGHTS = {
  uncoveredPosition: 500,
  unavailableShift: 800,
  unqualifiedRole: 1000,
  doubleBookedSameShift: 1200,
  doubleShiftNotAllowed: 600,
  hourOverMax: 50,
  hourUnderMin: 15,
} as const;

/**
 * Calculates detailed metrics and rule violation statistics for any schedule.
 */
export function evaluateSchedule(
  restaurant: Restaurant,
  employees: Employee[],
  requirements: StaffingRequirement[],
  assignments: ShiftAssignment[],
): ScheduleMetrics {
  const empMap = new Map<string, Employee>(employees.map((e) => [e.id, e]));

  const hoursByEmployee: Record<string, number> = Object.fromEntries(
    employees.map((e) => [e.id, 0]),
  );

  const laborCostByDay: Record<DayOfWeek, number> = Object.fromEntries(
    DAYS_OF_WEEK.map((d) => [d, 0]),
  ) as Record<DayOfWeek, number>;

  let totalHours = 0;
  let totalLaborCost = 0;

  let unavailableCount = 0;
  let unqualifiedCount = 0;
  let doubleBookedCount = 0;
  let doubleShiftsCount = 0;

  // Track shifts worked per employee
  // key: employeeId:day:periodId
  const shiftTracker = new Map<string, number>();
  // key: employeeId:day
  const dayShiftTracker = new Map<string, Set<string>>();

  for (const a of assignments) {
    const emp = empMap.get(a.employeeId);
    if (!emp) continue;

    const period = restaurant.shiftPeriods[a.periodId];
    const duration = period ? periodHours(period) : 4;

    hoursByEmployee[emp.id] = (hoursByEmployee[emp.id] ?? 0) + duration;
    totalHours += duration;

    const cost = duration * emp.hourlyRate;
    totalLaborCost += cost;
    laborCostByDay[a.day] = (laborCostByDay[a.day] ?? 0) + cost;

    // Check qualification
    if (!emp.roles.includes(a.role)) {
      unqualifiedCount++;
    }

    // Check availability
    const availablePeriods = emp.availability[a.day] ?? [];
    if (!availablePeriods.includes(a.periodId)) {
      unavailableCount++;
    }

    // Check double booked in same shift
    const shiftKey = `${emp.id}:${a.day}:${a.periodId}`;
    const timesBooked = (shiftTracker.get(shiftKey) ?? 0) + 1;
    shiftTracker.set(shiftKey, timesBooked);
    if (timesBooked > 1) {
      doubleBookedCount++;
    }

    // Check multiple shifts in one day
    const dayKey = `${emp.id}:${a.day}`;
    if (!dayShiftTracker.has(dayKey)) {
      dayShiftTracker.set(dayKey, new Set<string>());
    }
    const dayPeriods = dayShiftTracker.get(dayKey)!;
    if (dayPeriods.has(a.periodId)) {
      // already counted in doubleBooked
    } else {
      if (!restaurant.allowDoubleShifts && dayPeriods.size >= 1) {
        doubleShiftsCount++;
      }
      dayPeriods.add(a.periodId);
    }
  }

  // Hours boundaries violations
  let hoursOverMax = 0;
  let hoursUnderMin = 0;

  for (const emp of employees) {
    const worked = hoursByEmployee[emp.id] ?? 0;
    if (worked > emp.maxHoursPerWeek) {
      hoursOverMax += worked - emp.maxHoursPerWeek;
    } else if (worked < emp.minHoursPerWeek) {
      hoursUnderMin += emp.minHoursPerWeek - worked;
    }
  }

  // Coverage calculations
  let requiredPositions = 0;
  let filledPositions = 0;
  let understaffedPositions = 0;
  let overstaffedPositions = 0;

  for (const req of requirements) {
    requiredPositions += req.count;
    const assignedCount = assignments.filter(
      (a) => a.day === req.day && a.periodId === req.periodId && a.role === req.role,
    ).length;

    if (assignedCount >= req.count) {
      filledPositions += req.count;
      overstaffedPositions += assignedCount - req.count;
    } else {
      filledPositions += assignedCount;
      understaffedPositions += req.count - assignedCount;
    }
  }

  const coverageRate = requiredPositions > 0 ? filledPositions / requiredPositions : 1;

  const violations = {
    unavailable: unavailableCount,
    unqualified: unqualifiedCount,
    doubleBooked: doubleBookedCount,
    doubleShifts: doubleShiftsCount,
    hoursOverMax,
    hoursUnderMin,
  };

  return {
    totalLaborCost: Number(totalLaborCost.toFixed(2)),
    totalHours: Number(totalHours.toFixed(1)),
    requiredPositions,
    filledPositions,
    coverageRate: Number(coverageRate.toFixed(3)),
    understaffedPositions,
    overstaffedPositions,
    violations,
    hoursByEmployee,
    laborCostByDay,
  };
}

/**
 * Calculates scalar penalty fitness value. Lower fitness is better.
 */
export function calculateFitness(metrics: ScheduleMetrics): number {
  const penalty =
    metrics.violations.unqualified * PENALTY_WEIGHTS.unqualifiedRole +
    metrics.violations.unavailable * PENALTY_WEIGHTS.unavailableShift +
    metrics.violations.doubleBooked * PENALTY_WEIGHTS.doubleBookedSameShift +
    metrics.violations.doubleShifts * PENALTY_WEIGHTS.doubleShiftNotAllowed +
    metrics.violations.hoursOverMax * PENALTY_WEIGHTS.hourOverMax +
    metrics.violations.hoursUnderMin * PENALTY_WEIGHTS.hourUnderMin +
    metrics.understaffedPositions * PENALTY_WEIGHTS.uncoveredPosition;

  return Number((metrics.totalLaborCost + penalty).toFixed(2));
}
