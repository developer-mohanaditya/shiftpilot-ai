import type { Metadata } from "next";
import { UserPlus } from "lucide-react";

import { AvailabilityGrid } from "@/components/employees/availability-grid";
import { PageHeader } from "@/components/layout/page-header";
import { RoleBadge } from "@/components/role-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createSampleData } from "@/data/sample-restaurant";
import { formatCurrency } from "@/lib/format";

export const metadata: Metadata = { title: "Employees" };

export default function EmployeesPage() {
  const { employees, restaurant } = createSampleData();

  return (
    <>
      <PageHeader
        title="Employees"
        description="Who can work which roles, when they are available, and their contracted hours."
        actions={
          <Button disabled title="Editing is not connected yet">
            <UserPlus aria-hidden />
            Add employee
          </Button>
        }
      />

      <Card className="py-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Name</th>
                <th scope="col" className="px-5 py-3 font-medium">Roles</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Hourly rate</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Hours / week</th>
                <th scope="col" className="px-5 py-3 font-medium">Availability</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((employee) => (
                <tr key={employee.id} className="align-middle">
                  <th scope="row" className="px-5 py-3 text-left font-medium">
                    {employee.firstName} {employee.lastName}
                  </th>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {employee.roles.map((role, index) => (
                        <RoleBadge key={role} role={role} subtle={index > 0} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {formatCurrency(employee.hourlyRate, restaurant.currency, 2)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">
                    {employee.minHoursPerWeek}–{employee.maxHoursPerWeek}
                  </td>
                  <td className="px-5 py-3">
                    <AvailabilityGrid availability={employee.availability} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-3 text-xs text-muted-foreground">
        Outlined roles are secondary roles the employee is cross-trained for. All people are
        fictional.
      </p>
    </>
  );
}
