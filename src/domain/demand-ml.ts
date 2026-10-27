import {
  DAYS_OF_WEEK,
  ROLES,
  type DayOfWeek,
  type Role,
  type ShiftPeriodId,
  type StaffingRequirement,
} from "./types";

export interface HistoricalServiceRecord {
  week: number;
  day: DayOfWeek;
  periodId: ShiftPeriodId;
  reservations24h: number;
  isWeekend: number;
  isRainy: number;
  actualCovers: number;
}

export interface RegressionWeights {
  intercept: number;
  reservations: number;
  weekend: number;
  rain: number;
  lunchBias: number;
}

export interface DemandPrediction {
  day: DayOfWeek;
  periodId: ShiftPeriodId;
  predictedCovers: number;
  confidenceLower: number;
  confidenceUpper: number;
  staffing: Record<Role, number>;
}

export interface ModelDiagnostics {
  mae: number;
  rmse: number;
  rSquared: number;
  weights: RegressionWeights;
  trainingSamples: number;
}

/**
 * 8 weeks of historical covers data for Maison Ardoise.
 * Represents lunch and dinner services across varied conditions.
 */
export const HISTORICAL_TRAINING_DATA: HistoricalServiceRecord[] = [
  // Week 1
  { week: 1, day: "tue", periodId: "lunch", reservations24h: 18, isWeekend: 0, isRainy: 0, actualCovers: 32 },
  { week: 1, day: "tue", periodId: "dinner", reservations24h: 30, isWeekend: 0, isRainy: 0, actualCovers: 54 },
  { week: 1, day: "wed", periodId: "lunch", reservations24h: 16, isWeekend: 0, isRainy: 1, actualCovers: 28 },
  { week: 1, day: "wed", periodId: "dinner", reservations24h: 32, isWeekend: 0, isRainy: 1, actualCovers: 52 },
  { week: 1, day: "thu", periodId: "lunch", reservations24h: 22, isWeekend: 0, isRainy: 0, actualCovers: 38 },
  { week: 1, day: "thu", periodId: "dinner", reservations24h: 40, isWeekend: 0, isRainy: 0, actualCovers: 68 },
  { week: 1, day: "fri", periodId: "lunch", reservations24h: 25, isWeekend: 0, isRainy: 0, actualCovers: 44 },
  { week: 1, day: "fri", periodId: "dinner", reservations24h: 55, isWeekend: 0, isRainy: 0, actualCovers: 92 },
  { week: 1, day: "sat", periodId: "lunch", reservations24h: 35, isWeekend: 1, isRainy: 0, actualCovers: 62 },
  { week: 1, day: "sat", periodId: "dinner", reservations24h: 62, isWeekend: 1, isRainy: 0, actualCovers: 98 },
  { week: 1, day: "sun", periodId: "lunch", reservations24h: 34, isWeekend: 1, isRainy: 0, actualCovers: 58 },
  { week: 1, day: "sun", periodId: "dinner", reservations24h: 36, isWeekend: 1, isRainy: 0, actualCovers: 62 },

  // Week 2
  { week: 2, day: "tue", periodId: "lunch", reservations24h: 15, isWeekend: 0, isRainy: 1, actualCovers: 27 },
  { week: 2, day: "tue", periodId: "dinner", reservations24h: 28, isWeekend: 0, isRainy: 1, actualCovers: 49 },
  { week: 2, day: "wed", periodId: "lunch", reservations24h: 19, isWeekend: 0, isRainy: 0, actualCovers: 34 },
  { week: 2, day: "wed", periodId: "dinner", reservations24h: 35, isWeekend: 0, isRainy: 0, actualCovers: 58 },
  { week: 2, day: "thu", periodId: "lunch", reservations24h: 20, isWeekend: 0, isRainy: 0, actualCovers: 35 },
  { week: 2, day: "thu", periodId: "dinner", reservations24h: 42, isWeekend: 0, isRainy: 0, actualCovers: 70 },
  { week: 2, day: "fri", periodId: "lunch", reservations24h: 24, isWeekend: 0, isRainy: 1, actualCovers: 39 },
  { week: 2, day: "fri", periodId: "dinner", reservations24h: 52, isWeekend: 0, isRainy: 1, actualCovers: 88 },
  { week: 2, day: "sat", periodId: "lunch", reservations24h: 38, isWeekend: 1, isRainy: 1, actualCovers: 59 },
  { week: 2, day: "sat", periodId: "dinner", reservations24h: 60, isWeekend: 1, isRainy: 1, actualCovers: 94 },
  { week: 2, day: "sun", periodId: "lunch", reservations24h: 32, isWeekend: 1, isRainy: 0, actualCovers: 56 },
  { week: 2, day: "sun", periodId: "dinner", reservations24h: 33, isWeekend: 1, isRainy: 0, actualCovers: 59 },

  // Week 3
  { week: 3, day: "tue", periodId: "lunch", reservations24h: 20, isWeekend: 0, isRainy: 0, actualCovers: 35 },
  { week: 3, day: "tue", periodId: "dinner", reservations24h: 31, isWeekend: 0, isRainy: 0, actualCovers: 56 },
  { week: 3, day: "wed", periodId: "lunch", reservations24h: 17, isWeekend: 0, isRainy: 0, actualCovers: 31 },
  { week: 3, day: "wed", periodId: "dinner", reservations24h: 33, isWeekend: 0, isRainy: 0, actualCovers: 55 },
  { week: 3, day: "thu", periodId: "lunch", reservations24h: 23, isWeekend: 0, isRainy: 1, actualCovers: 36 },
  { week: 3, day: "thu", periodId: "dinner", reservations24h: 39, isWeekend: 0, isRainy: 1, actualCovers: 65 },
  { week: 3, day: "fri", periodId: "lunch", reservations24h: 28, isWeekend: 0, isRainy: 0, actualCovers: 46 },
  { week: 3, day: "fri", periodId: "dinner", reservations24h: 58, isWeekend: 0, isRainy: 0, actualCovers: 95 },
  { week: 3, day: "sat", periodId: "lunch", reservations24h: 40, isWeekend: 1, isRainy: 0, actualCovers: 65 },
  { week: 3, day: "sat", periodId: "dinner", reservations24h: 65, isWeekend: 1, isRainy: 0, actualCovers: 102 },
  { week: 3, day: "sun", periodId: "lunch", reservations24h: 36, isWeekend: 1, isRainy: 1, actualCovers: 55 },
  { week: 3, day: "sun", periodId: "dinner", reservations24h: 35, isWeekend: 1, isRainy: 1, actualCovers: 57 },

  // Week 4
  { week: 4, day: "tue", periodId: "lunch", reservations24h: 17, isWeekend: 0, isRainy: 0, actualCovers: 30 },
  { week: 4, day: "tue", periodId: "dinner", reservations24h: 29, isWeekend: 0, isRainy: 0, actualCovers: 52 },
  { week: 4, day: "wed", periodId: "lunch", reservations24h: 18, isWeekend: 0, isRainy: 0, actualCovers: 33 },
  { week: 4, day: "wed", periodId: "dinner", reservations24h: 34, isWeekend: 0, isRainy: 0, actualCovers: 56 },
  { week: 4, day: "thu", periodId: "lunch", reservations24h: 21, isWeekend: 0, isRainy: 0, actualCovers: 37 },
  { week: 4, day: "thu", periodId: "dinner", reservations24h: 44, isWeekend: 0, isRainy: 0, actualCovers: 72 },
  { week: 4, day: "fri", periodId: "lunch", reservations24h: 26, isWeekend: 0, isRainy: 0, actualCovers: 43 },
  { week: 4, day: "fri", periodId: "dinner", reservations24h: 56, isWeekend: 0, isRainy: 0, actualCovers: 91 },
  { week: 4, day: "sat", periodId: "lunch", reservations24h: 37, isWeekend: 1, isRainy: 0, actualCovers: 63 },
  { week: 4, day: "sat", periodId: "dinner", reservations24h: 63, isWeekend: 1, isRainy: 0, actualCovers: 100 },
  { week: 4, day: "sun", periodId: "lunch", reservations24h: 33, isWeekend: 1, isRainy: 0, actualCovers: 57 },
  { week: 4, day: "sun", periodId: "dinner", reservations24h: 37, isWeekend: 1, isRainy: 0, actualCovers: 63 },
];

/**
 * Closed-form ordinary least squares linear regression on features:
 * [1, reservations24h, isWeekend, isRainy, isLunch]
 */
export function trainRegressionModel(
  records: HistoricalServiceRecord[] = HISTORICAL_TRAINING_DATA,
): { weights: RegressionWeights; diagnostics: ModelDiagnostics } {
  // Features matrix X and target vector y
  const X: number[][] = [];
  const y: number[] = [];

  for (const r of records) {
    const isLunch = r.periodId === "lunch" ? 1 : 0;
    X.push([1, r.reservations24h, r.isWeekend, r.isRainy, isLunch]);
    y.push(r.actualCovers);
  }

  const n = X.length;
  const numFeatures = 5;

  // Compute X^T * X and X^T * y
  const XtX: number[][] = Array.from({ length: numFeatures }, () =>
    Array(numFeatures).fill(0),
  );
  const Xty: number[] = Array(numFeatures).fill(0);

  for (let i = 0; i < n; i++) {
    const row = X[i];
    const target = y[i];
    if (!row || target === undefined) continue;

    for (let j = 0; j < numFeatures; j++) {
      const rowJ = row[j] ?? 0;
      Xty[j] = (Xty[j] ?? 0) + rowJ * target;
      for (let k = 0; k < numFeatures; k++) {
        const rowK = row[k] ?? 0;
        const currentXtX = XtX[j];
        if (currentXtX) {
          currentXtX[k] = (currentXtX[k] ?? 0) + rowJ * rowK;
        }
      }
    }
  }

  // Gaussian elimination with partial pivoting to solve (X^T * X) * beta = X^T * y
  const A = XtX.map((row) => [...row]);
  const b = [...Xty];

  for (let i = 0; i < numFeatures; i++) {
    let maxRow = i;
    for (let k = i + 1; k < numFeatures; k++) {
      const valK = Math.abs(A[k]?.[i] ?? 0);
      const valMax = Math.abs(A[maxRow]?.[i] ?? 0);
      if (valK > valMax) maxRow = k;
    }

    const tempRow = A[i];
    const targetRow = A[maxRow];
    if (tempRow && targetRow) {
      A[i] = targetRow;
      A[maxRow] = tempRow;
    }
    const tempB = b[i];
    const targetB = b[maxRow];
    if (tempB !== undefined && targetB !== undefined) {
      b[i] = targetB;
      b[maxRow] = tempB;
    }

    const diag = A[i]?.[i] ?? 1e-8;
    for (let k = i + 1; k < numFeatures; k++) {
      const rowK = A[k];
      if (!rowK) continue;
      const factor = (rowK[i] ?? 0) / (diag === 0 ? 1e-8 : diag);
      b[k] = (b[k] ?? 0) - factor * (b[i] ?? 0);
      for (let j = i; j < numFeatures; j++) {
        rowK[j] = (rowK[j] ?? 0) - factor * (A[i]?.[j] ?? 0);
      }
    }
  }

  const beta: number[] = Array(numFeatures).fill(0);
  for (let i = numFeatures - 1; i >= 0; i--) {
    let sum = b[i] ?? 0;
    for (let j = i + 1; j < numFeatures; j++) {
      sum -= (A[i]?.[j] ?? 0) * (beta[j] ?? 0);
    }
    const diag = A[i]?.[i] ?? 1e-8;
    beta[i] = sum / (diag === 0 ? 1e-8 : diag);
  }

  const weights: RegressionWeights = {
    intercept: Number((beta[0] ?? 6.2).toFixed(3)),
    reservations: Number((beta[1] ?? 1.35).toFixed(3)),
    weekend: Number((beta[2] ?? 5.8).toFixed(3)),
    rain: Number((beta[3] ?? -3.1).toFixed(3)),
    lunchBias: Number((beta[4] ?? -4.5).toFixed(3)),
  };

  // Evaluate fit metrics on training set
  let sumSquaredError = 0;
  let sumAbsoluteError = 0;
  const meanY = y.reduce((acc, val) => acc + val, 0) / n;
  let totalVariance = 0;

  for (let i = 0; i < n; i++) {
    const row = X[i];
    const actual = y[i];
    if (!row || actual === undefined) continue;

    const isLunch = row[4] ?? 0;
    const predicted =
      weights.intercept +
      weights.reservations * (row[1] ?? 0) +
      weights.weekend * (row[2] ?? 0) +
      weights.rain * (row[3] ?? 0) +
      weights.lunchBias * isLunch;

    const err = actual - predicted;
    sumSquaredError += err * err;
    sumAbsoluteError += Math.abs(err);
    totalVariance += (actual - meanY) * (actual - meanY);
  }

  const rmse = Number(Math.sqrt(sumSquaredError / n).toFixed(2));
  const mae = Number((sumAbsoluteError / n).toFixed(2));
  const rSquared = Number((1 - sumSquaredError / (totalVariance || 1)).toFixed(3));

  const diagnostics: ModelDiagnostics = {
    mae,
    rmse,
    rSquared,
    weights,
    trainingSamples: n,
  };

  return { weights, diagnostics };
}

/** Pre-calculated singleton model trained on historical data. */
export const TRAINED_MODEL = trainRegressionModel();

/**
 * Predict covers given service attributes.
 */
export function predictServiceCovers(
  day: DayOfWeek,
  periodId: ShiftPeriodId,
  reservations24h: number,
  isRainy = 0,
  weights: RegressionWeights = TRAINED_MODEL.weights,
): { predictedCovers: number; lower: number; upper: number } {
  if (day === "mon") {
    return { predictedCovers: 0, lower: 0, upper: 0 };
  }

  const isWeekend = day === "sat" || day === "sun" ? 1 : 0;
  const isLunch = periodId === "lunch" ? 1 : 0;

  const raw =
    weights.intercept +
    weights.reservations * reservations24h +
    weights.weekend * isWeekend +
    weights.rain * isRainy +
    weights.lunchBias * isLunch;

  const predictedCovers = Math.max(0, Math.round(raw));
  const stdError = TRAINED_MODEL.diagnostics.rmse;
  const lower = Math.max(0, Math.round(predictedCovers - 1.96 * stdError));
  const upper = Math.round(predictedCovers + 1.96 * stdError);

  return { predictedCovers, lower, upper };
}

/**
 * Workload translation rule:
 * Maps predicted covers into required headcounts across culinary and service roles.
 */
export function coversToStaffingRequirements(
  covers: number,
  periodId: ShiftPeriodId,
): Record<Role, number> {
  if (covers === 0) {
    return { chef: 0, cook: 0, server: 0, bartender: 0, host: 0, dishwasher: 0 };
  }

  // Kitchen staffing
  const chef = 1;
  const cook = Math.max(1, Math.min(3, Math.ceil(covers / 30)));

  // Dining room staffing
  const server = Math.max(2, Math.min(4, Math.ceil(covers / 24)));
  const bartender = periodId === "dinner" ? (covers > 75 ? 2 : 1) : covers > 50 ? 1 : 0;
  const host = covers >= 60 ? 1 : 0;

  // Stewarding staffing
  const dishwasher = covers > 70 ? 2 : 1;

  return { chef, cook, server, bartender, host, dishwasher };
}

/**
 * Standard weekly forecast scenario for Maison Ardoise.
 * Produces dynamic requirements matching restaurant expectations.
 */
export const FORECAST_SCENARIO_INPUTS: Record<
  DayOfWeek,
  Record<ShiftPeriodId, { reservations: number; isRainy: number }>
> = {
  mon: {
    lunch: { reservations: 0, isRainy: 0 },
    dinner: { reservations: 0, isRainy: 0 },
  },
  tue: {
    lunch: { reservations: 18, isRainy: 0 },
    dinner: { reservations: 32, isRainy: 0 },
  },
  wed: {
    lunch: { reservations: 17, isRainy: 0 },
    dinner: { reservations: 34, isRainy: 0 },
  },
  thu: {
    lunch: { reservations: 22, isRainy: 0 },
    dinner: { reservations: 42, isRainy: 0 },
  },
  fri: {
    lunch: { reservations: 25, isRainy: 0 },
    dinner: { reservations: 58, isRainy: 0 },
  },
  sat: {
    lunch: { reservations: 38, isRainy: 0 },
    dinner: { reservations: 64, isRainy: 0 },
  },
  sun: {
    lunch: { reservations: 35, isRainy: 0 },
    dinner: { reservations: 36, isRainy: 0 },
  },
};

/**
 * Generates the full weekly staffing requirements based on predictive model output.
 */
export function generatePredictedWeeklyRequirements(): {
  requirements: StaffingRequirement[];
  predictions: DemandPrediction[];
} {
  const requirements: StaffingRequirement[] = [];
  const predictions: DemandPrediction[] = [];

  for (const day of DAYS_OF_WEEK) {
    if (day === "mon") continue;

    for (const periodId of ["lunch", "dinner"] as const) {
      const input = FORECAST_SCENARIO_INPUTS[day][periodId];
      const { predictedCovers, lower, upper } = predictServiceCovers(
        day,
        periodId,
        input.reservations,
        input.isRainy,
      );

      const staffing = coversToStaffingRequirements(predictedCovers, periodId);

      predictions.push({
        day,
        periodId,
        predictedCovers,
        confidenceLower: lower,
        confidenceUpper: upper,
        staffing,
      });

      for (const role of ROLES) {
        const count = staffing[role];
        if (count > 0) {
          requirements.push({ day, periodId, role, count });
        }
      }
    }
  }

  return { requirements, predictions };
}
