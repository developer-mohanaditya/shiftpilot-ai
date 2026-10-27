# ShiftPilot AI Lite

Weekly staff scheduling for a restaurant powered by an end-to-end AI pipeline:
1. **Predictive AI (Machine Learning):** Multivariate regression forecasting guest covers and dynamically deriving staffing requirements based on historical patterns, reservations, and weather.
2. **Prescriptive AI (Genetic Algorithm):** Evolutionary multi-objective optimizer minimizing payroll spend while strictly respecting labor laws, rest periods, and worker availability against a greedy baseline.

University project, Advanced AI Algorithms (AAA) track at ESSEC × CentraleSupélec.

## Authors & Team

- **Mohan Aditya Sadhanala** (b00837949@essec.edu): System architecture, predictive demand ML forecasting, optimization algorithms, and scheduling engine
- **Oscar Day** (oscar.day@essec.edu): Frontend foundation, domain types, and base UI shell

## Stack

- Next.js (App Router) and TypeScript in strict mode
- Tailwind CSS v4 and shadcn/ui components (Radix primitives)
- Recharts for convergence and demand visualization
- Pure TypeScript algorithms with zero browser/React dependencies
- Reactive client store with localStorage persistence
- Deployed on Vercel from GitHub

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Development server with hot reload              |
| `npm run build`     | Production build (what Vercel runs)             |
| `npm run start`     | Serve the production build                      |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | TypeScript type check without emitting files    |
| `npm run check`     | Lint, type check and build; run before each push |

## Project structure

```
src/
  app/                    Routes (App Router). Pages compose components; no business logic.
    page.tsx              Dashboard
    employees/page.tsx
    schedule/page.tsx
    optimization/page.tsx
  components/
    ui/                   shadcn/ui primitives (button, card, badge)
    layout/               App shell, navigation, page header
    dashboard/, employees/ Feature components
  domain/                 Framework-free model: types, labels, predictive ML regression
  data/                   Sample restaurant (Maison Ardoise)
  algorithms/             Fitness evaluation, greedy baseline, genetic algorithm
  store/                  State store with localStorage persistence
  lib/                    Formatting, styling helpers
```

## AI Pipeline Architecture

- **Predictive Demand Layer (`src/domain/demand-ml.ts`):** Closed-form multivariate regression model trained on 8 weeks of service logs. Maps service periods, reservation pacing, and weather to expected guest covers and station staffing counts.
- **Evaluation Engine (`src/algorithms/metrics.ts`):** Calculates gross payroll spend and penalty functions for constraint breaches: unqualified roles, unavailable shifts, double bookings, rest-period violations, and overtime.
- **Baseline Benchmark (`src/algorithms/baseline.ts`):** Chronological single-pass heuristic assigning lowest wage qualified staff.
- **Genetic Algorithm (`src/algorithms/genetic.ts`):** Chromosome encoding per shift slot, seeded baseline individual, tournament selection, uniform crossover, stochastic mutation, and elitism across 60 generations.
