# ShiftPilot AI: Academic Project Description

* **Course:** SPOC AI for Business
* **Institution:** ESSEC Business School × CentraleSupélec
* **Track:** Advanced AI Algorithms (AAA)
* **Group:** Group 84
* **Live Deployment:** [https://shiftpilot-ai.vercel.app](https://shiftpilot-ai.vercel.app)
* **GitHub Repository:** [https://github.com/developer-mohanaditya/shiftpilot-ai](https://github.com/developer-mohanaditya/shiftpilot-ai)

---

## 1. Team Members & Contributions

| Member | Email | Primary Responsibilities |
| :--- | :--- | :--- |
| **Mohan Aditya Sadhanala** | mohanaditya.sadhanala@essec.edu | System architecture, predictive regression model, genetic algorithm optimizer, state persistence, full-stack Next.js deployment. |
| **Oscar Day** | oscar.day@essec.edu | Domain data models, greedy baseline benchmark heuristic, initial UI layout. |
| **Louise Calmon** | louise.calmon@essec.edu | Operations research constraints, French labor law compliance rules, metrics validation. |
| **Suzanne Eck** | suzanne.eck@essec.edu | Hospitality domain scenarios, penalty weight formulations, cost benchmark analysis. |
| **Taly Ketura Messan** | talyketura.messan@essec.edu | User experience testing, walkthrough script, presentation design. |

---

## 2. Business Problem & Operational Context

In the hospitality sector, labor costs typically represent 30% to 38% of total revenue. Restaurant managers spend between 4 and 8 hours every week constructing employee schedules using manual spreadsheets or pen and paper.

This manual workflow causes two recurrent operational failures:
1. **Demand and Staffing Misalignment:** Intuitive guessing leads to overstaffing during slow midweek shifts (inflating payroll overhead) and understaffing during sudden weekend rushes (resulting in slow table turnover and lost covers).
2. **Regulatory & Labor Law Breaches:** In France and the European Union, the Convention Collective Nationale des Hôtels, Cafés et Restaurants (HCR) mandates strict rest periods (minimum 11 consecutive hours between shifts), limits on weekly working hours (typically 35 to 48 hours maximum), and protections against double-booking. Manual schedulers frequently violate these rules, creating legal liabilities and employee burnout.

ShiftPilot AI addresses both challenges with a coupled, two-stage AI architecture:
* **Predictive AI:** Forecasts guest covers and translates expected volume into station staffing needs.
* **Prescriptive AI:** Solves the constrained combinatorial optimization problem of assigning staff to shifts while minimizing payroll and eliminating legal breaches.

---

## 3. Mathematical & Algorithmic Formulation

### A. Predictive Machine Learning (Demand Forecasting)

Rather than relying on static managerial rules of thumb, ShiftPilot AI models guest volume as a function of multiple operational signals.

#### Model Formulation
We implement closed-form multivariate linear regression. The parameter vector $\beta$ is computed analytically via the ordinary least squares (OLS) normal equation:

$$\beta = (X^T X)^{-1} X^T y$$

#### Feature Space ($X$)
1. **Day of Week Index ($x_1 \in [0, 6]$):** Captures weekly cyclicality.
2. **Service Period ($x_2 \in \{0, 1\}$):** Binary indicator representing Lunch (0) vs. Dinner (1).
3. **Reservation Count ($x_3 \in \mathbb{R}^+$):** Pre-booked covers logged in reservation management systems.
4. **Weather Factor ($x_4 \in \{0.85, 1.0, 1.15\}$):** Scalar modifier reflecting adverse weather (heavy rain), neutral weather, or favorable sunny patio conditions.

#### Staffing Demand Conversion
Predicted guest covers $\hat{y}$ are converted into workstation requirements using industry operational ratios:
* **Executive Chef:** 1 required per open service.
* **Line Cooks:** $\lceil \hat{y} / 30 \rceil$
* **Floor Servers:** $\lceil \hat{y} / 22 \rceil$
* **Bartenders:** $\lceil \hat{y} / 45 \rceil$
* **Host / Reception:** 1 required during peak services ($\hat{y} \ge 60$).

---

### B. Prescriptive Optimization (Genetic Algorithm)

Staff scheduling is an NP-hard combinatorial problem. With 15 employees, 6 roles, and 14 weekly services requiring roughly 40 position slots, the brute-force search space contains $15^{40} \approx 10^{47}$ potential schedules.

#### Chromosome Representation
We model a schedule as a fixed-length integer array $C = [g_1, g_2, \dots, g_M]$, where:
* $M$ is the total number of required shift-role slots for the week.
* Each gene $g_i \in \{0, 1, \dots, N-1\}$ represents the index of the employee assigned to slot $i$.

#### Multi-Objective Fitness Evaluation
The objective is to minimize total penalty score:

$$\text{Minimize } F(C) = \text{LaborCost}(C) + \sum_{k} W_k \cdot V_k(C)$$

Where:
* $\text{LaborCost}(C) = \sum_{i=1}^{M} \text{Wage}(g_i) \cdot \text{Duration}(i)$
* $V_k(C)$ represents the count of violations for constraint $k$.
* $W_k$ denotes the penalty weight assigned to constraint $k$:

| Constraint ($k$) | Type | Description | Penalty Weight ($W_k$) |
| :--- | :--- | :--- | :--- |
| Uncovered Slot | Hard | A required station position has no assigned worker. | 500 |
| Role Qualification | Hard | Worker is assigned to a station they are not trained for. | 1,000 |
| Employee Availability | Hard | Worker is assigned during a time they marked unavailable. | 800 |
| Concurrent Double Booking | Hard | Worker is assigned to two positions in the same service. | 1,200 |
| Rest-Period Breach | Hard | Worker is scheduled for dinner followed immediately by next-morning lunch (< 11 hours rest). | 600 |
| Overtime Over Contract | Soft | Total weekly hours exceed employee contract maximum. | 50 per excess hour |

#### Evolutionary Lifecycle
1. **Initialization:** A population of $P$ candidate schedules is initialized with random valid assignments, augmented by one seeded chromosome produced by the greedy baseline heuristic.
2. **Selection:** Tournament selection with pool size $k = 3$. Three candidates are randomly sampled; the candidate with the lowest penalty score wins the right to reproduce.
3. **Crossover:** Uniform crossover with probability $p_c = 0.85$. For each gene slot, an offspring inherits the assignment from parent 1 or parent 2 with equal probability.
4. **Mutation:** Stochastic point mutation with probability $p_m = 0.05$. Mutated genes are replaced with a randomly selected qualified employee.
5. **Elitism:** The top 2 fittest candidate schedules from generation $g$ are preserved directly into generation $g+1$ without modification.

---

### C. Greedy Baseline Benchmark

To rigorously evaluate the Genetic Algorithm, we implemented an operations research greedy baseline heuristic:
1. Sort all required weekly shift slots chronologically from Monday Lunch to Sunday Dinner.
2. For each slot, filter employees who are qualified, available, and not already booked in that shift.
3. Greedily assign the available candidate with the lowest hourly wage rate.

**Why Greedy Fails:** The greedy heuristic lacks lookahead capability. It burns through the lowest-cost flexible staff during quiet weekday lunches. When high-volume weekend dinner services arrive, those employees have exhausted their legal weekly hours, forcing the scheduler into either understaffing or massive overtime penalties.

---

## 4. Benchmark Performance & Validation

Testing was conducted using Maison Ardoise, a realistic Parisian bistro benchmark dataset comprising 15 employees and 14 weekly services (Lunch: 11:30 to 15:30, Dinner: 18:30 to 23:30).

| Evaluation Metric | Manual Roster | Greedy Baseline | ShiftPilot Genetic AI | Net Benefit |
| :--- | :--- | :--- | :--- | :--- |
| **Weekly Payroll Spend** | ~3,250.00 EUR | 2,740.00 EUR | **2,398.50 EUR** | **341.50 EUR / week saved (-12.5%)** |
| **Annualized Savings** | Baseline | Reference | **17,758 EUR / year** | Direct bottom-line improvement |
| **Shift Slot Coverage** | Incomplete | 100% (42/42) | **100% (42/42)** | Zero unmanned stations |
| **Constraint Breaches** | 2 to 4 typical | 3 breaches (rest windows & caps) | **0 breaches** | 100% labor law compliance |
| **Solver Execution Time** | 4 to 8 hours | 4 ms | **48 ms (60 generations)** | Instant execution in browser |
| **Hyperparameter Tuning** | None | None | **Interactive (pop, gen, mut, tour)** | User-guided convergence |
| **Manual Adjustability** | Unchecked | None | **Live slot editor + rule checks** | Manager operational control |

---

## 5. Software Architecture & Implementation

* **Full-Stack Framework:** Next.js 16 (App Router) with React 19.
* **Deterministic Computations:** All predictive linear algebra and evolutionary algorithms are written in pure TypeScript with zero browser or server dependencies, ensuring reproducible execution across environments.
* **Reactive Local Storage:** Custom `useSyncExternalStore` store providing immediate UI updates and browser `localStorage` persistence without requiring external database provisioning.
* **Interactive Data Visualization:** Recharts components plotting 8-week reservation regression trends and generation-by-generation genetic convergence curves.
* **Quality & Validation:** Enforces strict TypeScript mode (`next typegen && tsc --noEmit`), ESLint checks, and production builds (`npm run check`).

---

## 6. Academic Reflection & Ethical Considerations

1. **Human-in-the-Loop Design:** ShiftPilot AI is designed as decision support, not unmonitored automation. The manual slot editing feature empowers managers to adjust assignments while receiving immediate visual feedback on constraint impacts.
2. **Worker Well-Being & Fairness:** Traditional restaurant scheduling frequently penalizes part-time staff with erratic split shifts. By incorporating rest-period penalties and maximum hour limits into the core fitness function, the optimizer explicitly protects employee health and work-life balance.
3. **Algorithmic Transparency:** The application exposes its convergence curves, operational dataset exports, and hyperparameter controls directly to users, avoiding opaque black-box decisions.
