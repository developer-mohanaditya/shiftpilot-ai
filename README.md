# ShiftPilot AI

Weekly restaurant staff scheduling powered by an end-to-end artificial intelligence pipeline:
1. **Predictive AI (Machine Learning):** Closed-form multivariate linear regression forecasting guest covers and dynamically translating demand into station staffing requirements based on historical service logs, reservations, and weather.
2. **Prescriptive AI (Genetic Algorithm):** Evolutionary multi-objective optimizer minimizing weekly payroll spend while strictly enforcing labor law constraints (rest intervals, contract limits, station coverage, and role qualifications) against a greedy baseline benchmark.

**University Project:** SPOC AI for Business, Advanced AI Algorithms (AAA) Track, Group 84 at ESSEC × CentraleSupélec.

* **Live Application:** [https://shiftpilot-ai.vercel.app](https://shiftpilot-ai.vercel.app)
* **GitHub Repository:** [https://github.com/developer-mohanaditya/shiftpilot-ai](https://github.com/developer-mohanaditya/shiftpilot-ai)
* **Academic Project Description:** [docs/PROJECT_DESCRIPTION.md](docs/PROJECT_DESCRIPTION.md)
* **AI Prompt & Transparency Log:** [docs/AI_TRANSPARENCY_LOG.md](docs/AI_TRANSPARENCY_LOG.md)

---

## Authors & Group 84 Team

* **Mohan Aditya Sadhanala** (Architecture, Predictive Demand ML Forecasting, Genetic Algorithm Engine, Full-Stack Next.js Implementation)
* **Oscar Day** (Domain Data Types, Operations Research Baseline Heuristic, Base UI Shell)
* **Louise Calmon** (Constraint Modeling, French Labor Law Compliance Validation, Benchmark Metrics)
* **Suzanne Eck** (Hospitality Operational Scenarios, Rest-Window Penalty Formulations, Cost Analysis)
* **Taly Ketura Messan** (User Experience Design, Scenario Testing, Demonstration Video)

---

## Algorithmic Architecture

### 1. Predictive Demand Layer (Machine Learning)
* **Technique:** Multivariate Linear Regression with closed-form matrix solution:
  `Beta = (X^T * X)^(-1) * X^T * y`
* **Features:** Day of week index, service period (lunch vs. dinner), pre-booked reservation pacing, and weather condition factor.
* **Staffing Translation:** Forecasted covers are dynamically converted into station staffing requirements:
  * Kitchen: 1 Chef plus 1 Cook per 30 covers.
  * Front of House: 1 Server per 22 covers, 1 Bartender per 45 covers, and 1 Host per service.
* **Source:** [`src/domain/demand-ml.ts`](src/domain/demand-ml.ts)

### 2. Prescriptive Scheduling Engine (Genetic Algorithm)
* **Technique:** Multi-Objective Evolutionary Algorithm (MOEA).
* **Chromosome Representation:** Fixed-length gene sequence where each index represents a required station shift slot, and each value maps to an employee index.
* **Penalty-Weighted Fitness Function:**
  `Fitness = PayrollCost + (P_uncovered * 500) + (P_unavailable * 800) + (P_unqualified * 1000) + (P_doubleBooked * 1200) + (P_doubleShift * 600) + (HoursOverMax * 50)`
* **Evolutionary Operators:**
  * **Seeded Initialization:** Combines random candidate schedules with a greedy baseline individual.
  * **Tournament Selection:** $k = 3$ tournament selection with configurable selection pressure.
  * **Uniform Crossover:** Crossover rate of 85% to preserve beneficial shift pairings.
  * **Stochastic Mutation:** Configurable mutation rate (1% to 20%, default 5%) reassigning genes to qualified alternatives.
  * **Elitism:** The top 2 fittest candidate schedules survive unchanged across generations.
* **Source:** [`src/algorithms/genetic.ts`](src/algorithms/genetic.ts) and [`src/algorithms/metrics.ts`](src/algorithms/metrics.ts)

### 3. Baseline Benchmark (Greedy Heuristic)
* **Mechanism:** Single-pass chronological heuristic assigning the lowest wage qualified worker available.
* **Operational Flaw:** Demonstrates why greedy heuristics fail in staff scheduling. Lacking forward visibility, it exhausts low-cost staff early in the week, creating severe gaps or forced overtime on Friday and Saturday dinner services.
* **Source:** [`src/algorithms/baseline.ts`](src/algorithms/baseline.ts)

---

## Experimental Benchmark Results

Evaluated on a verified 15-employee bistro roster (Maison Ardoise, Paris) across 14 weekly services:

| Operational Metric | Manual Planning | Greedy Baseline Heuristic | ShiftPilot Genetic AI | Net Advantage |
| :--- | :--- | :--- | :--- | :--- |
| **Weekly Payroll** | ~3,250 EUR | 2,740 EUR | **2,398.50 EUR** | **341.50 EUR saved / week (-12.5%)** |
| **Shift Coverage** | Variable | 100% | **100%** | Full coverage across all stations |
| **Labor Law Breaches** | 2 to 4 frequent | 3 violations (rest gaps/hours) | **0 violations** | 100% compliant with labor regulations |
| **Computation Time** | 4 to 8 hours | 4 ms | **48 ms (60 generations)** | Real-time browser execution |
| **Manager Flexibility** | Spreadsheet trial & error | Rigid assignment | **Manual slot fine-tuning + live checks** | Instant violation feedback |

---

## Key Features

* **Predictive Demand Forecasting:** Run linear regression on 8 weeks of historical covers, reservations, and weather to derive staffing needs.
* **Evolutionary Hyperparameter Controls:** Interactively adjust population size (10 to 100), generations (10 to 120), mutation rate (1% to 20%), and tournament size (2 to 6) on the Optimization page with real-time convergence plotting.
* **Manual Roster Slot Fine-Tuning:** Click any assigned staff member or vacant shift to reassign or unassign employees, with real-time diagnostics on qualifications, availability, and weekly contract hours.
* **Employee Management:** Add, configure, and delete staff with custom roles, wage rates, and availability grids. All data persists in browser `localStorage`.
* **Operational Datasets Explorer:** Download full CSV exports for raw historical covers, employee rosters, and station staffing requirements.

---

## Tech Stack

* **Framework:** Next.js 16 (App Router), React 19
* **Language:** TypeScript (strict mode, zero build warnings)
* **Styling & Components:** Tailwind CSS v4, shadcn/ui primitives, Lucide icons
* **Data Visualization:** Recharts (covers pacing and genetic convergence curves)
* **Algorithms:** Pure TypeScript with zero browser dependencies
* **Storage & State:** Reactive external store with `localStorage` persistence
* **Deployment:** Vercel Continuous Deployment connected to GitHub

---

## Getting Started Locally

Requires Node.js 20.9 or later.

```bash
# Clone the repository
git clone https://github.com/developer-mohanaditya/shiftpilot-ai.git
cd shiftpilot-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Verification Scripts

```bash
npm run lint         # Run ESLint rules
npm run typecheck    # Validate TypeScript types
npm run build        # Build production bundle
npm run check        # Run lint, typecheck, and build in sequence
```
