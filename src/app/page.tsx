import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { DemandChart } from "@/components/dashboard/demand-chart";
import { PageHeader } from "@/components/layout/page-header";
import { RoleBadge } from "@/components/role-badge";
import { Stat } from "@/components/stat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createSampleData } from "@/data/sample-restaurant";
import { summarizeDemand } from "@/domain/demand";
import { DAY_LABELS } from "@/domain/labels";
import { DAYS_OF_WEEK, ROLES } from "@/domain/types";
import { formatHours } from "@/lib/format";

export default function DashboardPage() {
  // Milestone 1 reads sample data directly; milestone 2 switches to the persisted store.
  const data = createSampleData();
  const demand = summarizeDemand(data.restaurant, data.requirements);
  const services = new Set(data.requirements.map((r) => `${r.day}-${r.periodId}`)).size;
  const maxCapacity = data.employees.reduce((sum, e) => sum + e.maxHoursPerWeek, 0);
  const crossTrained = data.employees.filter((e) => e.roles.length > 1).length;
  const closedDays = DAYS_OF_WEEK.filter((day) => !demand.openDays.includes(day));

  return (
    <>
      <PageHeader
        title="This week"
        description={`Staffing needs and team capacity for ${data.restaurant.name}. Labour cost and coverage appear once a schedule exists.`}
        actions={
          <Button asChild>
            <Link href="/schedule">
              <CalendarDays aria-hidden />
              Open schedule
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Positions to fill"
          value={demand.positions}
          detail={`Across ${services} services`}
        />
        <Stat
          label="Staff-hours required"
          value={formatHours(demand.staffHours)}
          detail={`Team can work up to ${formatHours(maxCapacity)}`}
        />
        <Stat label="Labour cost" value="—" detail="No schedule yet" pending />
        <Stat label="Coverage" value="—" detail="No schedule yet" pending />
      </div>

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
            <CardTitle>Team</CardTitle>
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
