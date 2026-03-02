"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { tripFormSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BUDGET_OPTIONS = [
  {
    value: "budget",
    label: "Budget",
    description: "Street food, public transit, free attractions",
    icon: "$",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Mid-range restaurants, mix of paid/free activities",
    icon: "$$",
  },
  {
    value: "luxury",
    label: "Luxury",
    description: "Fine dining, private tours, premium experiences",
    icon: "$$$",
  },
] as const;

export function StepBudget() {
  const router = useRouter();
  const { formData, updateFormData, prevStep } = useOnboardingStore();
  const [budget, setBudget] = useState(formData.budget || "");
  const [notes, setNotes] = useState(formData.additionalNotes || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!budget) {
      setError("Please select a budget level");
      return;
    }

    const finalData = {
      ...formData,
      budget,
      additionalNotes: notes || undefined,
    };

    const parsed = tripFormSchema.safeParse(finalData);
    if (!parsed.success) {
      setError("Please go back and complete all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create trip
      const tripRes = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          startDate: parsed.data.startDate.toISOString(),
          endDate: parsed.data.endDate.toISOString(),
        }),
      });

      if (!tripRes.ok) throw new Error("Failed to create trip");

      const { tripId } = await tripRes.json();

      // Trigger generation
      fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId }),
      });

      // Navigate to itinerary page (generation happens in background)
      router.push(`/itinerary/${tripId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          What is your budget?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          This helps us recommend the right experiences
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {BUDGET_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setBudget(option.value);
              setError("");
            }}
            className={`rounded-2xl border-2 p-5 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-apple hover:scale-[1.02] active:scale-[0.98] ${
              budget === option.value
                ? "border-primary bg-primary/5 shadow-apple"
                : "border-border"
            }`}
          >
            <span className={`block text-2xl font-bold ${
              budget === option.value ? "text-gradient" : ""
            }`}>
              {option.icon}
            </span>
            <span className="block text-sm font-semibold mt-1">
              {option.label}
            </span>
            <span className="block text-xs text-muted-foreground mt-1 leading-relaxed">
              {option.description}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Anything else we should know? (optional)</Label>
        <Textarea
          id="notes"
          placeholder="e.g., We love hidden gems, avoid tourist traps, want to try local street food..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="rounded-xl"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1 h-12 text-base"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] hover:shadow-apple-lg hover:scale-[1.02] text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating...
            </span>
          ) : (
            "Generate My Itinerary"
          )}
        </Button>
      </div>
    </div>
  );
}
