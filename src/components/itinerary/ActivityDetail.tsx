"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
      {/* Applied rounded-none to remove standard shadcn UI rounded corners */}
      <DialogContent className="max-w-xl rounded-none border border-gray-200 bg-[#FDFCFB] p-0 shadow-2xl overflow-hidden">
        
        <div className="p-8 md:p-10">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="border border-gray-200 px-3 py-1 text-[9px] uppercase tracking-widest text-gray-500 font-bold bg-[#FAF7F2]">
                {activity.category}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                {activity.startTime} — {activity.endTime} ({activity.duration} min)
              </span>
            </div>
            <DialogTitle className="text-3xl font-serif italic tracking-tight text-[#1A1A1A]">
              {activity.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <p className="text-base text-gray-600 leading-relaxed font-serif">
              {activity.description}
            </p>

            <div className="grid grid-cols-2 gap-6 border-y border-gray-200 py-6">
              {activity.costEstimate != null && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Investment</p>
                  <p className="text-sm font-medium">
                    ~{activity.costEstimate} {activity.costCurrency} per person
                  </p>
                </div>
              )}
              {activity.transitFromPrev && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-1">Transit Details</p>
                  <p className="text-sm font-medium">
                    {activity.transitFromPrev}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <Button variant="outline" size="sm" asChild className="flex-1 rounded-none h-14 border-gray-300 text-[10px] tracking-[0.2em] uppercase font-bold hover:bg-gray-50">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Open Coordinates
                </a>
              </Button>
              <Button size="sm" onClick={onSwap} className="flex-1 rounded-none h-14 bg-[#1A1A1A] text-white hover:bg-orange-950 text-[10px] tracking-[0.2em] uppercase font-bold transition-all">
                Request Alternate
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}