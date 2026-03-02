import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// ── Types ───────────────────────────────────────────────────────────

interface PDFActivity {
  sortOrder: number;
  name: string;
  description: string;
  category: string;
  startTime: string;
  endTime: string;
  duration: number;
  costEstimate: number | null;
  costCurrency: string | null;
  walkFromPrev: string | null;
  carFromPrev: string | null;
  carFareEstimate: number | null;
  carFareCurrency: string | null;
  transitFromPrev: string | null;
  lat: number;
  lng: number;
}

interface PDFDay {
  dayNumber: number;
  date: string | Date;
  theme: string | null;
  activities: PDFActivity[];
}

interface PDFTrip {
  destination: string;
  startDate: string | Date;
  endDate: string | Date;
  groupType: string;
  groupSize: number;
  pace: string;
  budget: string;
  accommodation: string;
  itineraryDays: PDFDay[];
}

// ── Category colors ─────────────────────────────────────────────────

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  sightseeing: { bg: "#DBEAFE", text: "#1E40AF" },
  food: { bg: "#FFEDD5", text: "#9A3412" },
  culture: { bg: "#F3E8FF", text: "#6B21A8" },
  nature: { bg: "#DCFCE7", text: "#166534" },
  shopping: { bg: "#FCE7F3", text: "#9D174D" },
  nightlife: { bg: "#E0E7FF", text: "#3730A3" },
  transport: { bg: "#F3F4F6", text: "#374151" },
  rest: { bg: "#FEF9C3", text: "#854D0E" },
};

// ── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },

  // Header
  headerBar: {
    backgroundColor: "#1e293b",
    borderRadius: 6,
    padding: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#94a3b8",
    marginBottom: 12,
  },
  headerDetailsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  headerDetailChip: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: "row",
  },
  headerDetailLabel: {
    fontSize: 8,
    color: "#94a3b8",
    marginRight: 4,
  },
  headerDetailValue: {
    fontSize: 8,
    color: "#e2e8f0",
    fontFamily: "Helvetica-Bold",
  },

  // Day section
  daySection: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 6,
  },
  dayNumber: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  dayDate: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    flex: 1,
  },
  dayTheme: {
    fontSize: 9,
    color: "#64748b",
    fontStyle: "italic",
  },

  // Activity row
  activityRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activityTimeCol: {
    width: 70,
    paddingRight: 8,
  },
  activityTime: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
  },
  activityTimeEnd: {
    fontSize: 8,
    color: "#94a3b8",
  },
  activityContentCol: {
    flex: 1,
  },
  activityNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    gap: 6,
  },
  activityName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
  },
  categoryBadge: {
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  categoryText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase" as const,
  },
  activityDescription: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.4,
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  metaItem: {
    fontSize: 8,
    color: "#64748b",
  },
  metaBold: {
    fontFamily: "Helvetica-Bold",
  },

  // Transit
  transitRow: {
    flexDirection: "row",
    marginBottom: 6,
    marginLeft: 70,
    gap: 12,
  },
  transitItem: {
    fontSize: 8,
    color: "#64748b",
    fontStyle: "italic",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
});

// ── Component ───────────────────────────────────────────────────────

export function ItineraryPDF({ trip }: { trip: PDFTrip }) {
  const formatDate = (d: string | Date) => {
    try {
      return format(new Date(d), "EEEE, MMM d, yyyy");
    } catch {
      return String(d);
    }
  };

  const shortDate = (d: string | Date) => {
    try {
      return format(new Date(d), "MMM d, yyyy");
    } catch {
      return String(d);
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>{trip.destination}</Text>
          <Text style={styles.headerSubtitle}>
            {shortDate(trip.startDate)} - {shortDate(trip.endDate)}
          </Text>
          <View style={styles.headerDetailsRow}>
            <View style={styles.headerDetailChip}>
              <Text style={styles.headerDetailLabel}>Group</Text>
              <Text style={styles.headerDetailValue}>
                {trip.groupType} ({trip.groupSize}{" "}
                {trip.groupSize === 1 ? "person" : "people"})
              </Text>
            </View>
            <View style={styles.headerDetailChip}>
              <Text style={styles.headerDetailLabel}>Pace</Text>
              <Text style={styles.headerDetailValue}>{trip.pace}</Text>
            </View>
            <View style={styles.headerDetailChip}>
              <Text style={styles.headerDetailLabel}>Budget</Text>
              <Text style={styles.headerDetailValue}>{trip.budget}</Text>
            </View>
            <View style={styles.headerDetailChip}>
              <Text style={styles.headerDetailLabel}>Stay</Text>
              <Text style={styles.headerDetailValue}>
                {trip.accommodation}
              </Text>
            </View>
          </View>
        </View>

        {/* Days */}
        {trip.itineraryDays.map((day) => (
          <View key={day.dayNumber} style={styles.daySection} wrap={false}>
            {/* Day header */}
            <View style={styles.dayHeader}>
              <Text style={styles.dayNumber}>Day {day.dayNumber}</Text>
              <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
              {day.theme && (
                <Text style={styles.dayTheme}>{day.theme}</Text>
              )}
            </View>

            {/* Activities */}
            {day.activities.map((act, idx) => (
              <View key={idx}>
                {/* Transit info above activity */}
                {(act.walkFromPrev || act.carFromPrev || act.transitFromPrev) && idx > 0 && (
                  <View style={styles.transitRow}>
                    {act.walkFromPrev && (
                      <Text style={styles.transitItem}>
                        Walk: {act.walkFromPrev}
                      </Text>
                    )}
                    {act.carFromPrev && (
                      <Text style={styles.transitItem}>
                        Car: {act.carFromPrev}
                        {act.carFareEstimate != null && act.carFareCurrency
                          ? ` (~${act.carFareEstimate} ${act.carFareCurrency})`
                          : ""}
                      </Text>
                    )}
                    {!act.walkFromPrev && !act.carFromPrev && act.transitFromPrev && (
                      <Text style={styles.transitItem}>
                        {act.transitFromPrev}
                      </Text>
                    )}
                  </View>
                )}

                {/* Activity card */}
                <View style={styles.activityRow}>
                  {/* Time column */}
                  <View style={styles.activityTimeCol}>
                    <Text style={styles.activityTime}>{act.startTime}</Text>
                    <Text style={styles.activityTimeEnd}>{act.endTime}</Text>
                  </View>

                  {/* Content */}
                  <View style={styles.activityContentCol}>
                    <View style={styles.activityNameRow}>
                      <Text style={styles.activityName}>{act.name}</Text>
                      <View
                        style={[
                          styles.categoryBadge,
                          {
                            backgroundColor:
                              CATEGORY_STYLES[act.category]?.bg || "#f3f4f6",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            {
                              color:
                                CATEGORY_STYLES[act.category]?.text || "#374151",
                            },
                          ]}
                        >
                          {act.category}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.activityDescription}>
                      {act.description}
                    </Text>

                    <View style={styles.activityMeta}>
                      <Text style={styles.metaItem}>
                        <Text style={styles.metaBold}>{act.duration}</Text> min
                      </Text>
                      {act.costEstimate != null && (
                        <Text style={styles.metaItem}>
                          ~{act.costEstimate} {act.costCurrency}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by TripCraft - AI Travel Planner</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
