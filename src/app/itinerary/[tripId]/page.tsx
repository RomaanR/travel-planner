"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTrip } from "@/hooks/useTrip";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { DaySidebar } from "@/components/itinerary/DaySidebar";
import { Timeline } from "@/components/itinerary/Timeline";
import { MapView } from "@/components/itinerary/MapView";
import { ActivityDetail } from "@/components/itinerary/ActivityDetail";
import { SwapModal } from "@/components/itinerary/SwapModal";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { PlaceData } from "@/components/itinerary/ActivityCard";

export default function ItineraryPage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const { trip, loading, error, refetch } = useTrip(tripId);

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  const [detailOpen, setDetailOpen] = useState(false);
  const [swapActivityId, setSwapActivityId] = useState<string | null>(null);
  const [swapActivityName, setSwapActivityName] = useState("");
  const [swapOpen, setSwapOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"timeline" | "map">("timeline");

  // Google Places data
  const [placesData, setPlacesData] = useState<Record<string, PlaceData>>({});
  const [photoBaseUrl, setPhotoBaseUrl] = useState<string>("");
  const [placesLoading, setPlacesLoading] = useState(false);
  const [fetchedDays, setFetchedDays] = useState<Set<number>>(new Set());

  const fetchPlacesData = useCallback(
    async (activities: { id: string; name: string; lat: number; lng: number }[], dayNum: number) => {
      if (fetchedDays.has(dayNum) || activities.length === 0) return;

      setPlacesLoading(true);
      try {
        const res = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activities: activities.map((a) => ({
              id: a.id,
              name: a.name,
              lat: a.lat,
              lng: a.lng,
            })),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.results) {
            const newPlaces: Record<string, PlaceData> = {};
            for (const result of data.results) {
              newPlaces[result.activityId] = result;
            }
            setPlacesData((prev) => ({ ...prev, ...newPlaces }));
            setPhotoBaseUrl(data.photoBaseUrl || "");
            setFetchedDays((prev) => new Set(prev).add(dayNum));
          }
        }
      } catch {
        // Silently fail - places data is optional
      } finally {
        setPlacesLoading(false);
      }
    },
    [fetchedDays]
  );

  // Fetch places data when day changes and trip is ready
  useEffect(() => {
    if (trip?.status === "ready" && trip.itineraryDays) {
      const currentDayData = trip.itineraryDays.find(
        (d) => d.dayNumber === selectedDay
      );
      if (currentDayData?.activities) {
        fetchPlacesData(currentDayData.activities, selectedDay);
      }
    }
  }, [trip, selectedDay, fetchPlacesData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Something went wrong
          </h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  if (trip.status === "generating" || trip.status === "draft") {
    return (
      <div className="min-h-screen bg-background">
        <LoadingScreen destination={trip.destination} />
      </div>
    );
  }

  if (trip.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">
            Generation failed
          </h2>
          <p className="mt-2 text-muted-foreground">
            We could not generate an itinerary. Please try again.
          </p>
          <Button
            onClick={async () => {
              await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tripId }),
              });
              refetch();
            }}
            className="mt-4"
          >
            Retry Generation
          </Button>
        </div>
      </div>
    );
  }

  const days = trip.itineraryDays;
  const currentDay = days.find((d) => d.dayNumber === selectedDay);
  const currentActivities = currentDay?.activities || [];

  const selectedActivity = currentActivities.find(
    (a) => a.id === selectedActivityId
  );

  const handleSwapActivity = (activityId: string) => {
    const act = currentActivities.find((a) => a.id === activityId);
    if (act) {
      setSwapActivityId(activityId);
      setSwapActivityName(act.name);
      setSwapOpen(true);
    }
  };

  const handleExport = () => {
    window.open(`/api/export?tripId=${tripId}`, "_blank");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="glass shrink-0 sticky top-0 z-50">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              <span className="font-bold hidden sm:inline">TripCraft</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="text-sm font-semibold leading-tight">
                {trip.destination}
              </h1>
              <p className="text-xs text-muted-foreground">
                {format(new Date(trip.startDate), "MMM d")} -{" "}
                {format(new Date(trip.endDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile view toggle — Apple segmented control */}
            <div className="flex lg:hidden rounded-full bg-muted/80 p-0.5 backdrop-blur-sm">
              <button
                onClick={() => setMobileView("timeline")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  mobileView === "timeline"
                    ? "bg-white shadow-apple-sm text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setMobileView("map")}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  mobileView === "map"
                    ? "bg-white shadow-apple-sm text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Map
              </button>
            </div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={handleExport}>
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Day sidebar - hidden on mobile */}
        <aside className="hidden md:block w-48 border-r shrink-0 overflow-hidden">
          <DaySidebar
            days={days}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
          />
        </aside>

        {/* Mobile day selector */}
        <div className="md:hidden border-b shrink-0 absolute top-14 left-0 right-0 z-10 glass-subtle overflow-x-auto">
          <div className="flex gap-1 p-2">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.dayNumber)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedDay === day.dayNumber
                    ? "bg-primary text-primary-foreground shadow-apple-sm"
                    : "bg-muted"
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline - shown on desktop, toggled on mobile */}
        <div
          className={`flex-1 min-w-0 overflow-hidden ${
            mobileView !== "timeline" ? "hidden lg:block" : ""
          }`}
        >
          <Timeline
            activities={currentActivities}
            dayTheme={currentDay?.theme || null}
            selectedActivityId={selectedActivityId}
            onSelectActivity={(id) => {
              setSelectedActivityId(id);
              setDetailOpen(true);
            }}
            onSwapActivity={handleSwapActivity}
            placesData={placesData}
            photoBaseUrl={photoBaseUrl}
          />
          {placesLoading && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 rounded-full bg-primary/90 text-primary-foreground px-3 py-1 text-xs shadow-lg">
              Fetching live data from Google...
            </div>
          )}
        </div>

        {/* Map - shown on desktop, toggled on mobile */}
        <div
          className={`w-full lg:w-[400px] xl:w-[500px] shrink-0 border-l overflow-hidden ${
            mobileView !== "map" ? "hidden lg:block" : ""
          }`}
        >
          <MapView
            activities={currentActivities}
            selectedActivityId={selectedActivityId}
            onMarkerClick={(id) => {
              setSelectedActivityId(id);
              setDetailOpen(true);
            }}
          />
        </div>
      </div>

      {/* Activity Detail Dialog */}
      <ActivityDetail
        activity={selectedActivity || null}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onSwap={() => {
          setDetailOpen(false);
          if (selectedActivityId) {
            handleSwapActivity(selectedActivityId);
          }
        }}
      />

      {/* Swap Modal */}
      <SwapModal
        activityId={swapActivityId}
        activityName={swapActivityName}
        open={swapOpen}
        onClose={() => setSwapOpen(false)}
        onSwapComplete={() => {
          refetch();
          setSwapOpen(false);
        }}
      />
    </div>
  );
}
