"use client";

import { useState, useEffect, useCallback } from "react";

export interface TripActivity {
  id: string;
  dayId: string;
  sortOrder: number;
  name: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  placeId: string | null;
  startTime: string;
  endTime: string;
  duration: number;
  costEstimate: number | null;
  costCurrency: string | null;
  transitFromPrev: string | null;
  transitDuration: number | null;
  walkFromPrev: string | null;
  walkDuration: number | null;
  carFromPrev: string | null;
  carDuration: number | null;
  carFareEstimate: number | null;
  carFareCurrency: string | null;
  photoUrl: string | null;
  rating: number | null;
}

export interface TripDay {
  id: string;
  tripId: string;
  dayNumber: number;
  date: string;
  theme: string | null;
  activities: TripActivity[];
}

export interface TripData {
  id: string;
  destination: string;
  destinationLat: number | null;
  destinationLng: number | null;
  accommodation: string;
  accommodationAddress: string | null;
  startDate: string;
  endDate: string;
  groupType: string;
  groupSize: number;
  pace: string;
  budget: string;
  preferences: string;
  dietaryNeeds: string | null;
  additionalNotes: string | null;
  status: string;
  itineraryDays: TripDay[];
}

export function useTrip(tripId: string) {
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips?tripId=${tripId}`);
      if (!res.ok) throw new Error("Failed to fetch trip");
      const data = await res.json();
      setTrip(data);
      setLoading(false);
      return data.status as string;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setLoading(false);
      return "error";
    }
  }, [tripId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const poll = async () => {
      const status = await fetchTrip();
      if (status === "generating" || status === "draft") {
        interval = setInterval(async () => {
          const s = await fetchTrip();
          if (s !== "generating" && s !== "draft") {
            clearInterval(interval);
          }
        }, 2000);
      }
    };

    poll();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchTrip]);

  return { trip, loading, error, refetch: fetchTrip };
}
