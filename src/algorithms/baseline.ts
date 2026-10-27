import {
  type Employee,
  type OptimizationRun,
  type Restaurant,
  type Schedule,
  type ShiftAssignment,
  type StaffingRequirement,
} from "@/domain/types";
import { periodHours } from "@/domain/demand";
import { calculateFitness, evaluateSchedule } from "./metrics";

/**
 * Baseline greedy heuristic:
 * Iterates through requirements in chronological order and assigns the cheapest
 * available qualified employee who has hours remaining.
 */
export function runBaseline(
  restaurant: Restaurant,
  employees: Employee[],
  requirements: StaffingRequirement[],
): OptimizationRun {
  const startTime = performance.now();

  const assignments: ShiftAssignment[] = [];
  const hoursTracker = new Map<string, number>(employees.map((e) => [e.id, 0]));
  const bookedShifts = new Set<string>(); // key: empId:day:periodId
  const bookedDays = new Map<string, Set<string>>(); // key: empId:day -> Set of periods

  // Sort requirements chronologically
  const sortedRequirements = [...requirements];

  for (const req of sortedRequirements) {
    const shiftPeriod = restaurant.shiftPeriods[req.periodId];
    const duration = shiftPeriod ? periodHours(shiftPeriod) : 4;

    for (let slot = 0; slot < req.count; slot++) {
      // Find candidate employees
      const candidates = employees
        .filter((emp) => {
          // Must be qualified
          if (!emp.roles.includes(req.role)) return false;

          // Must be available
          const availablePeriods = emp.availability[req.day] ?? [];
          if (!availablePeriods.includes(req.periodId)) return false;

          // Cannot already be booked in this shift
          const shiftKey = `${emp.id}:${req.day}:${req.periodId}`;
          if (bookedShifts.has(shiftKey)) return false;

          // If double shifts forbidden, cannot already work that day
          if (!restaurant.allowDoubleShifts) {
            const dayKey = `${emp.id}:${req.day}`;
            const workedPeriods = bookedDays.get(dayKey);
            if (workedPeriods && workedPeriods.size > 0) return false;
          }

          // Cannot exceed max hours
          const currentHours = hoursTracker.get(emp.id) ?? 0;
          if (currentHours + duration > emp.maxHoursPerWeek) return false;

          return true;
        })
        .sort((a, b) => a.hourlyRate - b.hourlyRate);

      const chosen = candidates[0];
      if (chosen) {
        assignments.push({
          day: req.day,
          periodId: req.periodId,
          role: req.role,
          employeeId: chosen.id,
        });

        hoursTracker.set(
          chosen.id,
          (hoursTracker.get(chosen.id) ?? 0) + duration,
        );

        const shiftKey = `${chosen.id}:${req.day}:${req.periodId}`;
        bookedShifts.add(shiftKey);

        const dayKey = `${chosen.id}:${req.day}`;
        if (!bookedDays.has(dayKey)) {
          bookedDays.set(dayKey, new Set<string>());
        }
        bookedDays.get(dayKey)!.add(req.periodId);
      }
    }
  }

  const metrics = evaluateSchedule(restaurant, employees, requirements, assignments);
  const fitness = calculateFitness(metrics);
  const runtimeMs = Number((performance.now() - startTime).toFixed(2));

  const schedule: Schedule = {
    id: `sched-baseline-${Date.now()}`,
    source: "baseline",
    createdAt: new Date().toISOString(),
    assignments,
  };

  return {
    algorithm: "baseline",
    schedule,
    metrics,
    fitness,
    runtimeMs,
  };
}
