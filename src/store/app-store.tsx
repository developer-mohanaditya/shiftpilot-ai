"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import {
  type AlgorithmId,
  type AppData,
  type OptimizationComparison,
  type Schedule,
} from "@/domain/types";
import { createSampleData } from "@/data/sample-restaurant";
import { runBaseline } from "@/algorithms/baseline";
import { runGeneticAlgorithm } from "@/algorithms/genetic";
import { generatePredictedWeeklyRequirements } from "@/domain/demand-ml";

const STORAGE_KEY = "shiftpilot_data_v1";

let memoryData: AppData = createSampleData();
let isInitialized = false;
const listeners = new Set<() => void>();

function initDataOnce(): AppData {
  if (isInitialized) return memoryData;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppData;
        if (parsed.version === 1) {
          memoryData = parsed;
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
    isInitialized = true;
  }
  return memoryData;
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function setStoreData(nextData: AppData) {
  memoryData = nextData;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    } catch {
      // Ignore localStorage write errors
    }
  }
  notify();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): AppData {
  initDataOnce();
  return memoryData;
}

const serverSnapshot: AppData = createSampleData();
function getServerSnapshot(): AppData {
  return serverSnapshot;
}

interface AppStoreContextType {
  data: AppData;
  generateSchedule: (algorithm?: AlgorithmId) => Schedule;
  runComparison: () => OptimizationComparison;
  applyPredictedDemand: () => void;
  resetData: () => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function generateSchedule(algorithm: AlgorithmId = "genetic"): Schedule {
    let run;
    if (algorithm === "baseline") {
      run = runBaseline(data.restaurant, data.employees, data.requirements);
    } else {
      run = runGeneticAlgorithm(data.restaurant, data.employees, data.requirements);
    }

    const nextData: AppData = {
      ...data,
      schedule: run.schedule,
    };
    setStoreData(nextData);
    return run.schedule;
  }

  function runComparison(): OptimizationComparison {
    const baseline = runBaseline(data.restaurant, data.employees, data.requirements);
    const genetic = runGeneticAlgorithm(data.restaurant, data.employees, data.requirements);

    const comparison: OptimizationComparison = {
      runAt: new Date().toISOString(),
      baseline,
      genetic,
    };

    const nextData: AppData = {
      ...data,
      schedule: genetic.schedule,
      lastComparison: comparison,
    };
    setStoreData(nextData);
    return comparison;
  }

  function applyPredictedDemand() {
    const { requirements } = generatePredictedWeeklyRequirements();
    const nextData: AppData = {
      ...data,
      requirements,
      schedule: null,
      lastComparison: null,
    };
    setStoreData(nextData);
  }

  function resetData() {
    const fresh = createSampleData();
    setStoreData(fresh);
  }

  return (
    <AppStoreContext.Provider
      value={{
        data,
        generateSchedule,
        runComparison,
        applyPredictedDemand,
        resetData,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreContextType {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return ctx;
}
