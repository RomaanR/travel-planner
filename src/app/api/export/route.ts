import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ItineraryPDF } from "@/components/pdf/ItineraryPDF";

export async function GET(request: NextRequest) {
  const tripId = request.nextUrl.searchParams.get("tripId");
  const fmt = request.nextUrl.searchParams.get("format"); // "pdf" (default) or "txt"

  if (!tripId) {
    return NextResponse.json({ error: "tripId required" }, { status: 400 });
  }

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      itineraryDays: {
        orderBy: { dayNumber: "asc" },
        include: { activities: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  // ── Text format fallback ──────────────────────────────────────────
  if (fmt === "txt") {
    return buildTextResponse(trip);
  }

  // ── PDF format (default) ──────────────────────────────────────────
  try {
    const pdfTrip = {
      destination: trip.destination,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      groupType: trip.groupType,
      groupSize: trip.groupSize,
      pace: trip.pace,
      budget: trip.budget,
      accommodation: trip.accommodation,
      itineraryDays: trip.itineraryDays.map((day) => ({
        dayNumber: day.dayNumber,
        date: day.date.toISOString(),
        theme: day.theme,
        activities: day.activities.map((act) => ({
          sortOrder: act.sortOrder,
          name: act.name,
          description: act.description,
          category: act.category,
          startTime: act.startTime,
          endTime: act.endTime,
          duration: act.duration,
          costEstimate: act.costEstimate,
          costCurrency: act.costCurrency,
          walkFromPrev: act.walkFromPrev,
          carFromPrev: act.carFromPrev,
          carFareEstimate: act.carFareEstimate,
          carFareCurrency: act.carFareCurrency,
          transitFromPrev: act.transitFromPrev,
          lat: act.lat,
          lng: act.lng,
        })),
      })),
    };

    const buffer = await renderToBuffer(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      React.createElement(ItineraryPDF, { trip: pdfTrip }) as any
    );

    const filename = `itinerary-${trip.destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.pdf`;

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    // Fall back to text if PDF fails
    return buildTextResponse(trip);
  }
}

// ── Text export helper ──────────────────────────────────────────────

function buildTextResponse(trip: {
  destination: string;
  startDate: Date;
  endDate: Date;
  groupType: string;
  groupSize: number;
  pace: string;
  budget: string;
  itineraryDays: {
    dayNumber: number;
    date: Date;
    theme: string | null;
    activities: {
      startTime: string;
      endTime: string;
      name: string;
      category: string;
      costEstimate: number | null;
      costCurrency: string | null;
      duration: number;
      description: string;
      walkFromPrev: string | null;
      carFromPrev: string | null;
      carFareEstimate: number | null;
      carFareCurrency: string | null;
      transitFromPrev: string | null;
      lat: number;
      lng: number;
    }[];
  }[];
}) {
  let content = "";
  content += `TRIP TO ${trip.destination.toUpperCase()}\n`;
  content += `${"=".repeat(50)}\n`;
  content += `Dates: ${format(new Date(trip.startDate), "MMM d, yyyy")} - ${format(new Date(trip.endDate), "MMM d, yyyy")}\n`;
  content += `Group: ${trip.groupType} (${trip.groupSize} ${trip.groupSize === 1 ? "person" : "people"})\n`;
  content += `Pace: ${trip.pace} | Budget: ${trip.budget}\n`;
  content += `\n`;

  for (const day of trip.itineraryDays) {
    content += `${"─".repeat(50)}\n`;
    content += `DAY ${day.dayNumber} - ${format(new Date(day.date), "EEEE, MMM d, yyyy")}\n`;
    if (day.theme) content += `Theme: ${day.theme}\n`;
    content += `${"─".repeat(50)}\n\n`;

    for (const act of day.activities) {
      content += `  ${act.startTime} - ${act.endTime}  ${act.name}\n`;
      content += `  ${" ".repeat(15)}${act.category}`;
      if (act.costEstimate != null) {
        content += ` | ~${act.costEstimate} ${act.costCurrency}`;
      }
      content += ` | ${act.duration} min\n`;
      content += `  ${" ".repeat(15)}${act.description}\n`;
      if (act.walkFromPrev || act.carFromPrev) {
        content += `  ${" ".repeat(15)}Getting there:\n`;
        if (act.walkFromPrev) {
          content += `  ${" ".repeat(17)}Walk: ${act.walkFromPrev}\n`;
        }
        if (act.carFromPrev) {
          content += `  ${" ".repeat(17)}Car: ${act.carFromPrev}`;
          if (act.carFareEstimate != null && act.carFareCurrency) {
            content += ` (~${act.carFareEstimate} ${act.carFareCurrency})`;
          }
          content += `\n`;
        }
      } else if (act.transitFromPrev) {
        content += `  ${" ".repeat(15)}Getting there: ${act.transitFromPrev}\n`;
      }
      content += `  ${" ".repeat(15)}Location: ${act.lat.toFixed(4)}, ${act.lng.toFixed(4)}\n`;
      content += `\n`;
    }
  }

  content += `\n${"=".repeat(50)}\n`;
  content += `Generated by TripCraft - AI Travel Planner\n`;

  const filename = `itinerary-${trip.destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
