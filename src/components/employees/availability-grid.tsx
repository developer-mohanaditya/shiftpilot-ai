import { DAY_LABELS } from "@/domain/labels";
import { DAYS_OF_WEEK, SHIFT_PERIOD_IDS, type Availability } from "@/domain/types";
import { cn } from "@/lib/utils";

const PERIOD_INITIALS = { lunch: "L", dinner: "D" } as const;

/** Compact 7-day × lunch/dinner grid; filled cells mean available. */
export function AvailabilityGrid({ availability }: { availability: Availability }) {
  const summary = DAYS_OF_WEEK.map(
    (day) =>
      `${DAY_LABELS[day].short}: ${
        availability[day].length > 0 ? availability[day].join(" and ") : "unavailable"
      }`,
  ).join("; ");

  return (
    <div role="img" aria-label={`Availability. ${summary}`} className="inline-grid gap-1">
      {SHIFT_PERIOD_IDS.map((period) => (
        <div key={period} className="flex items-center gap-1">
          <span className="w-3 text-[10px] text-muted-foreground" aria-hidden>
            {PERIOD_INITIALS[period]}
          </span>
          {DAYS_OF_WEEK.map((day) => (
            <span
              key={day}
              title={`${DAY_LABELS[day].long} ${period}`}
              className={cn(
                "size-3.5 rounded-[3px]",
                availability[day].includes(period) ? "bg-primary/80" : "bg-muted",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
