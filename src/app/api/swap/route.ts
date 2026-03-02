import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anthropic } from "@/lib/claude";
import { buildSwapPrompt } from "@/lib/prompts";
import type { ClaudeActivity } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { activityId } = await request.json();

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        day: {
          include: {
            trip: true,
            activities: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    const trip = activity.day.trip;
    const siblingActivities = activity.day.activities.filter(
      (a) => a.id !== activityId
    );

    const prompt = buildSwapPrompt(
      {
        name: activity.name,
        category: activity.category,
        startTime: activity.startTime,
        endTime: activity.endTime,
      },
      activity.day.theme || "",
      trip.destination,
      JSON.parse(trip.preferences),
      trip.budget,
      siblingActivities.map((a) => ({
        name: a.name,
        lat: a.lat,
        lng: a.lng,
      }))
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    let jsonStr = textBlock?.type === "text" ? textBlock.text.trim() : "[]";
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const alternatives: ClaudeActivity[] = JSON.parse(jsonStr);

    return NextResponse.json({ alternatives });
  } catch (error) {
    console.error("Swap error:", error);
    return NextResponse.json(
      { error: "Failed to get alternatives" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { activityId, replacement } = await request.json();

    const updated = await prisma.activity.update({
      where: { id: activityId },
      data: {
        name: replacement.name,
        description: replacement.description,
        category: replacement.category,
        lat: replacement.lat,
        lng: replacement.lng,
        startTime: replacement.recommended_start_time,
        endTime: replacement.recommended_end_time,
        duration: replacement.estimated_duration_minutes,
        costEstimate: replacement.approximate_cost,
        costCurrency: replacement.cost_currency,
        transitFromPrev: replacement.transit_from_previous || replacement.walk_from_previous,
        transitDuration: replacement.transit_duration_minutes || replacement.walk_duration_minutes,
        walkFromPrev: replacement.walk_from_previous,
        walkDuration: replacement.walk_duration_minutes,
        carFromPrev: replacement.car_from_previous,
        carDuration: replacement.car_duration_minutes,
        carFareEstimate: replacement.car_fare_estimate,
        carFareCurrency: replacement.car_fare_currency,
        placeId: null,
        photoUrl: null,
        rating: null,
      },
    });

    return NextResponse.json({ activity: updated });
  } catch (error) {
    console.error("Swap update error:", error);
    return NextResponse.json(
      { error: "Failed to swap activity" },
      { status: 500 }
    );
  }
}
