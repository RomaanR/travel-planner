"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { TripActivity } from "@/hooks/useTrip";

const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: "bg-blue-100 text-blue-800",
  food: "bg-orange-100 text-orange-800",
  culture: "bg-purple-100 text-purple-800",
  nature: "bg-green-100 text-green-800",
  shopping: "bg-pink-100 text-pink-800",
  nightlife: "bg-indigo-100 text-indigo-800",
  transport: "bg-gray-100 text-gray-800",
  rest: "bg-yellow-100 text-yellow-800",
};

const CATEGORY_ICONS: Record<string, string> = {
  sightseeing: "camera",
  food: "utensils",
  culture: "landmark",
  nature: "trees",
  shopping: "shopping-bag",
  nightlife: "moon",
  transport: "car",
  rest: "coffee",
};

export interface PlaceData {
  activityId: string;
  placeId: string | null;
  name: string;
  rating: number | null;
  userRatingsTotal: number | null;
  priceLevel: number | null;
  priceLevelLabel: string | null;
  openNow: boolean | null;
  photoRef: string | null;
  formattedAddress: string | null;
}

interface ActivityCardProps {
  activity: TripActivity;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onSwap: () => void;
  placeData?: PlaceData | null;
  photoBaseUrl?: string;
}

export function ActivityCard({
  activity,
  index,
  isSelected,
  onClick,
  onSwap,
  placeData,
  photoBaseUrl,
}: ActivityCardProps) {
  const [imgError, setImgError] = useState(false);

  const photoUrl =
    placeData?.photoRef && photoBaseUrl && !imgError
      ? `${photoBaseUrl}&photoreference=${placeData.photoRef}`
      : null;

  const categoryIcon = CATEGORY_ICONS[activity.category] || "map-pin";

  return (
    <div className="flex gap-3">
      {/* Timeline dot and line */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-border" />
      </div>

      {/* Transit info */}
      <div className="flex-1 pb-4">
        {(activity.walkFromPrev || activity.carFromPrev || activity.transitFromPrev) && (
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {/* Walking */}
            {(activity.walkFromPrev || activity.transitFromPrev) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5">
                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                {activity.walkFromPrev || activity.transitFromPrev}
              </span>
            )}
            {/* Car/Taxi */}
            {activity.carFromPrev && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5">
                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                {activity.carFromPrev}
                {activity.carFareEstimate != null && activity.carFareCurrency && (
                  <span className="font-medium text-foreground/70">
                    (~{activity.carFareEstimate} {activity.carFareCurrency})
                  </span>
                )}
              </span>
            )}
          </div>
        )}

        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-apple hover:-translate-y-0.5 overflow-hidden ${
            isSelected ? "ring-2 ring-primary shadow-apple-lg" : ""
          }`}
          onClick={onClick}
        >
          <CardContent className="p-0">
            <div className="flex">
              {/* Photo thumbnail */}
              <div className="relative w-24 sm:w-28 shrink-0">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={activity.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className={`flex h-full w-full items-center justify-center ${
                    CATEGORY_COLORS[activity.category]?.split(" ")[0] || "bg-muted"
                  }`}>
                    <CategoryIcon category={categoryIcon} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {activity.startTime} - {activity.endTime}
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${CATEGORY_COLORS[activity.category] || ""}`}
                      >
                        {activity.category}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm leading-tight">{activity.name}</h4>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span>{activity.duration} min</span>
                      {activity.costEstimate != null && (
                        <span>
                          ~{activity.costEstimate} {activity.costCurrency}
                        </span>
                      )}
                      {/* Google Places data */}
                      {placeData?.rating != null && (
                        <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium">
                          <svg className="h-3 w-3 fill-amber-500" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {placeData.rating.toFixed(1)}
                          {placeData.userRatingsTotal != null && (
                            <span className="text-muted-foreground font-normal">
                              ({placeData.userRatingsTotal.toLocaleString()})
                            </span>
                          )}
                        </span>
                      )}
                      {placeData?.priceLevelLabel && (
                        <span className="text-emerald-600 font-medium">
                          {"$".repeat(placeData.priceLevel ?? 1)} {placeData.priceLevelLabel}
                        </span>
                      )}
                      {placeData?.openNow != null && (
                        <span className={placeData.openNow ? "text-green-600" : "text-red-500"}>
                          {placeData.openNow ? "Open now" : "Closed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Swap button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSwap();
                    }}
                    className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    title="Swap activity"
                  >
                    <svg
                      className="h-4 w-4"
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
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Category icon SVGs for fallback when no photo
function CategoryIcon({ category }: { category: string }) {
  const cls = "h-8 w-8 text-muted-foreground/50";
  switch (category) {
    case "camera":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
      );
    case "utensils":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M16.5 8.625V4.875a2.625 2.625 0 00-2.625-2.625h-3.75A2.625 2.625 0 007.5 4.875v3.75" />
        </svg>
      );
    case "landmark":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
        </svg>
      );
    case "trees":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
        </svg>
      );
    case "shopping-bag":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      );
    case "moon":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      );
    case "coffee":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      );
  }
}
