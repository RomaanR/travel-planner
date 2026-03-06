"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ClaudeActivity } from "@/lib/types";

interface SwapModalProps {
  activityId: string | null;
  activityName: string;
  open: boolean;
  onClose: () => void;
  onSwapComplete: () => void;
}

export function SwapModal({
  activityId,
  activityName,
  open,
  onClose,
  onSwapComplete,
}: SwapModalProps) {
  const [alternatives, setAlternatives] = useState<ClaudeActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [error, setError] = useState("");
  const [selectedAlt, setSelectedAlt] = useState<number | null>(null);

  const fetchAlternatives = async () => {
    if (!activityId) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      });

      if (!res.ok) throw new Error("Failed to fetch alternatives");

      const data = await res.json();
      setAlternatives(data.alternatives);
    } catch {
      setError("Failed to get alternatives. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    if (selectedAlt === null || !activityId) return;
    setSwapping(true);

    try {
      const res = await fetch("/api/swap", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          replacement: alternatives[selectedAlt],
        }),
      });

      if (!res.ok) throw new Error("Failed to swap");

      onSwapComplete();
      onClose();
    } catch {
      setError("Failed to swap activity. Please try again.");
    } finally {
      setSwapping(false);
    }
  };

  // Fetch alternatives when modal opens
  useEffect(() => {
    if (open && activityId) {
      setAlternatives([]);
      setSelectedAlt(null);
      setError("");
      fetchAlternatives();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activityId]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Replace &quot;{activityName}&quot;
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-[#1A1A1A]/20 border-t-[#1A1A1A]" />
              <div className="absolute inset-0 animate-pulse-glow rounded-full" />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Finding alternatives...
            </p>
          </div>
        )}

        {error && (
          <div className="py-4 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAlternatives}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && alternatives.length > 0 && (
          <div className="space-y-3">
            <p className="uppercase tracking-widest text-[10px] font-bold text-gray-500">
              Select a replacement:
            </p>
            {alternatives.map((alt, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-200 hover:border-[#1A1A1A] ${
                  selectedAlt === index ? "ring-2 ring-[#1A1A1A] bg-[#FAF7F2]" : ""
                }`}
                onClick={() => setSelectedAlt(index)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">
                          {alt.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {alt.recommended_start_time} -{" "}
                          {alt.recommended_end_time}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm">{alt.name}</h4>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {alt.description}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                        {alt.approximate_cost != null && (
                          <span>~{alt.approximate_cost} {alt.cost_currency}</span>
                        )}
                        {alt.walk_from_previous && (
                          <span>🚶 {alt.walk_from_previous}</span>
                        )}
                        {alt.car_from_previous && (
                          <span>
                            🚗 {alt.car_from_previous}
                            {alt.car_fare_estimate != null && ` (~${alt.car_fare_estimate} ${alt.car_fare_currency})`}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedAlt === index && (
                      <div className="animate-scale-in">
                        <svg
                          className="h-5 w-5 shrink-0 text-[#1A1A1A]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={handleSwap}
              disabled={selectedAlt === null || swapping}
              className="w-full h-14 uppercase tracking-widest text-[10px] font-bold"
            >
              {swapping ? "Swapping..." : "Confirm Swap"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
