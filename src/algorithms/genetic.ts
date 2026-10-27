import {
  type ConvergencePoint,
  type Employee,
  type GeneticAlgorithmParams,
  type OptimizationRun,
  type Restaurant,
  type Schedule,
  type ShiftAssignment,
  type StaffingRequirement,
} from "@/domain/types";
import { calculateFitness, evaluateSchedule } from "./metrics";
import { runBaseline } from "./baseline";

export const DEFAULT_GA_PARAMS: GeneticAlgorithmParams = {
  populationSize: 40,
  generations: 60,
  crossoverRate: 0.85,
  mutationRate: 0.05,
  eliteCount: 2,
  tournamentSize: 3,
  seed: 42,
};

interface PositionSlot {
  index: number;
  day: StaffingRequirement["day"];
  periodId: StaffingRequirement["periodId"];
  role: StaffingRequirement["role"];
}

/**
 * Deterministic PRNG (Mulberry32) for reproducible optimization runs.
 */
function createPrng(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Expands staffing requirements into an ordered list of individual position slots.
 */
export function buildPositionSlots(requirements: StaffingRequirement[]): PositionSlot[] {
  const slots: PositionSlot[] = [];
  let index = 0;
  for (const req of requirements) {
    for (let i = 0; i < req.count; i++) {
      slots.push({
        index,
        day: req.day,
        periodId: req.periodId,
        role: req.role,
      });
      index++;
    }
  }
  return slots;
}

type Chromosome = Array<string | null>;

function chromosomeToAssignments(
  slots: PositionSlot[],
  chromosome: Chromosome,
): ShiftAssignment[] {
  const assignments: ShiftAssignment[] = [];
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const empId = chromosome[i];
    if (slot && empId) {
      assignments.push({
        day: slot.day,
        periodId: slot.periodId,
        role: slot.role,
        employeeId: empId,
      });
    }
  }
  return assignments;
}

/**
 * Genetic Algorithm for optimal staff scheduling:
 * Minimizes total labor costs while enforcing labor laws, rest periods,
 * and contract hours through multi-objective penalty optimization.
 */
export function runGeneticAlgorithm(
  restaurant: Restaurant,
  employees: Employee[],
  requirements: StaffingRequirement[],
  customParams?: Partial<GeneticAlgorithmParams>,
): OptimizationRun {
  const startTime = performance.now();
  const params: GeneticAlgorithmParams = { ...DEFAULT_GA_PARAMS, ...customParams };
  const random = createPrng(params.seed);

  const slots = buildPositionSlots(requirements);
  const numGenes = slots.length;

  // Precompute candidate employees per slot (trained in role and available)
  const candidatePoolBySlot: string[][] = slots.map((slot) => {
    const qualified = employees.filter(
      (e) =>
        e.roles.includes(slot.role) &&
        (e.availability[slot.day] ?? []).includes(slot.periodId),
    );
    if (qualified.length > 0) {
      return qualified.map((e) => e.id);
    }
    // Fallback to all employees trained in role
    const trained = employees.filter((e) => e.roles.includes(slot.role));
    return trained.length > 0 ? trained.map((e) => e.id) : employees.map((e) => e.id);
  });

  // Evaluate candidate chromosome
  function evaluateChromosome(chromo: Chromosome): {
    fitness: number;
    assignments: ShiftAssignment[];
  } {
    const assignments = chromosomeToAssignments(slots, chromo);
    const metrics = evaluateSchedule(restaurant, employees, requirements, assignments);
    const fitness = calculateFitness(metrics);
    return { fitness, assignments };
  }

  // Population initialization
  let population: Chromosome[] = [];

  // Seed 1: inject baseline greedy solution into population
  const baselineSolution = runBaseline(restaurant, employees, requirements);
  const baselineChromo: Chromosome = new Array(numGenes).fill(null);
  const baselineAssignments = [...baselineSolution.schedule.assignments];

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (!slot) continue;
    const matchIdx = baselineAssignments.findIndex(
      (a) => a.day === slot.day && a.periodId === slot.periodId && a.role === slot.role,
    );
    if (matchIdx !== -1) {
      const match = baselineAssignments[matchIdx];
      if (match) {
        baselineChromo[i] = match.employeeId;
        baselineAssignments.splice(matchIdx, 1);
      }
    }
  }
  population.push(baselineChromo);

  // Initialize remaining individuals randomly from candidates
  while (population.length < params.populationSize) {
    const chromo: Chromosome = new Array(numGenes);
    for (let i = 0; i < numGenes; i++) {
      const pool = candidatePoolBySlot[i];
      if (pool && pool.length > 0) {
        const choice = pool[Math.floor(random() * pool.length)];
        chromo[i] = choice ?? null;
      } else {
        chromo[i] = null;
      }
    }
    population.push(chromo);
  }

  const convergence: ConvergencePoint[] = [];

  // Evolution loop
  for (let gen = 0; gen < params.generations; gen++) {
    // Score all individuals
    const scored = population.map((chromo) => {
      const { fitness } = evaluateChromosome(chromo);
      return { chromo, fitness };
    });

    // Sort by fitness ascending (lowest penalty is best)
    scored.sort((a, b) => a.fitness - b.fitness);

    const bestFitness = scored[0]?.fitness ?? 0;
    const averageFitness = Number(
      (scored.reduce((sum, item) => sum + item.fitness, 0) / scored.length).toFixed(2),
    );

    convergence.push({
      generation: gen,
      bestFitness,
      averageFitness,
    });

    // Tournament selection helper
    function selectParent(): Chromosome {
      let best = scored[Math.floor(random() * scored.length)];
      for (let t = 1; t < params.tournamentSize; t++) {
        const contender = scored[Math.floor(random() * scored.length)];
        if (contender && (!best || contender.fitness < best.fitness)) {
          best = contender;
        }
      }
      return best?.chromo ?? population[0]!;
    }

    const nextPopulation: Chromosome[] = [];

    // Elitism: carry over top individuals unchanged
    for (let e = 0; e < params.eliteCount && e < scored.length; e++) {
      const elite = scored[e];
      if (elite) nextPopulation.push([...elite.chromo]);
    }

    // Breed remainder of new population
    while (nextPopulation.length < params.populationSize) {
      const parentA = selectParent();
      const parentB = selectParent();

      let childA: Chromosome = [...parentA];
      let childB: Chromosome = [...parentB];

      // Crossover
      if (random() < params.crossoverRate) {
        childA = new Array(numGenes);
        childB = new Array(numGenes);
        for (let g = 0; g < numGenes; g++) {
          if (random() < 0.5) {
            childA[g] = parentA[g] ?? null;
            childB[g] = parentB[g] ?? null;
          } else {
            childA[g] = parentB[g] ?? null;
            childB[g] = parentA[g] ?? null;
          }
        }
      }

      // Mutation
      for (let g = 0; g < numGenes; g++) {
        if (random() < params.mutationRate) {
          const pool = candidatePoolBySlot[g];
          if (pool && pool.length > 0) {
            childA[g] = pool[Math.floor(random() * pool.length)] ?? null;
          }
        }
        if (random() < params.mutationRate) {
          const pool = candidatePoolBySlot[g];
          if (pool && pool.length > 0) {
            childB[g] = pool[Math.floor(random() * pool.length)] ?? null;
          }
        }
      }

      nextPopulation.push(childA);
      if (nextPopulation.length < params.populationSize) {
        nextPopulation.push(childB);
      }
    }

    population = nextPopulation;
  }

  // Final evaluation of best chromosome
  const finalScored = population.map((chromo) => {
    const evaluated = evaluateChromosome(chromo);
    return { chromo, ...evaluated };
  });
  finalScored.sort((a, b) => a.fitness - b.fitness);

  const bestResult = finalScored[0]!;
  const metrics = evaluateSchedule(
    restaurant,
    employees,
    requirements,
    bestResult.assignments,
  );
  const runtimeMs = Number((performance.now() - startTime).toFixed(2));

  const schedule: Schedule = {
    id: `sched-genetic-${Date.now()}`,
    source: "genetic",
    createdAt: new Date().toISOString(),
    assignments: bestResult.assignments,
  };

  return {
    algorithm: "genetic",
    schedule,
    metrics,
    fitness: bestResult.fitness,
    runtimeMs,
    params,
    convergence,
  };
}
