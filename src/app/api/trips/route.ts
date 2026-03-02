import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tripFormSchema } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = tripFormSchema.safeParse({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const trip = await prisma.trip.create({
      data: {
        destination: data.destination,
        accommodation: data.accommodation,
        accommodationAddress: data.accommodationAddress || null,
        startDate: data.startDate,
        endDate: data.endDate,
        groupType: data.groupType,
        groupSize: data.groupSize,
        pace: data.pace,
        budget: data.budget,
        preferences: JSON.stringify(data.preferences),
        dietaryNeeds: data.dietaryNeeds
          ? JSON.stringify(data.dietaryNeeds)
          : null,
        additionalNotes: data.additionalNotes || null,
        status: "draft",
      },
    });

    return NextResponse.json({ tripId: trip.id });
  } catch (error) {
    console.error("Trip creation error:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const tripId = request.nextUrl.searchParams.get("tripId");

  if (!tripId) {
    return NextResponse.json({ error: "tripId required" }, { status: 400 });
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      itineraryDays: {
        orderBy: { dayNumber: "asc" },
        include: {
          activities: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json(trip);
}
