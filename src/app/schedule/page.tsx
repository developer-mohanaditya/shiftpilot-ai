import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { RoleBadge } from "@/components/role-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSampleData } from "@/data/sample-restaurant";
import { DAY_LABELS } from "@/domain/labels";
import { DAYS_OF_WEEK, SHIFT_PERIOD_IDS } from "@/domain/types";
import { formatClock } from "@/lib/format";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  const { restaurant, requirements } = createSampleData();

  return (
    <>
      <PageHeader
        title="Schedule"
        description="Staffing needed for each service this week. Generating a schedule assigns people to these positions."
        actions={
          <Button disabled title="Schedule generation is not connected yet">
            <Sparkles aria-hidden />
            Generate schedule
          </Button>
        }
      />

      <Card className="py-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] table-fixed text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th scope="col" className="w-28 px-4 py-3 text-left font-medium">
                  <span className="sr-only">Service</span>
                </th>
                {DAYS_OF_WEEK.map((day) => (
                  <th key={day} scope="col" className="px-2 py-3 text-left font-medium">
                    {DAY_LABELS[day].short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {SHIFT_PERIOD_IDS.map((periodId) => {
                const period = restaurant.shiftPeriods[periodId];
                return (
                  <tr key={periodId} className="align-top">
                    <th scope="row" className="px-4 py-4 text-left">
                      <span className="block font-medium">{period.label}</span>
                      <span className="text-xs font-normal text-muted-foreground tabular-nums">
                        {formatClock(period.startMinute)}–{formatClock(period.endMinute)}
                      </span>
                    </th>
                    {DAYS_OF_WEEK.map((day) => {
                      const cell = requirements.filter(
                        (r) => r.day === day && r.periodId === periodId,
                      );
                      const total = cell.reduce((sum, r) => sum + r.count, 0);
                      return (
                        <td key={day} className="px-2 py-4">
                          {cell.length === 0 ? (
                            <span className="text-xs text-muted-foreground">Closed</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <span className="mb-1 text-xs text-muted-foreground tabular-nums">
                                {total} needed
                              </span>
                              {cell.map((r) => (
                                <RoleBadge key={r.role} role={r.role} count={r.count} />
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
