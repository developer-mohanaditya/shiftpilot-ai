/**
 * Core domain model for ShiftPilot AI Lite.
 *
 * This module is framework-free: no React, no browser APIs. The scheduling
 * algorithms and the UI both depend on it, never the other way round.
 *
 * Problem framing: a week is divided into shifts (day × service period).
 * Each shift needs a number of people per role. A schedule assigns employees
 * to (shift, role) positions. Algorithms search over these assignments.
 */

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

export const DAYS_OF_WEEK = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

/** Service periods a restaurant staffs. Fixed for the MVP. */
export const SHIFT_PERIOD_IDS = ["lunch", "dinner"] as const;
export type ShiftPeriodId = (typeof SHIFT_PERIOD_IDS)[number];

/** A recurring service period, e.g. lunch 11:00–15:00. */
export interface ShiftPeriod {
  id: ShiftPeriodId;
  label: string;
  /** Minutes after midnight, e.g. 660 = 11:00. */
  startMinute: number;
  /** Minutes after midnight; must be greater than startMinute. */
  endMinute: number;
}

/** One concrete shift in the week: a day plus a service period. */
export interface Shift {
  day: DayOfWeek;
  periodId: ShiftPeriodId;
}

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export const ROLES = ["chef", "cook", "server", "bartender", "host", "dishwasher"] as const;
export type Role = (typeof ROLES)[number];

/** Periods an employee can work, per day. An empty array means unavailable all day. */
export type Availability = Record<DayOfWeek, ShiftPeriodId[]>;

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  /** Roles the employee is trained for. The first entry is their primary role. */
  roles: Role[];
  /** Gross hourly rate in the restaurant's currency. */
  hourlyRate: number;
  /** Contracted minimum hours per week (soft constraint). */
  minHoursPerWeek: number;
  /** Maximum hours per week (hard constraint in scheduling). */
  maxHoursPerWeek: number;
  availability: Availability;
}

// ---------------------------------------------------------------------------
// Demand
// ---------------------------------------------------------------------------

/** How many people of a given role a shift needs. */
export interface StaffingRequirement extends Shift {
  role: Role;
  /** Number of people required; positive integer. */
  count: number;
}

export interface Restaurant {
  name: string;
  /** ISO 4217 code used for formatting labour costs. */
  currency: string;
  shiftPeriods: Record<ShiftPeriodId, ShiftPeriod>;
  /** If false, an employee may work at most one period per day. */
  allowDoubleShifts: boolean;
}

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------

/** One person working one role during one shift. */
export interface ShiftAssignment extends Shift {
  employeeId: string;
  role: Role;
}

export type ScheduleSource = "baseline" | "genetic" | "manual";

export interface Schedule {
  id: string;
  source: ScheduleSource;
  /** ISO 8601 timestamp. */
  createdAt: string;
  assignments: ShiftAssignment[];
}

/** Counts of rule breaches in a schedule. All zero means the schedule is feasible. */
export interface ConstraintViolations {
  /** Assignments outside an employee's stated availability. */
  unavailable: number;
  /** Assignments to a role the employee is not trained for. */
  unqualified: number;
  /** Extra assignments when someone is scheduled twice in one shift. */
  doubleBooked: number;
  /** Extra assignments on the same day when double shifts are not allowed. */
  doubleShifts: number;
  /** Total hours above employees' weekly maximums. */
  hoursOverMax: number;
  /** Total hours below employees' weekly minimums. */
  hoursUnderMin: number;
}

/** Every number shown on screen is derived from a schedule through these metrics. */
export interface ScheduleMetrics {
  totalLaborCost: number;
  totalHours: number;
  /** Positions the requirements ask for across the week. */
  requiredPositions: number;
  /** Required positions actually filled (overstaffing does not count twice). */
  filledPositions: number;
  /** filledPositions / requiredPositions, between 0 and 1. */
  coverageRate: number;
  understaffedPositions: number;
  overstaffedPositions: number;
  violations: ConstraintViolations;
  hoursByEmployee: Record<string, number>;
  laborCostByDay: Record<DayOfWeek, number>;
}

// ---------------------------------------------------------------------------
// Optimisation
// ---------------------------------------------------------------------------

export type AlgorithmId = "baseline" | "genetic";

export interface GeneticAlgorithmParams {
  populationSize: number;
  generations: number;
  /** Probability (0–1) that two parents are recombined. */
  crossoverRate: number;
  /** Probability (0–1) that each gene is mutated. */
  mutationRate: number;
  /** Best individuals copied unchanged into the next generation. */
  eliteCount: number;
  tournamentSize: number;
  /** Seed for the pseudo-random generator, so runs are reproducible. */
  seed: number;
}

/** Best and average fitness at one generation, for convergence charts. */
export interface ConvergencePoint {
  generation: number;
  bestFitness: number;
  averageFitness: number;
}

/** Outcome of running one algorithm on the current data. */
export interface OptimizationRun {
  algorithm: AlgorithmId;
  schedule: Schedule;
  metrics: ScheduleMetrics;
  /** Penalty-based objective value; lower is better. */
  fitness: number;
  runtimeMs: number;
  /** Present only for the genetic algorithm. */
  params?: GeneticAlgorithmParams;
  /** Present only for the genetic algorithm. */
  convergence?: ConvergencePoint[];
}

export interface OptimizationComparison {
  /** ISO 8601 timestamp. */
  runAt: string;
  baseline: OptimizationRun;
  genetic: OptimizationRun;
}

// ---------------------------------------------------------------------------
// Persisted application state
// ---------------------------------------------------------------------------

export interface AppData {
  /** Bumped when the stored shape changes, so stale localStorage can be reset. */
  version: 1;
  restaurant: Restaurant;
  employees: Employee[];
  requirements: StaffingRequirement[];
  schedule: Schedule | null;
  lastComparison: OptimizationComparison | null;
}
