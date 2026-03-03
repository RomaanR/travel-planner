"use client";

import { useState } from "react";
import Image from "next/image";
import type { TripActivity } from "@/hooks/useTrip";

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

  return (
    <div className="flex gap-6 group mb-8">
      {/* Editorial Timeline marker */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center border text-[9px] font-bold transition-all duration-300 ${
            isSelected
              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
              : "bg-white text-gray-400 border-gray-300"
          }`}
        >
          {index + 1}
        </div>
        <div className="w-px flex-1 bg-gray-200 my-4" />
      </div>

      {/* Content Area */}
      <div className="flex-1 pb-6">
        
        {/* Transit info styling */}
        {(activity.walkFromPrev || activity.carFromPrev || activity.transitFromPrev) && (
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100 pb-3">
            {(activity.walkFromPrev || activity.transitFromPrev) && (
              <span className="flex items-center gap-2">
                Walk: {activity.walkFromPrev || activity.transitFromPrev}
              </span>
            )}
            {activity.carFromPrev && (
              <span className="flex items-center gap-2">
                Car: {activity.carFromPrev}
                {activity.carFareEstimate != null && activity.carFareCurrency && (
                  <span className="text-gray-300">
                    (~{activity.carFareEstimate} {activity.carFareCurrency})
                  </span>
                )}
              </span>
            )}
          </div>
        )}

        <div
          className={`flex cursor-pointer transition-all duration-500 bg-white border ${
            isSelected ? "border-[#1A1A1A] shadow-xl" : "border-transparent hover:border-gray-200 shadow-sm"
          }`}
          onClick={onClick}
        >
          {/* Grayscale Photo thumbnail */}
          <div className="relative w-32 sm:w-48 shrink-0 overflow-hidden bg-gray-100">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={activity.name}
                fill
                sizes="(max-width: 640px) 128px, 192px"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                No Image
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  {activity.startTime} — {activity.endTime}
                </span>
                <span className="border border-gray-200 px-2 py-1 text-[8px] uppercase tracking-widest text-gray-500 font-bold bg-[#FAF7F2]">
                  {activity.category}
                </span>
              </div>
              <h4 className="font-serif text-xl md:text-2xl leading-tight mb-2 text-[#1A1A1A]">{activity.name}</h4>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 italic font-serif">
                {activity.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <span>{activity.duration} min</span>
                {activity.costEstimate != null && (
                  <span>~{activity.costEstimate} {activity.costCurrency}</span>
                )}
                {/* Google Places Live Data */}
                {placeData?.rating != null && (
                  <span className="text-orange-800">
                    ★ {placeData.rating.toFixed(1)} <span className="text-gray-300 font-normal">({placeData.userRatingsTotal?.toLocaleString()})</span>
                  </span>
                )}
                {placeData?.openNow != null && (
                  <span className={placeData.openNow ? "text-green-600" : "text-red-500"}>
                    {placeData.openNow ? "Open" : "Closed"}
                  </span>
                )}
              </div>

              {/* Swap button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSwap();
                }}
                className="text-[9px] uppercase tracking-widest font-bold border-b border-gray-300 text-gray-400 hover:text-[#1A1A1A] hover:border-[#1A1A1A] transition-all pb-0.5"
                title="Swap activity"
              >
                Swap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}