import type { Metadata } from "next";
import "@fontsource-variable/ibm-plex-sans";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";

import { AppShell } from "@/components/layout/app-shell";
import { sampleRestaurant } from "@/data/sample-restaurant";

export const metadata: Metadata = {
  title: {
    default: "ShiftPilot AI Lite",
    template: "%s · ShiftPilot AI Lite",
  },
  description:
    "Weekly restaurant staff scheduling with a baseline heuristic and a genetic algorithm.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <AppShell restaurantName={sampleRestaurant.name}>{children}</AppShell>
      </body>
    </html>
  );
}
