"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { TripActivity } from "@/hooks/useTrip";

interface MapViewProps {
  activities: TripActivity[];
  selectedActivityId: string | null;
  onMarkerClick: (activityId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: "#3B82F6",
  food: "#F97316",
  culture: "#A855F7",
  nature: "#22C55E",
  shopping: "#EC4899",
  nightlife: "#6366F1",
  transport: "#6B7280",
  rest: "#EAB308",
};

// ── Singleton script loader (DOM-based to survive HMR) ──────────────

function loadGoogleMaps(): Promise<void> {
  // Already loaded
  if (window.google?.maps) return Promise.resolve();

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "your-google-maps-key-here") {
    return Promise.reject(new Error("No API key"));
  }

  // Check if a script tag is already in the DOM (survives HMR & StrictMode)
  const existing = document.querySelector(
    'script[data-gmaps-loader]'
  ) as HTMLScriptElement | null;

  if (existing) {
    // Script tag exists - wait for google.maps to be ready
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  // First time: create and tag the script
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&v=weekly`;
    script.async = true;
    script.setAttribute("data-gmaps-loader", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

// ── Component ───────────────────────────────────────────────────────
export function MapView({
  activities,
  selectedActivityId,
  onMarkerClick,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [mapReady, setMapReady] = useState(!!window.google?.maps);
  const [showRoute, setShowRoute] = useState(true);

  // Load Google Maps script once
  useEffect(() => {
    if (mapReady) return;
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (!cancelled) setMapReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mapReady]);

  const clearOverlays = useCallback(() => {
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
  }, []);

  // Initialize / update the map whenever data changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || activities.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    activities.forEach((act) => bounds.extend({ lat: act.lat, lng: act.lng }));

    // Create map once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: bounds.getCenter(),
        zoom: 13,
        mapId: "tripcraft-map",
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    }

    const map = mapInstanceRef.current;

    // Clear old overlays
    clearOverlays();

    // Add numbered markers with category colors
    activities.forEach((activity, index) => {
      const color = CATEGORY_COLORS[activity.category] || "#1F2937";
      const isSelected = selectedActivityId === activity.id;

      const pinElement = document.createElement("div");
      pinElement.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${isSelected ? "36px" : "30px"};
        height: ${isSelected ? "36px" : "30px"};
        border-radius: 50%;
        background-color: ${color};
        color: white;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        border: 2px solid ${isSelected ? "white" : "rgba(255,255,255,0.5)"};
        transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
        transition: transform 0.2s;
        cursor: pointer;
      `;
      pinElement.textContent = String(index + 1);
      pinElement.title = `${index + 1}. ${activity.name}`;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: activity.lat, lng: activity.lng },
        title: activity.name,
        content: pinElement,
        zIndex: isSelected ? 1000 : index,
      });

      marker.addListener("click", () => onMarkerClick(activity.id));
      markersRef.current.push(marker);
    });

    // Draw dashed route polylines
    if (showRoute && activities.length >= 2) {
      for (let i = 0; i < activities.length - 1; i++) {
        const polyline = new google.maps.Polyline({
          path: [
            { lat: activities[i].lat, lng: activities[i].lng },
            { lat: activities[i + 1].lat, lng: activities[i + 1].lng },
          ],
          geodesic: true,
          strokeColor: "#6366F1",
          strokeOpacity: 0,
          strokeWeight: 3,
          icons: [
            {
              icon: {
                path: "M 0,-1 0,1",
                strokeOpacity: 0.7,
                strokeColor: "#6366F1",
                scale: 3,
              },
              offset: "0",
              repeat: "15px",
            },
          ],
          map,
        });
        polylinesRef.current.push(polyline);
      }
    }

    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [mapReady, activities, selectedActivityId, onMarkerClick, showRoute, clearOverlays]);

  const hasApiKey =
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== "your-google-maps-key-here";

  if (!hasApiKey) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border bg-muted/30 p-6 text-center">
        <svg
          className="mb-3 h-12 w-12 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
          />
        </svg>
        <p className="text-sm font-medium text-muted-foreground">
          Map Preview
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add a Google Maps API key to see the interactive map
        </p>
        {activities.length > 0 && (
          <div className="mt-4 w-full space-y-1">
            {activities.map((act, i) => (
              <button
                key={act.id}
                onClick={() => onMarkerClick(act.id)}
                className={`w-full text-left rounded px-2 py-1 text-xs transition-colors hover:bg-accent ${
                  selectedActivityId === act.id ? "bg-accent" : ""
                }`}
              >
                <span className="font-bold">{i + 1}.</span> {act.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />
      {/* Route toggle */}
      <button
        onClick={() => setShowRoute(!showRoute)}
        className="absolute top-3 right-3 z-10 rounded-md bg-white px-2 py-1 text-xs font-medium shadow-md border hover:bg-gray-50 transition-colors"
      >
        {showRoute ? "Hide Route" : "Show Route"}
      </button>
      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 rounded-md bg-white/90 backdrop-blur-sm p-2 shadow-md border">
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-1">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-gray-600 capitalize">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
