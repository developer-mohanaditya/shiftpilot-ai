"use client";

import React from "react";
import { AppStoreProvider } from "@/store/app-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AppStoreProvider>{children}</AppStoreProvider>;
}
