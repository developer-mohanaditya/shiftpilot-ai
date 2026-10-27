"use client";

import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  XCircle,
  Zap,
} from "lucide-react";

import { evaluateSchedule } from "@/algorithms/metrics";
import { DemandChart } from "@/components/dashboard/demand-chart";
import { PageHeader } from "@/components/layout/page-header";
import { RoleBadge } from "@/components/role-badge";
import { Stat } from "@/components/stat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizeDemand } from "@/domain/demand";
import { DAY_LABELS } from "@/domain/labels";
import { DAYS_OF_WEEK, ROLES } from "@/domain/types";
import { formatCurrency, formatHours } from "@/lib/format";
import { useAppStore } from "@/store/app-store";

export default function DashboardPage() {
  const { data } = useAppStore();

  const demand = summarizeDemand(data.restaurant, data.requirements);
  const services = new Set(data.requirements.map((r) => `${r.day}-${r.periodId}`)).size;
  const maxCapacity = data.employees.reduce((sum, e) => sum + e.maxHoursPerWeek, 0);
  const crossTrained = data.employees.filter((e) => e.roles.length > 1).length;
  const closedDays = DAYS_OF_WEEK.filter((day) => !demand.openDays.includes(day));

  const schedule = data.schedule;
  const metrics = schedule
    ? evaluateSchedule(data.restaurant, data.employees, data.requirements, schedule.assignments)
    : null;

  return (
    <>
      <PageHeader
        title="Operations Overview"
        description={`Weekly staffing demand and labor optimization for ${data.restaurant.name}.`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/optimization">View Benchmark</Link>
            </Button>
            <Button asChild>
              <Link href="/schedule">
                <CalendarDays aria-hidden className="mr-1.5 h-4 w-4" />
                Open Schedule
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Positions to fill"
          value={demand.positions}
          detail={`Across ${services} lunch & dinner services`}
        />
        <Stat
          label="Staff-hours required"
          value={formatHours(demand.staffHours)}
          detail={`Team capacity: ${formatHours(maxCapacity)} max`}
        />
        <Stat
          label="Weekly Labour Cost"
          value={metrics ? formatCurrency(metrics.totalLaborCost, data.restaurant.currency) : "Pending"}
          detail={schedule ? `Active schedule: ${schedule.source}` : "Generate schedule to compute"}
          pending={!metrics}
        />
        <Stat
          label="Shift Coverage"
          value={metrics ? `${(metrics.coverageRate * 100).toFixed(1)}%` : "Pending"}
          detail={metrics ? `${metrics.understaffedPositions} unfilled shifts` : "Generate schedule to compute"}
          pending={!metrics}
        />
      </div>

      {/* "Without ShiftPilot vs With ShiftPilot" Comparison Matrix */}
      <Card className="mt-6 border-primary/20 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                The Impact: Without ShiftPilot vs. With ShiftPilot
              </CardTitle>
              <CardDescription>
                How restaurant operations change when replacing manual guesswork with predictive ML and genetic scheduling.
              </CardDescription>
            </div>
            <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Est. 340 EUR saved weekly</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-y bg-muted/40 text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left w-1/4">Operational Dimension</th>
                  <th className="px-6 py-3 text-left w-3/8 text-amber-700">Without ShiftPilot (Manual Roster)</th>
                  <th className="px-6 py-3 text-left w-3/8 text-emerald-700">With ShiftPilot AI</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs sm:text-sm">
                <tr>
                  <td className="px-6 py-4 font-medium flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    Manager Scheduling Time
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>4 to 8 hours every Sunday</strong> manually shuffling spreadsheets and texting staff.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground bg-emerald-50/30">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Under 2 seconds:</strong> Automated demand forecasting and optimal schedule synthesis.</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-medium flex items-center gap-2 text-foreground">
                    <TrendingDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    Demand Matching
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Static headcount guesses:</strong> Overstaffed on rainy shifts, understaffed on weekend rushes.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground bg-emerald-50/30">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Predictive ML:</strong> Evaluates advance reservations, rain forecast, and day-of-week trends.</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-medium flex items-center gap-2 text-foreground">
                    <ShieldAlert className="h-4 w-4 text-muted-foreground shrink-0" />
                    Labor Law Compliance
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Frequent legal breaches:</strong> Staff accidentally scheduled for closing dinner then next-day opening (breaching mandatory 11h rest).</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground bg-emerald-50/30">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Zero compliance breaches:</strong> Rest intervals and maximum contract hours enforced directly as optimization constraints.</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 font-medium flex items-center gap-2 text-foreground">
                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                    Weekly Payroll Spend
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>Higher payroll overhead:</strong> Unplanned overtime and expensive senior staff misallocated to low-volume shifts.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground bg-emerald-50/30">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Optimized labor budget:</strong> ~340 EUR saved weekly (~1,400 EUR monthly) while preserving 100% station coverage.</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Required staff-hours by day</CardTitle>
            <CardDescription>
              {closedDays.length > 0
                ? `Closed on ${closedDays.map((d) => DAY_LABELS[d].long).join(", ")}.`
                : "Open every day."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DemandChart hoursByDay={demand.hoursByDay} />
            <div className="mt-4 flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Capacity</CardTitle>
            <CardDescription>
              {data.employees.length} employees, {crossTrained} trained for more than one role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {ROLES.map((role) => {
                const qualified = data.employees.filter((e) => e.roles.includes(role)).length;
                return (
                  <li key={role} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <RoleBadge role={role} />
                    <span className="text-right text-muted-foreground tabular-nums">
                      {qualified} qualified, {formatHours(demand.hoursByRole[role])} needed
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
