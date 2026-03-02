"use client";

import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TripDay } from "@/hooks/useTrip";

interface DaySidebarProps {
  days: TripDay[];
  selectedDay: number;
  onSelectDay: (dayNumber: number) => void;
}

export function DaySidebar({
  days,
  selectedDay,
  onSelectDay,
}: DaySidebarProps) {
  return (
    <ScrollArea className="h-full bg-muted/30">
      <div className="space-y-1 p-2">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.dayNumber)}
            className={`w-full rounded-xl p-3 text-left transition-all duration-200 hover:bg-accent ${
              selectedDay === day.dayNumber
                ? "bg-primary/5 shadow-apple-sm border-l-2 border-primary"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                  selectedDay === day.dayNumber
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {day.dayNumber}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">
                  Day {day.dayNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(day.date), "MMM d")}
                </p>
              </div>
            </div>
            {day.theme && (
              <p className="mt-1 text-xs text-muted-foreground italic truncate pl-10">
                {day.theme}
              </p>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
