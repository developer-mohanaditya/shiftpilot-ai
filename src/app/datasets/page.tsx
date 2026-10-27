"use client";

import { useState } from "react";
import {
  Database,
  Download,
  FileSpreadsheet,
  Cpu,
  BarChart3,
  CloudRain,
  Users,
} from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleEmployees } from "@/data/sample-restaurant";
import { HISTORICAL_TRAINING_DATA, trainRegressionModel } from "@/domain/demand-ml";
import { DAY_LABELS } from "@/domain/labels";
import { formatCurrency } from "@/lib/format";

export default function DatasetsPage() {
  const [filterPeriod, setFilterPeriod] = useState<"all" | "lunch" | "dinner">("all");
  const { weights, diagnostics } = trainRegressionModel();

  const filteredData = HISTORICAL_TRAINING_DATA.filter((row) => {
    if (filterPeriod === "all") return true;
    return row.periodId === filterPeriod;
  });

  function downloadCoversCsv() {
    let csv = "week,day,service,reservations_24h_prior,is_weekend,is_rainy,actual_guest_covers\n";
    HISTORICAL_TRAINING_DATA.forEach((r) => {
      csv += `${r.week},${r.day},${r.periodId},${r.reservations24h},${r.isWeekend},${r.isRainy},${r.actualCovers}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "maison_ardoise_covers_8weeks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadRosterCsv() {
    let csv = "id,first_name,last_name,roles,hourly_rate_eur,min_hours_per_week,max_hours_per_week\n";
    sampleEmployees.forEach((e) => {
      csv += `${e.id},${e.firstName},${e.lastName},"${e.roles.join(";")}",${e.hourlyRate},${e.minHoursPerWeek},${e.maxHoursPerWeek}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "restaurant_staff_roster.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <PageHeader
        title="Datasets & ML Diagnostics"
        description="Open historical operational datasets, feature matrices, and closed-form linear regression weights powering ShiftPilot AI."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={downloadCoversCsv}>
              <Download className="mr-1.5 h-4 w-4" />
              Covers CSV ({HISTORICAL_TRAINING_DATA.length} rows)
            </Button>
            <Button variant="outline" size="sm" onClick={downloadRosterCsv}>
              <Download className="mr-1.5 h-4 w-4" />
              Staff Roster CSV ({sampleEmployees.length} staff)
            </Button>
          </div>
        }
      />

      {/* Dataset & Model KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Database className="h-4 w-4 text-primary" />
            <span>Training Records</span>
          </div>
          <p className="text-2xl font-bold font-mono">{HISTORICAL_TRAINING_DATA.length}</p>
          <p className="text-xs text-muted-foreground">8 weeks of lunch and dinner services</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Users className="h-4 w-4 text-emerald-600" />
            <span>Staff Roster</span>
          </div>
          <p className="text-2xl font-bold font-mono">{sampleEmployees.length}</p>
          <p className="text-xs text-muted-foreground">Full contracts, cross-trained roles and wages</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span>Model Goodness of Fit</span>
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">
            {(diagnostics.rSquared * 100).toFixed(1)}% R²
          </p>
          <p className="text-xs text-muted-foreground">Variance explained by predictors</p>
        </Card>

        <Card className="p-4 space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Cpu className="h-4 w-4 text-purple-600" />
            <span>Mean Absolute Error</span>
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">
            {diagnostics.mae.toFixed(1)} covers
          </p>
          <p className="text-xs text-muted-foreground">RMSE: {diagnostics.rmse.toFixed(1)} covers per service</p>
        </Card>
      </div>

      {/* Regression Equation and Coefficients */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                Multivariate Linear Regression Feature Weights
              </CardTitle>
              <CardDescription>
                Solved analytically via the closed-form normal equation: beta = (X^T X)^(-1) X^T y.
              </CardDescription>
            </div>
            <span className="text-xs font-mono bg-primary/10 text-primary px-2.5 py-1 rounded-md font-semibold">
              Supervised ML
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-xs text-muted-foreground block font-mono">beta_0: Intercept</span>
              <p className="text-lg font-bold font-mono mt-1">
                {weights.intercept.toFixed(2)}
              </p>
              <span className="text-xs text-muted-foreground">Baseline walk-in guest volume</span>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-xs text-muted-foreground block font-mono">beta_1: Reservations</span>
              <p className="text-lg font-bold font-mono mt-1 text-emerald-600">
                +{weights.reservations.toFixed(2)}
              </p>
              <span className="text-xs text-muted-foreground">Per 24h advance reservation</span>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-xs text-muted-foreground block font-mono">beta_2: Weekend Lift</span>
              <p className="text-lg font-bold font-mono mt-1 text-blue-600">
                +{weights.weekend.toFixed(2)}
              </p>
              <span className="text-xs text-muted-foreground">Saturday and Sunday premium</span>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-xs text-muted-foreground block font-mono">beta_3: Rain Impact</span>
              <p className="text-lg font-bold font-mono mt-1 text-amber-600">
                {weights.rain.toFixed(2)}
              </p>
              <span className="text-xs text-muted-foreground">Loss of terrace seating volume</span>
            </div>
            <div className="rounded-lg border bg-muted/30 p-3">
              <span className="text-xs text-muted-foreground block font-mono">beta_4: Lunch Bias</span>
              <p className="text-lg font-bold font-mono mt-1 text-purple-600">
                {weights.lunchBias.toFixed(2)}
              </p>
              <span className="text-xs text-muted-foreground">Daytime vs evening service offset</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dataset 1: Historical Covers Table */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Dataset 1: Maison Ardoise Historical Covers (8 Weeks)
              </CardTitle>
              <CardDescription>
                Historical training set containing 48 recorded lunch and dinner services.
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/50 p-1 rounded-lg border text-xs">
              <button
                type="button"
                onClick={() => setFilterPeriod("all")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterPeriod === "all" ? "bg-background font-medium shadow-sm" : "text-muted-foreground"
                }`}
              >
                All ({HISTORICAL_TRAINING_DATA.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterPeriod("lunch")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterPeriod === "lunch" ? "bg-background font-medium shadow-sm" : "text-muted-foreground"
                }`}
              >
                Lunch
              </button>
              <button
                type="button"
                onClick={() => setFilterPeriod("dinner")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterPeriod === "dinner" ? "bg-background font-medium shadow-sm" : "text-muted-foreground"
                }`}
              >
                Dinner
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto border-t">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm border-b text-xs text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-2.5 text-left">Week</th>
                  <th className="px-4 py-2.5 text-left">Day</th>
                  <th className="px-4 py-2.5 text-left">Service</th>
                  <th className="px-4 py-2.5 text-right">24h Bookings</th>
                  <th className="px-4 py-2.5 text-center">Weekend</th>
                  <th className="px-4 py-2.5 text-center">Weather</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Actual Covers</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono text-xs">
                {filteredData.map((row, idx) => (
                  <tr key={`${row.week}-${row.day}-${row.periodId}-${idx}`} className="hover:bg-muted/20">
                    <td className="px-4 py-2 text-muted-foreground">Week {row.week}</td>
                    <td className="px-4 py-2 font-sans font-medium">{DAY_LABELS[row.day].long}</td>
                    <td className="px-4 py-2 font-sans capitalize">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          row.periodId === "dinner"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {row.periodId}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right">{row.reservations24h}</td>
                    <td className="px-4 py-2 text-center">
                      {row.isWeekend === 1 ? (
                        <span className="text-emerald-600 font-sans font-medium text-[11px]">Yes</span>
                      ) : (
                        <span className="text-muted-foreground font-sans text-[11px]">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {row.isRainy === 1 ? (
                        <span className="inline-flex items-center gap-1 text-blue-600 font-sans text-[11px]">
                          <CloudRain className="h-3 w-3" /> Rain
                        </span>
                      ) : (
                        <span className="text-amber-600 font-sans text-[11px]">Clear</span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-foreground">
                      {row.actualCovers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dataset 2: Employee Roster Table */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Dataset 2: Restaurant Staff Roster & Compensation
              </CardTitle>
              <CardDescription>
                15 employees with contractual hours, wage rates, and certified roles.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={downloadRosterCsv} className="text-xs">
              <Download className="mr-1 h-3.5 w-3.5" />
              Download CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto border-t">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/90 backdrop-blur-sm border-b text-xs text-muted-foreground font-medium">
                <tr>
                  <th className="px-4 py-2.5 text-left">ID</th>
                  <th className="px-4 py-2.5 text-left">Staff Name</th>
                  <th className="px-4 py-2.5 text-left">Qualified Roles</th>
                  <th className="px-4 py-2.5 text-right">Hourly Wage</th>
                  <th className="px-4 py-2.5 text-right">Contract Min</th>
                  <th className="px-4 py-2.5 text-right">Contract Max</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono text-xs">
                {sampleEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/20">
                    <td className="px-4 py-2 text-muted-foreground">{emp.id}</td>
                    <td className="px-4 py-2 font-sans font-medium text-foreground">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-4 py-2 font-sans">
                      <div className="flex flex-wrap gap-1">
                        {emp.roles.map((r) => (
                          <span
                            key={r}
                            className="bg-muted px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold text-muted-foreground"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(emp.hourlyRate, "EUR")}
                    </td>
                    <td className="px-4 py-2 text-right text-muted-foreground">
                      {emp.minHoursPerWeek} h
                    </td>
                    <td className="px-4 py-2 text-right font-bold text-foreground">
                      {emp.maxHoursPerWeek} h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
