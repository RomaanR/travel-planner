"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TripActivity } from "@/hooks/useTrip";

interface ActivityDetailProps {
  activity: TripActivity | null;
  open: boolean;
  onClose: () => void;
  onSwap: () => void;
}

export function ActivityDetail({
  activity,
  open,
  onClose,
  onSwap,
}: ActivityDetailProps) {
  if (!activity) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${activity.lat},${activity.lng}`;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{activity.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">{activity.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {activity.startTime} - {activity.endTime}
            </span>
            <span className="text-sm text-muted-foreground">
              ({activity.duration} min)
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {activity.description}
          </p>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            {activity.costEstimate != null && (
              <div>
                <p className="font-medium">Estimated cost</p>
                <p className="text-muted-foreground">
                  ~{activity.costEstimate} {activity.costCurrency} per person
                </p>
              </div>
            )}
            {activity.transitFromPrev && (
              <div>
                <p className="font-medium">Getting there</p>
                <p className="text-muted-foreground">
                  {activity.transitFromPrev}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                Open in Maps
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={onSwap} className="flex-1">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                />
              </svg>
              Swap Activity
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
