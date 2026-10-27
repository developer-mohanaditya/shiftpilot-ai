/**
 * Sample data: a fictional Paris bistro. All names, rates and figures are invented.
 *
 * Design notes for the dataset:
 * - Closed on Mondays; lunch 11:00–15:00 (4 h) and dinner 18:00–23:00 (5 h).
 * - Weekly demand is deliberately tight for front-of-house roles, and several
 *   employees are cross-trained, so the order of assignments matters. That is
 *   what gives an optimiser something to improve on compared to a greedy pass.
 */
import {
  DAYS_OF_WEEK,
  type AppData,
  type Availability,
  type DayOfWeek,
  type Employee,
  type Restaurant,
  type Role,
  type ShiftPeriodId,
  type StaffingRequirement,
} from "@/domain/types";

export const sampleRestaurant: Restaurant = {
  name: "Maison Ardoise",
  currency: "EUR",
  shiftPeriods: {
    lunch: { id: "lunch", label: "Lunch", startMinute: 11 * 60, endMinute: 15 * 60 },
    dinner: { id: "dinner", label: "Dinner", startMinute: 18 * 60, endMinute: 23 * 60 },
  },
  allowDoubleShifts: true,
};

// ---------------------------------------------------------------------------
// Availability helper
// ---------------------------------------------------------------------------

type PeriodCode = "L" | "D" | "LD";

const PERIOD_CODES: Record<PeriodCode, ShiftPeriodId[]> = {
  L: ["lunch"],
  D: ["dinner"],
  LD: ["lunch", "dinner"],
};

/** Build a full-week availability; days not listed are unavailable. */
function week(spec: Partial<Record<DayOfWeek, PeriodCode>>): Availability {
  return Object.fromEntries(
    DAYS_OF_WEEK.map((day) => {
      const code = spec[day];
      return [day, code ? [...PERIOD_CODES[code]] : []];
    }),
  ) as Availability;
}

const TUE_TO_SAT = { tue: "LD", wed: "LD", thu: "LD", fri: "LD", sat: "LD" } as const;
const WED_TO_SUN = { wed: "LD", thu: "LD", fri: "LD", sat: "LD", sun: "LD" } as const;

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------

export const sampleEmployees: Employee[] = [
  {
    id: "emp-01",
    firstName: "Camille",
    lastName: "Moreau",
    roles: ["chef", "cook"],
    hourlyRate: 21.5,
    minHoursPerWeek: 30,
    maxHoursPerWeek: 39,
    availability: week(TUE_TO_SAT),
  },
  {
    id: "emp-02",
    firstName: "Julien",
    lastName: "Barbier",
    roles: ["chef", "cook"],
    hourlyRate: 18.75,
    minHoursPerWeek: 24,
    maxHoursPerWeek: 35,
    availability: week({ tue: "D", ...WED_TO_SUN }),
  },
  {
    id: "emp-03",
    firstName: "Inès",
    lastName: "Haddad",
    roles: ["cook"],
    hourlyRate: 15.2,
    minHoursPerWeek: 20,
    maxHoursPerWeek: 35,
    availability: week(TUE_TO_SAT),
  },
  {
    id: "emp-04",
    firstName: "Karim",
    lastName: "Belkacem",
    roles: ["cook"],
    hourlyRate: 14.8,
    minHoursPerWeek: 20,
    maxHoursPerWeek: 35,
    availability: week(WED_TO_SUN),
  },
  {
    id: "emp-05",
    firstName: "Tomás",
    lastName: "Ribeiro",
    roles: ["cook", "dishwasher"],
    hourlyRate: 14.6,
    minHoursPerWeek: 15,
    maxHoursPerWeek: 30,
    availability: week({ tue: "D", wed: "D", thu: "D", fri: "D", sat: "LD", sun: "LD" }),
  },
  {
    id: "emp-06",
    firstName: "Léa",
    lastName: "Fontaine",
    roles: ["cook"],
    hourlyRate: 14.9,
    minHoursPerWeek: 12,
    maxHoursPerWeek: 24,
    availability: week({ thu: "D", fri: "D", sat: "D", sun: "LD" }),
  },
  {
    id: "emp-07",
    firstName: "Hugo",
    lastName: "Lambert",
    roles: ["server", "bartender"],
    hourlyRate: 13.8,
    minHoursPerWeek: 24,
    maxHoursPerWeek: 39,
    availability: week(TUE_TO_SAT),
  },
  {
    id: "emp-08",
    firstName: "Chloé",
    lastName: "Mercier",
    roles: ["server", "host"],
    hourlyRate: 13.5,
    minHoursPerWeek: 20,
    maxHoursPerWeek: 39,
    availability: week(WED_TO_SUN),
  },
  {
    id: "emp-09",
    firstName: "Yanis",
    lastName: "Benali",
    roles: ["server"],
    hourlyRate: 13.2,
    minHoursPerWeek: 12,
    maxHoursPerWeek: 30,
    availability: week({ tue: "L", wed: "L", thu: "L", fri: "D", sat: "D", sun: "D" }),
  },
  {
    id: "emp-10",
    firstName: "Manon",
    lastName: "Girard",
    roles: ["server"],
    hourlyRate: 13.2,
    minHoursPerWeek: 8,
    maxHoursPerWeek: 20,
    availability: week({ fri: "D", sat: "LD", sun: "LD" }),
  },
  {
    id: "emp-11",
    firstName: "Sofia",
    lastName: "Kowalski",
    roles: ["server", "host"],
    hourlyRate: 13.4,
    minHoursPerWeek: 15,
    maxHoursPerWeek: 30,
    availability: week({ tue: "LD", wed: "LD", thu: "L", fri: "LD", sat: "D", sun: "L" }),
  },
  {
    id: "emp-12",
    firstName: "Nathan",
    lastName: "Rousseau",
    roles: ["bartender", "server"],
    hourlyRate: 14.4,
    minHoursPerWeek: 20,
    maxHoursPerWeek: 39,
    availability: week({ tue: "D", wed: "D", thu: "D", fri: "D", sat: "LD", sun: "LD" }),
  },
  {
    id: "emp-13",
    firstName: "Elise",
    lastName: "Garnier",
    roles: ["host", "server"],
    hourlyRate: 13.0,
    minHoursPerWeek: 10,
    maxHoursPerWeek: 30,
    availability: week({ tue: "L", thu: "D", fri: "D", sat: "LD", sun: "LD" }),
  },
  {
    id: "emp-14",
    firstName: "Moussa",
    lastName: "Diallo",
    roles: ["dishwasher", "cook"],
    hourlyRate: 12.4,
    minHoursPerWeek: 20,
    maxHoursPerWeek: 39,
    availability: week(TUE_TO_SAT),
  },
  {
    id: "emp-15",
    firstName: "Lucas",
    lastName: "Perrin",
    roles: ["dishwasher"],
    hourlyRate: 12.2,
    minHoursPerWeek: 8,
    maxHoursPerWeek: 24,
    availability: week({ tue: "L", wed: "L", fri: "D", sat: "LD", sun: "LD" }),
  },
];

// ---------------------------------------------------------------------------
// Staffing requirements
// ---------------------------------------------------------------------------

type ShiftDemand = Partial<Record<Role, number>>;
type WeeklyDemand = Record<DayOfWeek, Partial<Record<ShiftPeriodId, ShiftDemand>>>;

const weekdayLunch: ShiftDemand = { chef: 1, cook: 1, server: 2, dishwasher: 1 };
const weekdayDinner: ShiftDemand = { chef: 1, cook: 2, server: 2, bartender: 1, dishwasher: 1 };
const thursdayDinner: ShiftDemand = { ...weekdayDinner, host: 1 };
const weekendLunch: ShiftDemand = {
  chef: 1,
  cook: 2,
  server: 3,
  bartender: 1,
  host: 1,
  dishwasher: 1,
};
const peakDinner: ShiftDemand = {
  chef: 1,
  cook: 3,
  server: 4,
  bartender: 2,
  host: 1,
  dishwasher: 2,
};
const sundayDinner: ShiftDemand = { ...weekdayDinner, host: 1 };

const weeklyDemand: WeeklyDemand = {
  mon: {}, // closed
  tue: { lunch: weekdayLunch, dinner: weekdayDinner },
  wed: { lunch: weekdayLunch, dinner: weekdayDinner },
  thu: { lunch: weekdayLunch, dinner: thursdayDinner },
  fri: { lunch: weekdayLunch, dinner: peakDinner },
  sat: { lunch: weekendLunch, dinner: peakDinner },
  sun: { lunch: weekendLunch, dinner: sundayDinner },
};

function flattenDemand(demand: WeeklyDemand): StaffingRequirement[] {
  const result: StaffingRequirement[] = [];
  for (const day of DAYS_OF_WEEK) {
    for (const [periodId, roles] of Object.entries(demand[day]) as Array<
      [ShiftPeriodId, ShiftDemand]
    >) {
      for (const [role, count] of Object.entries(roles) as Array<[Role, number]>) {
        if (count > 0) result.push({ day, periodId, role, count });
      }
    }
  }
  return result;
}

export const sampleRequirements: StaffingRequirement[] = flattenDemand(weeklyDemand);

/** A fresh, independent copy of the sample data, safe to mutate. */
export function createSampleData(): AppData {
  return structuredClone({
    version: 1,
    restaurant: sampleRestaurant,
    employees: sampleEmployees,
    requirements: sampleRequirements,
    schedule: null,
    lastComparison: null,
  } satisfies AppData);
}
