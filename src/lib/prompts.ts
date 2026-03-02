import type { TripFormData } from "./types";
import { format, differenceInDays } from "date-fns";

export function buildItinerarySystemPrompt(): string {
  return `You are an expert travel planner with deep knowledge of destinations worldwide.
You create detailed, practical day-by-day travel itineraries.

RULES:
- Activities within each day MUST be geographically clustered to minimize transit time.
- Each day should have a logical flow: morning activities near each other, then move to a new area for afternoon.
- Include realistic transit times between activities for BOTH walking AND car/taxi.
- Respect the traveler's pace preference strictly.
- Account for meal times (breakfast, lunch, dinner) appropriate to the destination's culture.
- Provide accurate latitude/longitude coordinates for each activity.
- Cost estimates should be in the local currency of the destination.
- Start times should be realistic (not before 8:00 unless the traveler prefers a packed schedule).
- Each day should start and end near the accommodation area.
- Consider opening hours and best times to visit each attraction.

BUDGET RULES (CRITICAL - STRICTLY ENFORCE):
- "budget" = LOW BUDGET: ONLY recommend FREE or very cheap activities. Street food, free parks, free temples/shrines, free walking tours, cheap local eateries, public markets, free viewpoints, free museums (or free-entry days). Meals should cost under the equivalent of $10 USD per person. NO expensive restaurants, NO paid attractions over $5 USD equivalent. Prioritize free experiences.
- "moderate" = MID-RANGE: Balance free and paid activities. Restaurants should be mid-range, not fine dining. Paid attractions are fine but avoid luxury experiences.
- "luxury" = HIGH-END: Recommend premium experiences, fine dining, VIP access, exclusive tours, upscale restaurants.

TRANSIT RULES:
- For EVERY activity (except the first of the day), provide BOTH walking and car/taxi transit info from the previous activity.
- Include estimated taxi/ride-hailing fare in local currency.

You MUST respond with valid JSON matching the exact schema provided. Do not include any text outside the JSON. Do not wrap in markdown code fences.`;
}

export function buildItineraryUserPrompt(data: TripFormData): string {
  const numDays = differenceInDays(data.endDate, data.startDate);

  const paceGuide = {
    relaxed: "3-4 activities per day with generous time at each. Include downtime.",
    moderate: "4-5 activities per day with balanced pacing.",
    packed: "6-7 activities per day, maximizing time at the destination.",
  };

  const budgetGuide: Record<string, string> = {
    budget:
      "LOW BUDGET - ONLY free or very cheap options. Street food, free parks, free temples, public markets, free walking areas. Meals MUST be under $10 USD equivalent per person. NO expensive restaurants or high-cost attractions.",
    moderate:
      "MID-RANGE - Mix of free and paid activities. Mid-range restaurants, standard admission fees. No luxury dining or VIP experiences.",
    luxury:
      "HIGH-END - Premium experiences, fine dining, VIP access, exclusive tours, upscale restaurants.",
  };

  return `Plan a ${numDays}-day trip to ${data.destination}.

TRIP DETAILS:
- Dates: ${format(data.startDate, "yyyy-MM-dd")} to ${format(data.endDate, "yyyy-MM-dd")}
- Accommodation type: ${data.accommodation}${data.accommodationAddress ? ` at ${data.accommodationAddress}` : ""}
- Travel group: ${data.groupType} (${data.groupSize} ${data.groupSize === 1 ? "person" : "people"})
- Pace: ${data.pace} - ${paceGuide[data.pace]}
- Budget level: ${data.budget} — ${budgetGuide[data.budget]}
- Interests: ${data.preferences.join(", ")}
${data.dietaryNeeds?.length ? `- Dietary restrictions: ${data.dietaryNeeds.join(", ")}` : ""}
${data.additionalNotes ? `- Additional notes: ${data.additionalNotes}` : ""}

IMPORTANT: Strictly follow the budget level above. Every activity and meal MUST be appropriate for the "${data.budget}" budget tier.

Return a JSON object with this EXACT structure:
{
  "destination": "string",
  "total_days": number,
  "currency": "string (ISO 4217 code)",
  "daily_budget_note": "string (brief note about typical daily spend for this budget level)",
  "days": [
    {
      "day_number": number (starting from 1),
      "date": "YYYY-MM-DD",
      "theme": "string (short theme for the day, e.g. 'Historical City Center')",
      "activities": [
        {
          "name": "string",
          "description": "string (2-3 sentences about the activity)",
          "category": "sightseeing|food|culture|nature|shopping|nightlife|transport|rest",
          "lat": number (latitude),
          "lng": number (longitude),
          "recommended_start_time": "HH:MM (24h format)",
          "recommended_end_time": "HH:MM (24h format)",
          "estimated_duration_minutes": number,
          "approximate_cost": number or null (per person in local currency),
          "cost_currency": "string (ISO 4217)",
          "walk_from_previous": "string or null (e.g. '10 min walk')",
          "walk_duration_minutes": number or null,
          "car_from_previous": "string or null (e.g. '5 min by taxi')",
          "car_duration_minutes": number or null,
          "car_fare_estimate": number or null (estimated taxi/ride fare in local currency),
          "car_fare_currency": "string or null (ISO 4217)"
        }
      ]
    }
  ]
}`;
}

export function buildSwapPrompt(
  activity: {
    name: string;
    category: string;
    startTime: string;
    endTime: string;
  },
  dayTheme: string,
  destination: string,
  preferences: string[],
  budget: string,
  nearbyActivities: { name: string; lat: number; lng: number }[]
): string {
  return `Suggest 3 alternative activities to replace "${activity.name}" (category: ${activity.category}) in a day themed "${dayTheme}" in ${destination}.

The replacement must:
- Fit in the same time slot: ${activity.startTime} to ${activity.endTime}
- Be geographically close to these nearby activities on the same day: ${nearbyActivities.map((a) => `${a.name} (${a.lat}, ${a.lng})`).join("; ")}
- Match traveler preferences: ${preferences.join(", ")}
- Match budget level: ${budget}

IMPORTANT: Strictly respect the budget level. If budget is "budget", only suggest FREE or very cheap alternatives.

Return a JSON array of exactly 3 alternatives. Each object must have this structure:
{
  "name": "string",
  "description": "string",
  "category": "string",
  "lat": number,
  "lng": number,
  "recommended_start_time": "HH:MM",
  "recommended_end_time": "HH:MM",
  "estimated_duration_minutes": number,
  "approximate_cost": number or null,
  "cost_currency": "string",
  "walk_from_previous": "string or null",
  "walk_duration_minutes": number or null,
  "car_from_previous": "string or null",
  "car_duration_minutes": number or null,
  "car_fare_estimate": number or null,
  "car_fare_currency": "string or null"
}

Return ONLY the JSON array, no other text.`;
}
