import { z } from "zod";

// ─── Onboarding Form Schemas ─────────────────────────────────────

export const PREFERENCE_OPTIONS = [
  { value: "sightseeing", label: "Sightseeing" },
  { value: "museums", label: "Museums & Art" },
  { value: "food", label: "Food & Dining" },
  { value: "nature", label: "Nature & Parks" },
  { value: "shopping", label: "Shopping" },
  { value: "nightlife", label: "Nightlife" },
  { value: "culture", label: "Culture & History" },
  { value: "adventure", label: "Adventure & Sports" },
  { value: "relaxation", label: "Relaxation & Wellness" },
  { value: "photography", label: "Photography" },
] as const;

export const DIETARY_OPTIONS = [
  { value: "none", label: "No restrictions" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "halal", label: "Halal" },
  { value: "kosher", label: "Kosher" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
] as const;

export const destinationSchema = z.object({
  destination: z.string().min(2, "Please enter a destination"),
});

export const accommodationSchema = z.object({
  accommodation: z.enum(["hotel", "airbnb", "hostel", "resort", "other"]),
  accommodationAddress: z.string().optional(),
});

export const datesSchema = z
  .object({
    startDate: z.coerce.date({ error: "Start date is required" }),
    endDate: z.coerce.date({ error: "End date is required" }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export const travelGroupSchema = z.object({
  groupType: z.enum(["solo", "couple", "family", "friends", "business"]),
  groupSize: z.coerce.number().min(1).max(20),
});

export const preferencesSchema = z.object({
  pace: z.enum(["relaxed", "moderate", "packed"]),
  preferences: z.array(z.string()).min(1, "Select at least one interest"),
  dietaryNeeds: z.array(z.string()).optional(),
});

export const budgetSchema = z.object({
  budget: z.enum(["budget", "moderate", "luxury"]),
  additionalNotes: z.string().optional(),
});

export const tripFormSchema = z.object({
  destination: z.string().min(2),
  accommodation: z.enum(["hotel", "airbnb", "hostel", "resort", "other"]),
  accommodationAddress: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  groupType: z.enum(["solo", "couple", "family", "friends", "business"]),
  groupSize: z.coerce.number().min(1).max(20),
  pace: z.enum(["relaxed", "moderate", "packed"]),
  budget: z.enum(["budget", "moderate", "luxury"]),
  preferences: z.array(z.string()).min(1),
  dietaryNeeds: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
});

export type TripFormData = z.infer<typeof tripFormSchema>;

// ─── Claude Response Types ──────────────────────────────────────

export interface ClaudeActivity {
  name: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  recommended_start_time: string;
  recommended_end_time: string;
  estimated_duration_minutes: number;
  approximate_cost: number | null;
  cost_currency: string;
  // Legacy field (backward compat)
  transit_from_previous?: string | null;
  transit_duration_minutes?: number | null;
  // New walk + car transit fields
  walk_from_previous: string | null;
  walk_duration_minutes: number | null;
  car_from_previous: string | null;
  car_duration_minutes: number | null;
  car_fare_estimate: number | null;
  car_fare_currency: string | null;
}

export interface ClaudeDay {
  day_number: number;
  date: string;
  theme: string;
  activities: ClaudeActivity[];
}

export interface ClaudeItineraryResponse {
  destination: string;
  total_days: number;
  currency: string;
  daily_budget_note: string;
  days: ClaudeDay[];
}
