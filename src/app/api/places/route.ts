import { NextRequest, NextResponse } from "next/server";

// Google Places API - fetch real-time data for activities
// Uses Text Search to find places and get pricing/rating info

interface PlaceResult {
  activityId: string;
  placeId: string | null;
  name: string;
  rating: number | null;
  userRatingsTotal: number | null;
  priceLevel: number | null; // 0-4 (Free to Very Expensive)
  priceLevelLabel: string | null;
  openNow: boolean | null;
  photoRef: string | null;
  formattedAddress: string | null;
}

const PRICE_LABELS: Record<number, string> = {
  0: "Free",
  1: "Inexpensive",
  2: "Moderate",
  3: "Expensive",
  4: "Very Expensive",
};

export async function POST(request: NextRequest) {
  // Use server-side key if available, fall back to public key
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "your-google-maps-key-here") {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 400 }
    );
  }

  try {
    const { activities } = await request.json();

    if (!activities || !Array.isArray(activities)) {
      return NextResponse.json(
        { error: "activities array required" },
        { status: 400 }
      );
    }

    const results: PlaceResult[] = [];

    // Process activities in parallel (batch of 5 at a time to avoid rate limits)
    const batchSize = 5;
    for (let i = 0; i < activities.length; i += batchSize) {
      const batch = activities.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(
          async (act: {
            id: string;
            name: string;
            lat: number;
            lng: number;
          }) => {
            try {
              // Use Text Search API to find the place
              const searchUrl = new URL(
                "https://maps.googleapis.com/maps/api/place/textsearch/json"
              );
              searchUrl.searchParams.set("query", act.name);
              searchUrl.searchParams.set(
                "location",
                `${act.lat},${act.lng}`
              );
              searchUrl.searchParams.set("radius", "500"); // 500m radius
              searchUrl.searchParams.set("key", apiKey);

              const res = await fetch(searchUrl.toString());
              const data = await res.json();

              if (data.results && data.results.length > 0) {
                const place = data.results[0];

                return {
                  activityId: act.id,
                  placeId: place.place_id || null,
                  name: place.name || act.name,
                  rating: place.rating ?? null,
                  userRatingsTotal: place.user_ratings_total ?? null,
                  priceLevel: place.price_level ?? null,
                  priceLevelLabel: place.price_level != null
                    ? PRICE_LABELS[place.price_level] || null
                    : null,
                  openNow: place.opening_hours?.open_now ?? null,
                  photoRef: place.photos?.[0]?.photo_reference || null,
                  formattedAddress: place.formatted_address || null,
                } as PlaceResult;
              }

              return {
                activityId: act.id,
                placeId: null,
                name: act.name,
                rating: null,
                userRatingsTotal: null,
                priceLevel: null,
                priceLevelLabel: null,
                openNow: null,
                photoRef: null,
                formattedAddress: null,
              } as PlaceResult;
            } catch {
              return {
                activityId: act.id,
                placeId: null,
                name: act.name,
                rating: null,
                userRatingsTotal: null,
                priceLevel: null,
                priceLevelLabel: null,
                openNow: null,
                photoRef: null,
                formattedAddress: null,
              } as PlaceResult;
            }
          }
        )
      );

      results.push(...batchResults);
    }

    return NextResponse.json({
      results,
      photoBaseUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=${apiKey}`,
    });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch place data" },
      { status: 500 }
    );
  }
}
