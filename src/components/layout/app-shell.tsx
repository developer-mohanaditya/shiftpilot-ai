import type { ReactNode } from "react";

import { MobileNav, SidebarNav } from "./nav-links";

function Wordmark() {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        ShiftPilot
      </span>
      <span className="text-xs text-sidebar-foreground">AI Lite</span>
    </div>
  );
}

interface AppShellProps {
  restaurantName: string;
  children: ReactNode;
}

export function AppShell({ restaurantName, children }: AppShellProps) {
  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[15rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden border-r border-sidebar-border bg-sidebar lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:gap-8 lg:px-4 lg:py-6">
        <div className="px-3">
          <Wordmark />
        </div>
        <SidebarNav />
        <div className="mt-auto border-t border-sidebar-border px-3 pt-4">
          <p className="text-xs text-sidebar-foreground">Restaurant</p>
          <p className="text-sm font-medium text-white">{restaurantName}</p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="bg-sidebar px-4 pt-4 lg:hidden">
        <div className="mb-3 flex items-center justify-between">
          <Wordmark />
          <span className="text-xs text-sidebar-foreground">{restaurantName}</span>
        </div>
        <MobileNav />
      </header>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
