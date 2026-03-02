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
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No activities for this day
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        {dayTheme && (
          <div className="mb-4">
            <h3 className="text-xl font-bold tracking-tight">{dayTheme}</h3>
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
