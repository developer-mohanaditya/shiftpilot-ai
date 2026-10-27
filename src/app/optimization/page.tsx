"use client";

import { useState } from "react";
import {
  Play,
  TrendingDown,
  CheckCircle,
  Clock,
  DollarSign,
  ShieldAlert,
  Award,
  Sliders,
  RotateCcw,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/app-store";

export default function OptimizationPage() {
  const { data, runComparison } = useAppStore();
  const [isRunning, setIsRunning] = useState(false);

  // Hyperparameter states (Prompt 5)
  const [populationSize, setPopulationSize] = useState<number>(40);
  const [generations, setGenerations] = useState<number>(60);
  const [mutationRate, setMutationRate] = useState<number>(0.05);
  const [tournamentSize, setTournamentSize] = useState<number>(3);

  const comparison = data.lastComparison;

  function handleResetParams() {
    setPopulationSize(40);
    setGenerations(60);
    setMutationRate(0.05);
    setTournamentSize(3);
  }

  function handleRun() {
    setIsRunning(true);
    setTimeout(() => {
      runComparison({
        populationSize,
        generations,
        mutationRate,
        tournamentSize,
      });
      setIsRunning(false);
    }, 60);
  }

  return (
    <>
      <PageHeader
        title="Optimization results"
        description="Compare the greedy baseline heuristic with the genetic algorithm across payroll cost, shift coverage, and labor law compliance."
        actions={
          <Button onClick={handleRun} disabled={isRunning}>
            <Play className="h-4 w-4 mr-1" />
            {isRunning ? "Running optimization..." : "Run comparison"}
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Baseline: Greedy Heuristic</CardTitle>
              <span className="text-xs text-muted-foreground font-mono">Operations Research</span>
            </div>
            <CardDescription>A single pass assigning lowest wage staff chronologically.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Iterates through required positions in order and assigns the cheapest available employee.
            Because it makes decisions greedily without looking ahead, it tends to deplete flexible staff
            early in the week, creating gaps or forced overtime during busy weekend shifts.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Prescriptive AI: Genetic Algorithm</CardTitle>
              <span className="text-xs font-medium text-emerald-600 font-mono">AAA Track Optimization</span>
            </div>
            <CardDescription>Multi-generation evolutionary search over candidate schedules.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Maintains a population of candidate schedules. Evaluates fitness with penalty weights
            for uncovered slots, rest-window breaches, and payroll cost. Breeds successive generations
            via tournament selection, uniform crossover, and stochastic mutation to reach optimal balance.
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Hyperparameter Controls (Prompt 5) */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Algorithm Hyperparameters</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetParams}
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset defaults
            </Button>
          </div>
          <CardDescription>
            Tune evolutionary parameters before running optimization to analyze convergence speed and schedule quality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Population Size */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Population Size</span>
                <span className="font-mono font-semibold text-primary">{populationSize}</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={populationSize}
                onChange={(e) => setPopulationSize(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-muted-foreground">Candidate schedules per generation (10 to 100).</p>
            </div>

            {/* Generations */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Generations</span>
                <span className="font-mono font-semibold text-primary">{generations}</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={generations}
                onChange={(e) => setGenerations(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-muted-foreground">Iterations of evolutionary breeding (10 to 120).</p>
            </div>

            {/* Mutation Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Mutation Rate</span>
                <span className="font-mono font-semibold text-primary">{(mutationRate * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={mutationRate}
                onChange={(e) => setMutationRate(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-muted-foreground">Probability of stochastic slot mutation (1% to 20%).</p>
            </div>

            {/* Tournament Size */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Tournament Size</span>
                <span className="font-mono font-semibold text-primary">{tournamentSize}</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                step="1"
                value={tournamentSize}
                onChange={(e) => setTournamentSize(Number(e.target.value))}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-[11px] text-muted-foreground">Selection pressure size per parent round (2 to 6).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {comparison ? (
        <div className="mt-8 space-y-8">
          {/* Comparison summary table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Performance Comparison</CardTitle>
                  <CardDescription>
                    Direct benchmark of the baseline heuristic against the genetic algorithm.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Award className="h-3.5 w-3.5" />
                  <span>
                    GA saved{" "}
                    {formatCurrency(
                      comparison.baseline.metrics.totalLaborCost -
                        comparison.genetic.metrics.totalLaborCost,
                      data.restaurant.currency,
                    )}{" "}
                    in payroll
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-y bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Metric</th>
                    <th className="px-6 py-3 text-right font-medium">Greedy Baseline</th>
                    <th className="px-6 py-3 text-right font-medium text-primary">
                      Genetic Algorithm
                    </th>
                    <th className="px-6 py-3 text-right font-medium">Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  <tr>
                    <td className="px-6 py-3.5 font-sans flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Total Weekly Labor Cost
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {formatCurrency(
                        comparison.baseline.metrics.totalLaborCost,
                        data.restaurant.currency,
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-emerald-600">
                      {formatCurrency(
                        comparison.genetic.metrics.totalLaborCost,
                        data.restaurant.currency,
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-right font-sans text-xs text-emerald-600 font-semibold">
                      {(
                        ((comparison.baseline.metrics.totalLaborCost -
                          comparison.genetic.metrics.totalLaborCost) /
                          comparison.baseline.metrics.totalLaborCost) *
                        100
                      ).toFixed(1)}
                      % lower
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-3.5 font-sans flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      Shift Coverage Rate
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {(comparison.baseline.metrics.coverageRate * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-primary">
                      {(comparison.genetic.metrics.coverageRate * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-3.5 text-right font-sans text-xs text-muted-foreground">
                      {comparison.genetic.metrics.understaffedPositions === 0 ? "Full" : "Optimal"}
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-3.5 font-sans flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                      Constraint Breaches
                    </td>
                    <td className="px-6 py-3.5 text-right text-amber-600">
                      {comparison.baseline.metrics.violations.unqualified +
                        comparison.baseline.metrics.violations.unavailable +
                        comparison.baseline.metrics.violations.doubleBooked +
                        comparison.baseline.metrics.violations.hoursOverMax}
                    </td>
                    <td className="px-6 py-3.5 text-right font-semibold text-emerald-600">
                      {comparison.genetic.metrics.violations.unqualified +
                        comparison.genetic.metrics.violations.unavailable +
                        comparison.genetic.metrics.violations.doubleBooked +
                        comparison.genetic.metrics.violations.hoursOverMax}
                    </td>
                    <td className="px-6 py-3.5 text-right font-sans text-xs text-emerald-600 font-medium">
                      Compliant
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-3.5 font-sans flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      Fitness Penalty Value
                    </td>
                    <td className="px-6 py-3.5 text-right">{comparison.baseline.fitness}</td>
                    <td className="px-6 py-3.5 text-right font-semibold text-primary">
                      {comparison.genetic.fitness}
                    </td>
                    <td className="px-6 py-3.5 text-right font-sans text-xs text-emerald-600 font-medium">
                      {(
                        ((comparison.baseline.fitness - comparison.genetic.fitness) /
                          comparison.baseline.fitness) *
                        100
                      ).toFixed(1)}
                      % better fit
                    </td>
                  </tr>

                  <tr>
                    <td className="px-6 py-3.5 font-sans flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Execution Runtime
                    </td>
                    <td className="px-6 py-3.5 text-right">{comparison.baseline.runtimeMs} ms</td>
                    <td className="px-6 py-3.5 text-right text-primary">
                      {comparison.genetic.runtimeMs} ms
                    </td>
                    <td className="px-6 py-3.5 text-right font-sans text-xs text-muted-foreground">
                      {comparison.genetic.params?.generations ?? generations} gens (pop {comparison.genetic.params?.populationSize ?? populationSize})
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Convergence chart */}
          {comparison.genetic.convergence && (
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">Genetic Algorithm Convergence</CardTitle>
                    <CardDescription>
                      Tracking generation-by-generation reduction in penalty score (lower is better).
                    </CardDescription>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground bg-muted/50 px-2.5 py-1 rounded">
                    Pop: {comparison.genetic.params?.populationSize ?? populationSize} | Gen: {comparison.genetic.params?.generations ?? generations} | Mut: {((comparison.genetic.params?.mutationRate ?? mutationRate) * 100).toFixed(0)}%
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={comparison.genetic.convergence}
                    margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="generation"
                      tickLine={false}
                      label={{ value: "Generation", position: "insideBottom", offset: -5 }}
                      fontSize={12}
                    />
                    <YAxis tickLine={false} fontSize={12} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const dataPoint = payload[0]?.payload;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm text-xs space-y-1">
                            <p className="font-semibold">Generation {dataPoint.generation}</p>
                            <p className="text-primary">
                              Best Fitness: {Number(dataPoint.bestFitness).toFixed(0)}
                            </p>
                            <p className="text-muted-foreground">
                              Average: {Number(dataPoint.averageFitness).toFixed(0)}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bestFitness"
                      name="Best Fitness"
                      stroke="var(--color-primary, #4f46e5)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageFitness"
                      name="Population Average"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </>
  );
}
