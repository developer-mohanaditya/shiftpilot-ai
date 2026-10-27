"use client";

import { useState } from "react";
import { UserPlus, Trash2, RotateCcw, X, Check } from "lucide-react";

import { AvailabilityGrid } from "@/components/employees/availability-grid";
import { PageHeader } from "@/components/layout/page-header";
import { RoleBadge } from "@/components/role-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, DAY_LABELS } from "@/domain/labels";
import {
  DAYS_OF_WEEK,
  ROLES,
  SHIFT_PERIOD_IDS,
  type Availability,
  type DayOfWeek,
  type Role,
  type ShiftPeriodId,
} from "@/domain/types";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/app-store";

export default function EmployeesPage() {
  const { data, addEmployee, deleteEmployee, resetData } = useAppStore();
  const { employees, restaurant } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [primaryRole, setPrimaryRole] = useState<Role>("server");
  const [secondaryRoles, setSecondaryRoles] = useState<Role[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(14.5);
  const [minHours, setMinHours] = useState<number>(20);
  const [maxHours, setMaxHours] = useState<number>(35);

  // Default availability: all 7 days lunch and dinner
  const defaultAvailability: Availability = {
    mon: ["lunch", "dinner"],
    tue: ["lunch", "dinner"],
    wed: ["lunch", "dinner"],
    thu: ["lunch", "dinner"],
    fri: ["lunch", "dinner"],
    sat: ["lunch", "dinner"],
    sun: ["lunch", "dinner"],
  };
  const [availability, setAvailability] = useState<Availability>(defaultAvailability);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setPrimaryRole("server");
    setSecondaryRoles([]);
    setHourlyRate(14.5);
    setMinHours(20);
    setMaxHours(35);
    setAvailability(defaultAvailability);
  }

  function handleToggleSecondaryRole(role: Role) {
    if (role === primaryRole) return;
    if (secondaryRoles.includes(role)) {
      setSecondaryRoles(secondaryRoles.filter((r) => r !== role));
    } else {
      setSecondaryRoles([...secondaryRoles, role]);
    }
  }

  function handleToggleAvailability(day: DayOfWeek, periodId: ShiftPeriodId) {
    const current = availability[day] ?? [];
    const updated = current.includes(periodId)
      ? current.filter((p) => p !== periodId)
      : [...current, periodId];

    setAvailability({
      ...availability,
      [day]: updated,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const filteredSecondary = secondaryRoles.filter((r) => r !== primaryRole);
    const combinedRoles: Role[] = [primaryRole, ...filteredSecondary];

    addEmployee({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      roles: combinedRoles,
      hourlyRate: Number(hourlyRate),
      minHoursPerWeek: Number(minHours),
      maxHoursPerWeek: Number(maxHours),
      availability,
    });

    resetForm();
    setIsModalOpen(false);
  }

  return (
    <>
      <PageHeader
        title="Employees"
        description="Who can work which roles, when they are available, and their contracted hours."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resetData()}
              title="Reset employee roster to original 15 team members"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset defaults
            </Button>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-1" />
              Add employee
            </Button>
          </div>
        }
      />

      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Active Roster:</span>
          <Badge variant="outline" className="font-mono text-xs">
            {employees.length} team members
          </Badge>
        </div>
        <span className="text-[11px]">Saved locally in browser storage.</span>
      </div>

      <Card className="py-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Name</th>
                <th scope="col" className="px-5 py-3 font-medium">Roles</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Hourly rate</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Hours / week</th>
                <th scope="col" className="px-5 py-3 font-medium">Availability</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees.map((employee) => (
                <tr key={employee.id} className="align-middle hover:bg-muted/30 transition-colors">
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
                    {employee.minHoursPerWeek} to {employee.maxHoursPerWeek}
                  </td>
                  <td className="px-5 py-3">
                    <AvailabilityGrid availability={employee.availability} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEmployee(employee.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title={`Remove ${employee.firstName}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-3 text-xs text-muted-foreground">
        Outlined roles are secondary roles the employee is cross-trained for. Changes persist in your browser storage.
      </p>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h3 className="text-base font-semibold text-foreground">Add New Employee</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create a staff record with contracted hours, pay rate, and weekly availability.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Lucas"
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Bernard"
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">Primary Role</label>
                <select
                  value={primaryRole}
                  onChange={(e) => {
                    const newPrimary = e.target.value as Role;
                    setPrimaryRole(newPrimary);
                    setSecondaryRoles(secondaryRoles.filter((r) => r !== newPrimary));
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>

                <div className="pt-1">
                  <label className="text-xs font-medium text-muted-foreground">Secondary Cross-Trained Roles</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {ROLES.filter((r) => r !== primaryRole).map((r) => {
                      const isSelected = secondaryRoles.includes(r);
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleToggleSecondaryRole(r)}
                          className={`rounded px-2 py-0.5 text-xs font-medium border transition-colors flex items-center gap-1 ${
                            isSelected
                              ? "bg-primary/10 border-primary text-primary"
                              : "border-input bg-background text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {ROLE_LABELS[r]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Compensation and Hours */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Hourly Rate (EUR)</label>
                  <input
                    type="number"
                    step="0.50"
                    min="11.50"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Min Hours/Week</label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    required
                    value={minHours}
                    onChange={(e) => setMinHours(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Max Hours/Week</label>
                  <input
                    type="number"
                    min="1"
                    max="48"
                    required
                    value={maxHours}
                    onChange={(e) => setMaxHours(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Availability grid toggles */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground">Weekly Availability</label>
                  <span className="text-[11px] text-muted-foreground">Click chips to toggle services</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {DAYS_OF_WEEK.map((day) => {
                    const availablePeriods = availability[day] ?? [];
                    return (
                      <div key={day} className="flex flex-col gap-1 rounded border border-border p-1">
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {DAY_LABELS[day].short}
                        </span>
                        {SHIFT_PERIOD_IDS.map((pId) => {
                          const isAvail = availablePeriods.includes(pId);
                          return (
                            <button
                              key={pId}
                              type="button"
                              onClick={() => handleToggleAvailability(day, pId)}
                              className={`rounded py-1 text-[9px] font-medium transition-colors ${
                                isAvail
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold"
                                  : "bg-muted text-muted-foreground/60 line-through"
                              }`}
                            >
                              {pId === "lunch" ? "L" : "D"}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs">
                  Save Employee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
