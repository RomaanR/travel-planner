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
    <ScrollArea className="h-full bg-[#FAF7F2]/30">
      <div className="flex flex-col">
        {days.map((day) => (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.dayNumber)}
            className={`group w-full p-6 text-left border-b border-gray-200 transition-all duration-300 ${
              selectedDay === day.dayNumber
                ? "bg-white border-r-2 border-r-[#1A1A1A]"
                : "hover:bg-white"
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className={`text-[10px] uppercase tracking-[0.3em] font-bold ${selectedDay === day.dayNumber ? "text-[#1A1A1A]" : "text-gray-400 group-hover:text-gray-600"}`}>
                Day {day.dayNumber.toString().padStart(2, '0')}
              </span>
              <span className={`font-serif italic ${selectedDay === day.dayNumber ? "text-xl text-[#1A1A1A]" : "text-lg text-gray-400"}`}>
                {format(new Date(day.date), "MMM d")}
              </span>
            </div>
            {day.theme && (
              <p className={`mt-3 text-xs leading-relaxed italic ${selectedDay === day.dayNumber ? "text-gray-600" : "text-gray-400"}`}>
                {day.theme}
              </p>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
