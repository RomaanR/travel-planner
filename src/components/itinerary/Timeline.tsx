"use client";

import { ActivityCard, type PlaceData } from "./ActivityCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TripActivity } from "@/hooks/useTrip";

interface TimelineProps {
  activities: TripActivity[];
  dayTheme: string | null;
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
  onSwapActivity: (id: string) => void;
  placesData?: Record<string, PlaceData>;
  photoBaseUrl?: string;
}

export function Timeline({
  activities,
  dayTheme,
  selectedActivityId,
  onSelectActivity,
  onSwapActivity,
  placesData,
  photoBaseUrl,
}: TimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
        No curated activities for this day
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-8 md:p-12">
        {dayTheme && (
          <div className="mb-12 border-b border-gray-200 pb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-orange-800 mb-3 block">
              Curated Focus
            </span>
            <h3 className="text-3xl md:text-4xl font-serif italic tracking-tight text-[#1A1A1A]">
              {dayTheme}
            </h3>
          </div>
        )}
        <div className="space-y-0">
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={index}
              isSelected={selectedActivityId === activity.id}
              onClick={() => onSelectActivity(activity.id)}
              onSwap={() => onSwapActivity(activity.id)}
              placeData={placesData?.[activity.id]}
              photoBaseUrl={photoBaseUrl}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}