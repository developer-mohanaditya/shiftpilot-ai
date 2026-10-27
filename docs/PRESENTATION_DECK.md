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
6. **Slide 6 (Business Impact, Legal Compliance & Strategic Vision):** Taly Ketura Messan

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
  * Stage 2: Genetic algorithm searching across $10^{47}$ possibilities to eliminate legal breaches and trim payroll costs.

### Speaking Script (Word-for-Word for Mohan)
"Hello everyone. Today our team is presenting ShiftPilot AI, an end-to-end intelligent scheduling system designed specifically for the hospitality industry.

In restaurants, labor is the single most volatile operating expense, typically accounting for over thirty percent of gross revenue. Yet, almost every independent restaurant manager still builds their weekly shift roster by hand on a spreadsheet, burning four to eight hours every Sunday.

This manual approach fails systematically. When managers schedule based on intuition, they end up overstaffed on slow Tuesday lunches, burning cash, and understaffed on busy Saturday evenings, causing slow service and lost revenue. Even worse, managers frequently breach labor laws, such as mandatory eleven-hour rest gaps between consecutive shifts.

ShiftPilot AI solves this by coupling two distinct AI layers: first, predictive machine learning that forecasts exact workstation staffing requirements from reservation data and weather; second, prescriptive genetic optimization that builds a compliant, lowest-cost roster in under fifty milliseconds. Let us look at how the predictive layer works."

---

## Slide 2: Predictive Demand Layer (Machine Learning)
**Speaker:** Oscar Day  
**Target Duration:** ~60 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Stage 1: Predictive Demand Forecasting
* **Core Mathematical Model:** Closed-Form Multivariate Linear Regression
  $$\beta = (X^T X)^{-1} X^T y$$
* **Operational Feature Matrix ($X$):**
  * $x_1$: Day of the week index (Monday = 0 to Sunday = 6)
  * $x_2$: Service period binary indicator (Lunch = 0, Dinner = 1)
  * $x_3$: Pre-booked reservation volume
  * $x_4$: Weather factor (0.85 for rain, 1.00 standard, 1.15 sunny patio demand)
* **Target ($y$):** Expected guest covers for each of the 14 weekly services.
* **Workstation Translation Ratios:**
  * Kitchen: 1 Executive Chef + 1 Line Cook per 30 covers
  * Floor: 1 Server per 22 covers
  * Bar: 1 Bartender per 45 covers
  * Reception: 1 Host during high-volume services ($\ge 60$ covers)

### Speaking Script (Word-for-Word for Oscar)
"Thank you Mohan. The foundation of any good schedule is an accurate demand forecast. Instead of using arbitrary rules of thumb, ShiftPilot AI uses multivariate linear regression trained on historical restaurant service data.

Our model maps four primary operational signals: the day of the week, the service period (lunch versus dinner), real-time reservation counts, and expected weather conditions. For example, rainy weather reduces expected foot traffic, while sunny weekend forecasts increase outdoor terrace volume by fifteen percent.

Using the closed-form ordinary least squares equation, the model outputs predicted guest covers for all fourteen services across the week.

From these cover estimates, the system dynamically calculates station-by-station requirements. For instance, an eighty-cover dinner service translates mathematically into one executive chef, three line cooks, four floor servers, two bartenders, and one host.

Once these staffing requirements are set, the challenge shifts to prescriptive optimization: deciding exactly who should work each shift."

---

## Slide 3: Prescriptive Optimization (Genetic Algorithm)
**Speaker:** Mohan Aditya Sadhanala  
**Target Duration:** ~75 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Stage 2: Evolutionary Combinatorial Optimization
* **Problem Complexity:** NP-hard combinatorial search space.
  * 15 team members $\times$ 42 weekly shift slots $\approx 15^{42} \approx 10^{49}$ potential schedules.
* **Chromosome Representation:**
  * Fixed-length integer array where each gene index represents a specific required shift position, and the value represents the assigned employee ID.
* **Penalty-Weighted Multi-Objective Fitness Function:**
  $$\text{Minimize } \text{Fitness} = \text{LaborCost} + \sum_{k} W_k \cdot V_k$$
  * Uncovered slot: 500 penalty
  * Unqualified role: 1,000 penalty
  * Worker unavailable: 800 penalty
  * Double booking in same service: 1,200 penalty
  * Rest-period violation (< 11h between dinner and lunch): 600 penalty
  * Overtime beyond contract maximum: 50 per hour
* **Evolutionary Operators:**
  * Seeded population (Greedy individual + random candidates)
  * Tournament selection ($k = 3$)
  * Uniform crossover ($p_c = 0.85$)
  * Stochastic point mutation ($p_m = 0.05$)
  * Elitism ($E = 2$ preserved individuals per generation)

### Speaking Script (Word-for-Word for Mohan)
"Assigning employees to shifts is an NP-hard problem. In our benchmark Parisian bistro with fifteen employees and forty-two weekly shift positions, there are over ten to the forty-ninth power possible schedule combinations. A brute force search is mathematically impossible.

To solve this, we implemented a multi-objective genetic algorithm in pure TypeScript. We represent each schedule as an integer chromosome, where each gene corresponds to an individual shift slot, and the gene value is the assigned employee.

Our fitness function balances two competing priorities: minimizing total payroll expense while aggressively penalizing constraint violations. Hard constraints like assigning someone during their blackout hours or scheduling an unqualified cook to bartend receive severe penalty weights. Crucially, we enforce European labor law by assigning a six-hundred-point penalty if an employee works a closing dinner and an opening lunch the next morning, violating the legal eleven-hour rest period.

The algorithm uses tournament selection, uniform crossover, stochastic mutation, and elitism across sixty generations. It converges to an optimal, zero-violation schedule in less than fifty milliseconds directly in the browser."

---

## Slide 4: Benchmark Evaluation (Greedy Baseline vs. AI)
**Speaker:** Louise Calmon  
**Target Duration:** ~60 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Benchmark Evaluation: Greedy Heuristic vs. ShiftPilot AI
* **Experimental Setup:** Tested on Maison Ardoise (Paris bistro benchmark: 15 staff, 14 services).
* **Comparison Table:**

| Metric | Manual Schedule | Baseline Greedy Heuristic | ShiftPilot Genetic AI | Operational Gain |
| :--- | :--- | :--- | :--- | :--- |
| **Weekly Payroll** | ~3,250 EUR | 2,740.00 EUR | **2,398.50 EUR** | **-12.5% (-341.50 EUR / wk)** |
| **Annual Payroll Savings** | Baseline | Reference | **17,758 EUR / year** | Pure bottom-line profit |
| **Slot Coverage** | Inconsistent | 100% (42/42) | **100% (42/42)** | Full coverage across all services |
| **Legal Breaches** | 2 to 4 typical | 3 violations | **0 violations** | 100% labor compliance |
| **Computation Speed** | 4 to 8 hours | 4 ms | **48 ms** | Real-time optimization |

* **Why Greedy Fails:**
  * The greedy algorithm simply picks the cheapest qualified worker available right now.
  * It burns flexible part-time workers early in the week.
  * By Friday and Saturday night, cheap staff hit legal hour ceilings, forcing expensive overtime or understaffing.

### Speaking Script (Word-for-Word for Louise)
"To demonstrate the superiority of our genetic optimizer, we benchmarked it against both traditional manual scheduling and a classic operations research greedy heuristic.

A greedy algorithm makes the locally optimal choice at each step, assigning whichever available qualified employee has the lowest hourly rate. While fast, the greedy heuristic has no forward planning. It burns through the lowest-cost, flexible team members during quiet Monday and Tuesday lunches. When the busy weekend arrives, those workers have hit their legal weekly limits, forcing the manager into expensive overtime and legal rest-period breaches.

As shown in our benchmark results on the screen, ShiftPilot AI outperforms the greedy heuristic significantly. It delivers one hundred percent coverage with zero labor law violations, compared to three violations in the greedy schedule.

Financially, ShiftPilot AI reduces weekly payroll from two thousand seven hundred and forty euros to two thousand three hundred and ninety-eight euros. That is a net savings of three hundred and forty-one euros per week, or seventeen thousand seven hundred euros annually for a single bistro."

---

## Slide 5: Human-in-the-Loop & Interactive Demonstration
**Speaker:** Suzanne Eck  
**Target Duration:** ~60 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Human-in-the-Loop Decision Support
* **Key Interactive Features:**
  * **Live Schedule Grid (`/schedule`):** Interactive visualization showing lunch and dinner slots grouped by service.
  * **Interactive Slot Editor Modal:** Click any employee badge to swap, fill vacancies, or unassign staff with instant qualification, availability, and contract hour checks.
  * **Algorithm Hyperparameter Controls (`/optimization`):** Sliders to tune population size, generations, mutation rate, and tournament size with real-time Recharts convergence graphing.
  * **Employee Management (`/employees`):** Add or remove staff with custom role tags and weekly availability matrices.
  * **Browser Storage Architecture:** Fully functional with local persistence without requiring complex database configurations.

### Speaking Script (Word-for-Word for Suzanne)
"A critical design principle of ShiftPilot AI is that artificial intelligence should support the manager, not replace their authority. 

In our live web application, hosted on Vercel, managers have complete interactive control. On the schedule page, every shift slot is clickable. If an employee calls in sick or requests time off, the manager clicks their badge to open our assignment editor. The modal immediately highlights who is qualified, who is available, and how many contracted hours each candidate has left.

Managers can also navigate to the optimization page to experiment with the genetic algorithm directly. Using intuitive sliders, they can modify population size, generations, and mutation rates, watching the convergence curve update in real time.

Furthermore, managers can add or remove staff members with customized hourly wages and availability grids. All updates persist securely in the browser's local storage, providing an instant, friction-free demonstration without requiring external database setups."

---

## Slide 6: Business Impact, Compliance & Strategic Vision
**Speaker:** Taly Ketura Messan  
**Target Duration:** ~60 seconds

### Slide Content (What Appears on the Screen)
* **Title:** Business Impact, Ethics & Next Steps
* **Core Business Impact:**
  * **Time Savings:** Reduces weekly scheduling time from 6 hours to under 5 minutes.
  * **Direct ROI:** Saves over 17,000 EUR per restaurant annually through smarter labor allocation.
  * **Employee Retention:** Predictable rosters, fair distribution of weekend shifts, and guaranteed 11-hour rest intervals reduce hospitality turnover.
* **Ethical AI Considerations:**
  * Algorithmic transparency: No black box decisions; constraint penalties and convergence metrics are explicitly visible.
  * Worker protection: Soft constraints prevent fatigue and excessive overtime.
* **Future Strategic Roadmap:**
  * Direct API integration with Point-of-Sale (POS) systems like Lightspeed and Toast for real-time sales feed ingestion.
  * Mobile employee companion app for shift swaps and digital availability submissions.

### Speaking Script (Word-for-Word for Taly)
"To conclude, ShiftPilot AI delivers tangible business and human value.

From an operational standpoint, it frees restaurant managers from six hours of tedious spreadsheet work each week, allowing them to focus on guest hospitality and team leadership. Economically, our seventeen-thousand-euro annual payroll savings directly improves restaurant profit margins in an industry facing severe inflationary pressure.

Equally important is the ethical dimension. Unpredictable schedules and chronic exhaustion are the primary drivers of the hospitality labor shortage. By baking legal rest intervals and maximum contract ceilings directly into the genetic algorithm's objective function, ShiftPilot AI protects worker well-being and fosters a sustainable workplace culture.

Moving forward, our roadmap includes connecting directly to restaurant point-of-sale systems to stream live cover data, and introducing a mobile app for seamless peer-to-peer shift swaps.

Thank you for your time, and we welcome your questions."
