import type { Metadata } from "next";
import { Play } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Optimization" };

export default function OptimizationPage() {
  return (
    <>
      <PageHeader
        title="Optimization results"
        description="Compare a simple baseline schedule with one produced by a genetic algorithm, using the same employees, requirements and scoring rules."
        actions={
          <Button disabled title="The scheduling engine is not connected yet">
            <Play aria-hidden />
            Run comparison
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Baseline: greedy assignment</CardTitle>
            <CardDescription>A fast, single pass used as the reference point.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Goes through each required position in order and gives it to the cheapest qualified,
            available employee who still has hours left. It never revisits an earlier choice, so
            it can use up a flexible employee early and leave a later shift short.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Genetic algorithm</CardTitle>
            <CardDescription>A heuristic search over many candidate schedules.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Keeps a population of candidate schedules, scores each one with a penalty function
            (uncovered positions, broken rules, labour cost), and builds new candidates by
            combining and mutating the better ones. It is an optimisation heuristic, not machine
            learning: it does not learn from data, and it does not guarantee the best possible
            schedule. It often finds a better one than the baseline, and the comparison below will
            show whether it did.
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 rounded-xl border border-dashed bg-card/50 px-6 py-12 text-center">
        <p className="font-medium">No comparison yet</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          When you run a comparison, both schedules are generated from your current data and
          every figure here is calculated from them.
        </p>
      </div>
    </>
  );
}
