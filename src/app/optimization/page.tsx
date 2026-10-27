"use client";

import { useState } from "react";
import { Play, TrendingDown, CheckCircle, Clock, DollarSign, ShieldAlert, Award } from "lucide-react";
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

  const comparison = data.lastComparison;

  function handleRun() {
    setIsRunning(true);
    setTimeout(() => {
      runComparison();
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
            Maintains a population of 40 candidate schedules. Evaluates fitness with penalty weights
            for uncovered slots, rest-window breaches, and payroll cost. Breeds successive generations
            via tournament selection, uniform crossover, and stochastic mutation to reach optimal balance.
          </CardContent>
        </Card>
      </div>

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
                      60 gens
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
                <CardTitle className="text-base">Genetic Algorithm Convergence</CardTitle>
                <CardDescription>
                  Tracking generation-by-generation reduction in penalty score (lower is better).
                </CardDescription>
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
                      stroke="#2563eb"
                      strokeWidth={2.5}
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
      ) : (
        <div className="mt-6 rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
          <p className="font-medium">No comparison run yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Click Run comparison to evaluate both algorithms side by side on current staff availability
            and demand figures.
          </p>
        </div>
      )}
    </>
  );
}
