"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DemandSummary } from "@/domain/demand";
import { DAY_LABELS, ROLE_LABELS } from "@/domain/labels";
import { ROLES } from "@/domain/types";
import { ROLE_STYLES } from "@/lib/role-styles";

interface DemandChartProps {
  hoursByDay: DemandSummary["hoursByDay"];
}

/** Stacked bar chart of required staff-hours per day, split by role. */
export function DemandChart({ hoursByDay }: DemandChartProps) {
  const data = hoursByDay.map((entry) => ({ ...entry, label: DAY_LABELS[entry.day].short }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            unit=" h"
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            formatter={(value) => `${String(value)} h`}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              fontSize: 13,
            }}
          />
          {ROLES.map((role, index) => (
            <Bar
              key={role}
              dataKey={role}
              name={ROLE_LABELS[role]}
              stackId="hours"
              fill={ROLE_STYLES[role].color}
              radius={index === ROLES.length - 1 ? [4, 4, 0, 0] : 0}
              maxBarSize={44}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
