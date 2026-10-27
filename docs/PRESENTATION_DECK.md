# ShiftPilot AI: Academic Presentation Deck & Speaking Script

* **Course:** SPOC AI for Business
* **Institution:** ESSEC Business School × CentraleSupélec
* **Track:** Advanced AI Algorithms (AAA), Group 84
* **Live Web App:** [https://shiftpilot-ai.vercel.app](https://shiftpilot-ai.vercel.app)
* **GitHub Repository:** [https://github.com/developer-mohanaditya/shiftpilot-ai](https://github.com/developer-mohanaditya/shiftpilot-ai)
* **Video Target Duration:** 5 to 7 minutes total (roughly 60 to 75 seconds per slide)

---

## Team Speaker Allocations

1. **Slide 1 (Executive Overview & Problem):** Mohan Aditya Sadhanala
2. **Slide 2 (Predictive AI: Machine Learning Demand Forecasting):** Oscar Day
3. **Slide 3 (Prescriptive AI: Multi-Objective Genetic Algorithm):** Mohan Aditya Sadhanala
4. **Slide 4 (Benchmark Evaluation: Greedy Baseline vs. AI):** Louise Calmon
5. **Slide 5 (Human-in-the-Loop & Interactive Demonstration):** Suzanne Eck
6. **Slide 6 (Business Impact, Ethics & Strategic Vision):** Taly Ketura Messan

---

## Slide 1: Title & Executive Overview
**Speaker:** Mohan Aditya Sadhanala  
**Target Duration:** ~60 seconds

### Slide Content (What Appears on the Screen)
* **Title:** ShiftPilot AI: Automated Restaurant Staff Scheduling
* **Subtitle:** An End-to-End Pipeline Combining Predictive Machine Learning and Prescriptive Evolutionary Optimization
* **Group 84 Members:**
  * Mohan Aditya Sadhanala
  * Oscar Day
  * Louise Calmon
  * Suzanne Eck
  * Taly Ketura Messan
* **Core Friction in Hospitality:**
  * Labor represents 30% to 38% of total restaurant operating expenses.
  * General managers waste 4 to 8 hours each week building rosters manually on spreadsheets.
  * Static intuition produces persistent overstaffing on quiet days, understaffing during rushes, and frequent labor law violations.
* **The ShiftPilot AI Solution:**
  * Stage 1: Closed-form multivariate regression forecasting guest covers and workstation staffing requirements.
  * Stage 2: Genetic algorithm searching roughly $10^{110}$ possible rosters to maximize shift coverage under qualification, availability, and weekly-hour constraints.

### Speaking Script (Word-for-Word for Mohan)
"Hello everyone. Today our team is presenting ShiftPilot AI, an end-to-end intelligent scheduling system designed specifically for the hospitality industry.

In restaurants, labor is the single most volatile operating expense, typically accounting for over thirty percent of gross revenue. Yet, almost every independent restaurant manager still builds their weekly shift roster by hand on a spreadsheet, burning four to eight hours every Sunday.

This manual approach fails systematically. When managers schedule based on intuition, they end up overstaffed on slow Tuesday lunches, burning cash, and understaffed on busy Saturday evenings, causing slow service and lost revenue. Even worse, managers routinely exceed contractual hour ceilings and double-book staff, creating legal exposure and burnout.

ShiftPilot AI attacks both failures with two coupled AI layers: first, predictive machine learning that forecasts workstation staffing requirements from reservation data and weather; second, prescriptive genetic optimization that searches for a roster respecting each employee's qualifications, availability, and weekly hour ceiling. Let us look at how the predictive layer works."

---

## Slide 2: Predictive Demand Layer (Machine Learning)
**Speaker:** Oscar Day  
**Target Duration:** ~60 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Stage 1: Predictive Demand Forecasting
* **Core Mathematical Model:** Closed-Form Multivariate Linear Regression
  $$\beta = (X^T X)^{-1} X^T y$$
* **Operational Feature Matrix ($X$):**
  * $x_1$: 24-hour-ahead reservation count
  * $x_2$: Weekend indicator (Saturday or Sunday = 1)
  * $x_3$: Rain indicator (rainy service = 1)
  * $x_4$: Service-period indicator (Lunch = 1, Dinner = 0)
* **Target ($y$):** Expected guest covers for each of the 12 open weekly services (Monday closed).
* **Fit on 48 training services:** $R^2 = 0.994$, MAE = 1.34 covers, RMSE = 1.66 covers.
* **Workstation Translation Rules:**
  * Kitchen: 1 Chef; Cooks = $\lceil \text{covers}/30 \rceil$, clamped to 1-3
  * Floor: Servers = $\lceil \text{covers}/24 \rceil$, clamped to 2-4
  * Bar: Dinner ,  2 bartenders above 75 covers, otherwise 1; Lunch ,  1 above 50 covers, otherwise 0
  * Reception: 1 Host when covers $\ge 60$
  * Stewarding: 1 Dishwasher, 2 above 70 covers

### Speaking Script (Word-for-Word for Oscar)
"Thank you Mohan. The foundation of any good schedule is an accurate demand forecast. Instead of using arbitrary rules of thumb, ShiftPilot AI uses multivariate linear regression trained on historical restaurant service data.

Our model maps four signals: the 24-hour-ahead reservation count, a weekend flag, a rain flag, and a lunch-versus-dinner flag. Reservations carry most of the signal; after controlling for them, rain lowers the forecast by about two covers, and dinner runs about two covers above lunch.

Using the closed-form ordinary least squares equation, the model outputs predicted guest covers for all twelve open services. On our 48 training services it fits with an R-squared of 0.994 and a mean absolute error of 1.3 covers.

From those estimates, the system calculates station-by-station requirements. For instance, an eighty-cover dinner service becomes one chef, three cooks, four servers, two bartenders, one host, and two dishwashers.

Once these staffing requirements are set, the challenge shifts to prescriptive optimization: deciding exactly who should work each shift."

---

## Slide 3: Prescriptive Optimization (Genetic Algorithm)
**Speaker:** Mohan Aditya Sadhanala  
**Target Duration:** ~75 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Stage 2: Evolutionary Combinatorial Optimization
* **Problem Complexity:** NP-hard combinatorial search space.
  * 15 team members $\times$ 94 required position slots $\approx 15^{94} \approx 10^{110}$ potential rosters (104 slots after the ML forecast).
* **Chromosome Representation:**
  * Fixed-length array where each gene index is a required shift position and the value is the assigned employee identifier (or empty).
* **Penalty-Weighted Multi-Objective Fitness Function:**
  $$\text{Minimize } \text{Fitness} = \text{LaborCost} + \sum_{k} W_k \cdot V_k$$
  * Uncovered position: 500 penalty
  * Unqualified role: 1,000 penalty
  * Worker unavailable: 800 penalty
  * Double booking in same service: 1,200 penalty
  * Second shift on the same day (when the restaurant disallows double shifts): 600 penalty
  * Hours beyond contract maximum: 50 per hour
  * Hours below contract minimum: 15 per hour
* **Evolutionary Operators:**
  * Seeded population (Greedy individual + random candidates)
  * Tournament selection ($k = 3$)
  * Uniform crossover ($p_c = 0.85$)
  * Stochastic point mutation ($p_m = 0.05$)
  * Elitism ($E = 2$ preserved individuals per generation)

### Speaking Script (Word-for-Word for Mohan)
"Assigning employees to shifts is an NP-hard problem. In our benchmark bistro with fifteen employees and ninety-four required position slots, there are on the order of ten to the one hundred tenth power possible rosters. A brute-force search is mathematically impossible.

To solve this, we implemented a multi-objective genetic algorithm in pure TypeScript. We represent each schedule as a fixed-length chromosome, where each gene corresponds to a required position slot, and the gene value is the assigned employee.

Our fitness function combines payroll with weighted constraint penalties: an uncovered position costs five hundred points, an unavailable worker eight hundred, an unqualified worker one thousand, and a double-booking twelve hundred. Overtime costs fifty points per hour, and falling below a contract minimum costs fifteen. A six-hundred-point term penalises a second shift on the same day when the restaurant disallows double shifts; Maison Ardoise allows them, so that term stays at zero.

The algorithm uses tournament selection with a pool of three, uniform crossover at eighty-five percent, point mutation at five percent, and two elites across sixty generations with a population of forty. It lowers the penalty score from about thirteen thousand seven hundred for the greedy seed to about nine thousand eight hundred in roughly a fifth of a second in the browser."

---

## Slide 4: Benchmark Evaluation (Greedy Baseline vs. AI)
**Speaker:** Louise Calmon  
**Target Duration:** ~75 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Benchmark Evaluation: Greedy Heuristic vs. ShiftPilot AI
* **Experimental Setup:** Maison Ardoise, 15 employees, 94 required position slots across 12 services. Both runs use the default requirement set and a fixed seed (42), so costs and coverage are reproducible; runtime varies by machine.
* **Comparison Table:**

| Metric | Baseline Greedy Heuristic | ShiftPilot Genetic AI | Reading |
| :--- | :--- | :--- | :--- |
| **Weekly Payroll** | 5,118.80 EUR | 5,905.80 EUR | +787.00 EUR / week |
| **Positions Filled** | 78 / 94 (83.0%) | **88 / 94 (93.6%)** | +10 positions covered |
| **Unfilled Positions** | 16 | **6** | 500-point penalty each |
| **Qualification / Availability / Double-Booking Breaches** | 0 | 0 | Both feasible on hard rules |
| **Hours Above Contract Maximum** | 0 | 12 | 50-point penalty per hour |
| **Hours Below Contract Minimum** | 37 | **22** | 15-point penalty per hour |
| **Penalty-Weighted Fitness** | 13,673.80 | **9,835.80** | 28.1% lower |
| **Computation Time** | < 1 ms | **~176 ms** | 60 generations, population 40 |

* **Note for the demonstration:** pressing **Forecast Demand (ML)** replaces the default 94-slot set with 104 ML-derived slots; the figures above are for the default set.
* **Why Greedy Fails:**
  * It assigns the cheapest qualified worker available *right now*, with no lookahead.
  * It exhausts flexible part-time staff early in the week.
  * By Friday and Saturday it leaves 16 positions unfilled and 37 contract hours unallocated.
  * The genetic algorithm fills 10 more positions and nearly halves the under-minimum gap ,  but it pays for that coverage in payroll.

### Speaking Script (Word-for-Word for Louise)
"To evaluate the optimizer, we ran both algorithms on exactly the same data: Maison Ardoise's fifteen employees and ninety-four required position slots across twelve services, with a fixed random seed so the run is reproducible.

The greedy baseline walks the week chronologically and always takes the cheapest qualified employee who is available and still under their hour cap. Because it never looks ahead, it exhausts flexible staff early and finishes with sixteen positions unfilled and thirty-seven contract hours below the minimum.

The genetic algorithm fills eighty-eight of the ninety-four positions ,  ten more than greedy ,  and cuts the under-minimum gap from thirty-seven hours to twenty-two. Its penalty-weighted score is about nine thousand eight hundred against thirteen thousand seven hundred for greedy, a twenty-eight percent improvement.

But look at the payroll column: the genetic schedule costs about seven hundred ninety euros more per week, and it carries twelve hours above the contract maximum. That is deliberate. An unfilled position is penalised five hundred points, while an overtime hour costs only fifty, so under these weights the optimizer buys coverage with payroll. The weights encode policy: shift them toward cost and the optimizer will favour cheaper, leaner rosters. The app makes that trade-off visible instead of hiding it."

---

## Slide 5: Human-in-the-Loop & Interactive Demonstration
**Speaker:** Suzanne Eck  
**Target Duration:** ~60 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Human-in-the-Loop Decision Support
* **Key Interactive Features:**
  * **Live Schedule Grid (`/schedule`):** Interactive visualization showing lunch and dinner slots grouped by service.
  * **Interactive Slot Editor Modal:** Click any employee badge to swap, fill vacancies, or unassign staff with instant qualification, availability, and contract hour checks.
  * **Algorithm Hyperparameter Controls (`/optimization`):** Sliders to tune population size, generations, mutation rate, and tournament size, then re-run to compare the Recharts convergence curve.
  * **Employee Management (`/employees`):** Add or remove staff with custom role tags and weekly availability matrices.
  * **Browser Storage Architecture:** Employee, requirement, and schedule changes persist locally in `localStorage`; no server or account is required.

### Speaking Script (Word-for-Word for Suzanne)
"A critical design principle of ShiftPilot AI is that artificial intelligence should support the manager, not replace their authority. 

In our live web application, hosted on Vercel, managers have complete interactive control. On the schedule page, every shift slot is clickable. If an employee calls in sick or requests time off, the manager clicks their badge to open our assignment editor. The modal immediately highlights who is qualified, who is available, and how many contracted hours each candidate has left.

Managers can also navigate to the optimization page to experiment with the genetic algorithm directly. Using intuitive sliders, they can modify population size, generations, mutation rate, and tournament size, then re-run the comparison and read the resulting convergence curve.

Furthermore, managers can add or remove staff members with custom wages and availability grids. All updates persist locally in the browser's local storage, so the demonstration needs no server, account, or database."

---

## Slide 6: Business Impact, Ethics & Strategic Vision
**Speaker:** Taly Ketura Messan  
**Target Duration:** ~75 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Business Impact, Ethics & Next Steps
* **Core Business Impact:**
  * **Time Savings:** Replaces 4 to 8 hours of weekly spreadsheet work with seconds of computation and a short manager review.
  * **Coverage Gain:** Fills 10 more positions per week than the greedy heuristic (88 vs. 78) and cuts hours below contract minimum from 37 to 22.
  * **Cost Trade-Off:** Under the default weights, that coverage costs 787 EUR more payroll per week; shifting the penalty weights toward cost produces leaner rosters.
  * **Employee Retention:** Predictable rosters and explicit weekly hour ceilings reduce erratic overtime and last-minute reshuffling.
* **Ethical AI Considerations:**
  * Algorithmic transparency: No black-box decisions; every penalty weight, data record, and convergence point is visible in the app.
  * Worker protection: The objective penalises overtime and under-contract hours, so the optimizer's trade-offs are explicit and reviewable.
* **Future Strategic Roadmap:**
  * Direct API integration with Point-of-Sale (POS) systems like Lightspeed and Toast for real-time sales feed ingestion.
  * Mobile employee companion app for shift swaps and digital availability submissions.

### Speaking Script (Word-for-Word for Taly)
"To conclude, ShiftPilot AI delivers tangible business and human value.

From an operational standpoint, it frees restaurant managers from hours of tedious spreadsheet work each week, allowing them to focus on guest hospitality and team leadership. On coverage, the genetic optimizer fills ten more positions per week than the greedy heuristic and cuts under-contract hours from thirty-seven to twenty-two.

That improvement is not free: under the default weights it costs about seven hundred ninety euros more payroll per week. We present that trade-off openly rather than claiming an unconditional saving. The penalty weights are policy, not physics: a restaurant that prioritises labour cost can shift them toward cheaper, leaner rosters, and the app will show the coverage it gives up.

Equally important is the ethical dimension. Unpredictable schedules and chronic overtime are major drivers of the hospitality labour shortage. By penalising overtime and under-contract hours explicitly, ShiftPilot AI makes those trade-offs visible to the manager instead of burying them in a spreadsheet.

Moving forward, our roadmap includes connecting directly to restaurant point-of-sale systems to stream live cover data, and introducing a mobile app for seamless peer-to-peer shift swaps.

Thank you for your time, and we welcome your questions."
