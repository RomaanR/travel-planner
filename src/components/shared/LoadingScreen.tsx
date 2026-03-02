"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MESSAGES = [
  "Researching your destination...",
  "Finding the best attractions...",
  "Planning your daily routes...",
  "Discovering great restaurants...",
  "Optimizing your schedule...",
  "Almost there...",
];

export function LoadingScreen({ destination }: { destination?: string }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Skeleton header */}
      <header className="glass shrink-0">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="h-6 w-px bg-border" />
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1 h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Skeleton sidebar */}
        <aside className="hidden md:block w-48 border-r shrink-0 p-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </aside>

        {/* Skeleton timeline */}
        <div className="flex-1 overflow-hidden">
          {/* Loading banner */}
          <div className="px-6 pt-6 pb-2">
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
                <div className="absolute inset-0 animate-pulse-glow rounded-full" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {destination
                    ? `Planning your trip to ${destination}`
                    : "Generating your itinerary"}
                </h2>
                <p
                  key={messageIndex}
                  className="mt-2 text-sm text-muted-foreground animate-fade-in"
                >
                  {MESSAGES[messageIndex]}
                </p>
              </div>
            </div>
          </div>

          {/* Skeleton cards */}
          <div className="px-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="w-px flex-1 bg-border" />
                </div>
                <div className="flex-1 pb-4">
                  {i > 1 && (
                    <Skeleton className="mb-2 h-3 w-40 rounded-full" />
                  )}
                  <div className="flex rounded-2xl border overflow-hidden shadow-apple-sm">
                    <Skeleton className="w-24 sm:w-28 shrink-0 h-28" />
                    <div className="flex-1 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-20 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-3 w-12 rounded-full" />
                        <Skeleton className="h-3 w-16 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton map */}
        <div className="hidden lg:block w-[400px] xl:w-[500px] shrink-0 border-l">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
