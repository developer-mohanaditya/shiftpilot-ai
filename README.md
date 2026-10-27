# ShiftPilot AI Lite

Weekly staff scheduling for a restaurant. A manager defines employees (roles, hourly
rates, availability, weekly hour limits) and staffing requirements per service. The app
builds a schedule with a simple greedy baseline and with a genetic algorithm, then compares
the two on metrics computed from the actual schedules.

University project, Advanced AI Algorithms. All people and figures in the sample data are
fictional.

> **About the genetic algorithm.** It is a heuristic optimisation method, not machine
> learning: it does not learn from data, and it does not guarantee a globally optimal
> schedule. Every result shown in the app is calculated from the schedules it produces.

## Stack

- Next.js (App Router) and TypeScript in strict mode
- Tailwind CSS v4 and shadcn/ui components (Radix primitives)
- Recharts for charts
- Scheduling algorithms in plain TypeScript, with no UI dependencies
- Browser `localStorage` for persistence; no database, auth or external APIs
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

Adding more shadcn/ui components works as usual, e.g. `npx shadcn@latest add dialog`.

## Project structure

```
src/
  app/                    Routes (App Router). Pages compose components; no business logic.
    page.tsx              Dashboard
    employees/page.tsx
    schedule/page.tsx
    optimization/page.tsx
  components/
    ui/                   shadcn/ui primitives (button, card, badge, …)
    layout/               App shell, navigation, page header
    dashboard/, employees/ Feature components
  domain/                 Framework-free model: types, labels, demand calculations
  data/                   Sample restaurant (Maison Ardoise)
  algorithms/             (milestone 3+) evaluation, baseline, genetic algorithm
  store/                  (milestone 2) localStorage-backed app state
  lib/                    Formatting, styling helpers
```

Dependency direction: `app → components → store → algorithms → domain`. The `domain` and
`algorithms` folders never import React or browser APIs, so they can be unit-tested and
explained on their own.

## Data model

Defined in `src/domain/types.ts`.

- **Shift**: a day plus a service period (lunch 11:00–15:00, dinner 18:00–23:00).
- **Employee**: roles they are trained for (first is primary), hourly rate, min/max weekly
  hours, and availability per day and period.
- **StaffingRequirement**: how many people of a role a shift needs.
- **ShiftAssignment**: one employee working one role in one shift.
- **Schedule**: a list of assignments, tagged with the algorithm that produced it.
- **ScheduleMetrics**: labour cost, hours, coverage, under/overstaffing and constraint
  violations, all derived from a schedule.
- **OptimizationRun / OptimizationComparison**: a schedule, its metrics, fitness, runtime and
  (for the genetic algorithm) parameters and convergence history.

## Milestones

1. **Foundation and shell** (done): project setup, design tokens, domain types, sample data,
   four pages reading sample data.
2. **Persistence and employees**: localStorage store with versioning and reset, add/edit/remove
   employees with validation.
3. **Evaluation and baseline**: metrics and fitness function, greedy baseline, weekly calendar
   on the Schedule page, unit tests.
4. **Genetic algorithm and comparison**: seeded GA, comparison page with metrics table and
   convergence chart.
5. **Dashboard and polish**: dashboard wired to real schedule metrics, responsive QA, final
   deployment.
