import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/claude";
import {
  buildItinerarySystemPrompt,
  buildItineraryUserPrompt,
} from "@/lib/prompts";
import type { TripFormData, ClaudeItineraryResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const { tripId } = await request.json();

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: { status: "generating" },
  });

  try {
    const formData: TripFormData = {
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      accommodation: trip.accommodation as TripFormData["accommodation"],
      accommodationAddress: trip.accommodationAddress || undefined,
      groupType: trip.groupType as TripFormData["groupType"],
      groupSize: trip.groupSize,
      pace: trip.pace as TripFormData["pace"],
      budget: trip.budget as TripFormData["budget"],
      preferences: JSON.parse(trip.preferences),
      dietaryNeeds: trip.dietaryNeeds
        ? JSON.parse(trip.dietaryNeeds)
        : undefined,
      additionalNotes: trip.additionalNotes || undefined,
    };

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      system: buildItinerarySystemPrompt(),
      messages: [
        { role: "user", content: buildItineraryUserPrompt(formData) },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse JSON - strip markdown code fences if present
    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    // Clean common JSON issues from LLM output:
    // - trailing commas before } or ]
    // - single-line comments
    jsonStr = jsonStr
      .replace(/\/\/.*$/gm, "")                // remove single-line comments
      .replace(/,\s*([\]}])/g, "$1");           // remove trailing commas

    let itinerary: ClaudeItineraryResponse;
    try {
      itinerary = JSON.parse(jsonStr);
    } catch (parseError) {
      // Try to extract JSON object from surrounding text
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (!match) throw parseError;
      const cleaned = match[0]
        .replace(/\/\/.*$/gm, "")
        .replace(/,\s*([\]}])/g, "$1");
      itinerary = JSON.parse(cleaned);
    }

    // Delete existing itinerary data if regenerating
    await prisma.itineraryDay.deleteMany({ where: { tripId } });

    // Persist to database
    for (const day of itinerary.days) {
      const startDate = new Date(trip.startDate);
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + day.day_number - 1);

      const itineraryDay = await prisma.itineraryDay.create({
        data: {
          tripId,
          dayNumber: day.day_number,
          date: day.date ? new Date(day.date) : dayDate,
          theme: day.theme,
        },
      });

      for (let i = 0; i < day.activities.length; i++) {
        const act = day.activities[i];
        await prisma.activity.create({
          data: {
            dayId: itineraryDay.id,
            sortOrder: i,
            name: act.name,
            description: act.description,
            category: act.category,
            lat: act.lat,
            lng: act.lng,
            startTime: act.recommended_start_time,
            endTime: act.recommended_end_time,
            duration: act.estimated_duration_minutes,
            costEstimate: act.approximate_cost,
            costCurrency: act.cost_currency,
            transitFromPrev: act.transit_from_previous || act.walk_from_previous,
            transitDuration: act.transit_duration_minutes || act.walk_duration_minutes,
            walkFromPrev: act.walk_from_previous,
            walkDuration: act.walk_duration_minutes,
            carFromPrev: act.car_from_previous,
            carDuration: act.car_duration_minutes,
            carFareEstimate: act.car_fare_estimate,
            carFareCurrency: act.car_fare_currency,
          },
        });
      }
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { status: "ready" },
    });

    return NextResponse.json({ success: true, tripId });
  } catch (error) {
    console.error("Generation error:", error);
    await prisma.trip.update({
      where: { id: tripId },
      data: { status: "error" },
    });
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
