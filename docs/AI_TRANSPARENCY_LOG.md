# AI Prompt & Transparency Log

This document records the AI-assisted ideation, scaffolding, and prompt logs for ShiftPilot AI in accordance with the SPOC AI for Business course transparency guidelines.

## Entry 1: Project Foundation & Domain Modeling
- **Date:** October 26, 2026
- **Tool:** LLM Assistant
- **Contributor:** Oscar Day
- **Prompt Summary:** Initial project scaffolding for a Next.js 16 app with Tailwind CSS v4, shadcn/ui components, and domain types for restaurant shifts, employee roles, availability, and scheduling constraints.
- **Output:** Base directory layout (`src/domain`, `src/data`, `src/components`, `src/app`) and mock data for sample bistro "Maison Ardoise".
- **Human Verification & Refinement:** Mohan Aditya Sadhanala reviewed the architecture, adjusted git structure, and identified the need for a predictive machine learning demand forecasting layer to meet the Advanced AI Algorithms track criteria.

## Entry 2: Predictive Demand Modeling & Genetic Optimization
- **Date:** October 27, 2026
- **Tool:** Antigravity AI Assistant
- **Contributor:** Mohan Aditya Sadhanala
- **Prompt Summary:** Implementation of multivariate regression for restaurant covers forecasting, fitness penalty function for French labor rules, and genetic algorithm scheduler.
- **Output:** `src/domain/demand-ml.ts`, `src/algorithms/metrics.ts`, `src/algorithms/baseline.ts`, `src/algorithms/genetic.ts`.
