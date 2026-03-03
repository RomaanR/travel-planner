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
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
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
            activities: activities.map((a) => ({ id: a.id, name: a.name, lat: a.lat, lng: a.lng })),
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

  useEffect(() => {
    if (trip?.status === "ready" && trip.itineraryDays) {
      const currentDayData = trip.itineraryDays.find((d) => d.dayNumber === selectedDay);
      if (currentDayData?.activities) {
        fetchPlacesData(currentDayData.activities, selectedDay);
      }
    }
  }, [trip, selectedDay, fetchPlacesData]);

  if (loading) return <div className="min-h-screen bg-[#FDFCFB]"><LoadingScreen /></div>;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB] font-sans">
        <div className="text-center p-8 border border-gray-200">
          <h2 className="text-xl font-bold tracking-widest uppercase text-red-800 mb-2">System Error</h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <Button onClick={() => refetch()} className="rounded-none bg-[#1A1A1A] text-white uppercase tracking-widest text-[10px]">Try Again</Button>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  if (trip.status === "generating" || trip.status === "draft") {
    return <div className="min-h-screen bg-[#FDFCFB]"><LoadingScreen destination={trip.destination} /></div>;
  }

  if (trip.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFB] font-sans">
        <div className="text-center p-8 border border-gray-200">
          <h2 className="text-xl font-bold tracking-widest uppercase text-red-800 mb-2">Generation Failed</h2>
          <p className="text-sm text-gray-500 mb-6">We could not architect your itinerary. Please try again.</p>
          <Button
            onClick={async () => {
              await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId }) });
              refetch();
            }}
            className="rounded-none bg-[#1A1A1A] text-white uppercase tracking-widest text-[10px]"
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
  const selectedActivity = currentActivities.find((a) => a.id === selectedActivityId);

  const handleSwapActivity = (activityId: string) => {
    const act = currentActivities.find((a) => a.id === activityId);
    if (act) {
      setSwapActivityId(activityId);
      setSwapActivityName(act.name);
      setSwapOpen(true);
    }
  };

  const handleExport = () => { window.open(`/api/export?tripId=${tripId}`, "_blank"); };

  return (
    <div className="flex h-screen flex-col bg-[#FDFCFB] text-[#1A1A1A] font-sans">
      {/* SHARP EDITORIAL HEADER */}
      <header className="shrink-0 sticky top-0 z-50 bg-[#FDFCFB] border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold tracking-tighter italic font-serif hover:text-orange-800 transition-colors">
              TripCraft
            </Link>
            <div className="h-8 w-px bg-gray-200 hidden md:block" />
            <div className="hidden md:block">
              <h1 className="text-xl font-serif italic leading-tight tracking-tight">
                {trip.destination}
              </h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold mt-1">
                {format(new Date(trip.startDate), "MMM d")} — {format(new Date(trip.endDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Minimalist Mobile Toggle */}
            <div className="flex lg:hidden border border-gray-200 p-1">
              <button
                onClick={() => setMobileView("timeline")}
                className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold transition-all ${
                  mobileView === "timeline" ? "bg-[#1A1A1A] text-white" : "text-gray-400 hover:text-[#1A1A1A]"
                }`}
              >
                Journal
              </button>
              <button
                onClick={() => setMobileView("map")}
                className={`px-4 py-2 text-[9px] uppercase tracking-widest font-bold transition-all ${
                  mobileView === "map" ? "bg-[#1A1A1A] text-white" : "text-gray-400 hover:text-[#1A1A1A]"
                }`}
              >
                Map
              </button>
            </div>
            
            {/* Sharp Export Button */}
            <Button variant="outline" className="rounded-none border-gray-300 uppercase text-[10px] tracking-widest px-6 hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-all" onClick={handleExport}>
              <span className="hidden sm:inline">Export Dossier</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden max-w-[1600px] mx-auto w-full">
        {/* Day sidebar */}
        <aside className="hidden md:block w-48 border-r border-gray-200 shrink-0 overflow-hidden bg-[#FAF7F2]/50">
          <DaySidebar days={days} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        </aside>

        {/* Mobile day selector - Minimalist */}
        <div className="md:hidden border-b border-gray-200 shrink-0 absolute top-16 left-0 right-0 z-10 bg-[#FDFCFB] overflow-x-auto">
          <div className="flex gap-2 p-3">
            {days.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.dayNumber)}
                className={`shrink-0 px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all ${
                  selectedDay === day.dayNumber
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-gray-200 text-gray-500 bg-white"
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className={`flex-1 min-w-0 overflow-hidden pt-14 md:pt-0 relative bg-white ${mobileView !== "timeline" ? "hidden lg:block" : ""}`}>
          <Timeline
            activities={currentActivities}
            dayTheme={currentDay?.theme || null}
            selectedActivityId={selectedActivityId}
            onSelectActivity={(id) => { setSelectedActivityId(id); setDetailOpen(true); }}
            onSwapActivity={handleSwapActivity}
            placesData={placesData}
            photoBaseUrl={photoBaseUrl}
          />
          {placesLoading && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 border border-gray-200 bg-white px-6 py-3 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 shadow-2xl flex items-center gap-3">
              <svg className="h-3 w-3 animate-spin text-orange-800" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Cross-referencing Reality...
            </div>
          )}
        </div>

        {/* Map */}
        <div className={`w-full lg:w-[450px] xl:w-[550px] shrink-0 border-l border-gray-200 overflow-hidden pt-14 md:pt-0 ${mobileView !== "map" ? "hidden lg:block" : ""}`}>
          <MapView activities={currentActivities} selectedActivityId={selectedActivityId} onMarkerClick={(id) => { setSelectedActivityId(id); setDetailOpen(true); }} />
        </div>
      </div>

      <ActivityDetail activity={selectedActivity || null} open={detailOpen} onClose={() => setDetailOpen(false)} onSwap={() => { setDetailOpen(false); if (selectedActivityId) { handleSwapActivity(selectedActivityId); } }} />
      <SwapModal activityId={swapActivityId} activityName={swapActivityName} open={swapOpen} onClose={() => setSwapOpen(false)} onSwapComplete={() => { if (swapActivityId) { setPlacesData((prev) => { const next = { ...prev }; delete next[swapActivityId]; return next; }); } setFetchedDays((prev) => { const next = new Set(prev); next.delete(selectedDay); return next; }); refetch(); setSwapOpen(false); }} />
    </div>
  );
}