"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { PREFERENCE_OPTIONS, DIETARY_OPTIONS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PACE_OPTIONS = [
  {
    value: "relaxed",
    label: "Relaxed",
    description: "3-4 activities/day, plenty of downtime",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "4-5 activities/day, balanced pacing",
  },
  {
    value: "packed",
    label: "Packed",
    description: "6-7 activities/day, see everything",
  },
] as const;

export function StepPreferences() {
  const { formData, updateFormData, nextStep, prevStep } =
    useOnboardingStore();
  const [preferences, setPreferences] = useState<string[]>(
    formData.preferences || []
  );
  const [pace, setPace] = useState(formData.pace || "");
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>(
    formData.dietaryNeeds || []
  );
  const [error, setError] = useState("");

  const togglePreference = (value: string) => {
    setPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
    setError("");
  };

  const toggleDietary = (value: string) => {
    if (value === "none") {
      setDietaryNeeds([]);
      return;
    }
    setDietaryNeeds((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev.filter((d) => d !== "none"), value]
    );
  };

  const handleSubmit = () => {
    if (preferences.length === 0) {
      setError("Select at least one interest");
      return;
    }
    if (!pace) {
      setError("Please select a pace");
      return;
    }
    updateFormData({
      preferences,
      pace: pace as "relaxed" | "moderate" | "packed",
      dietaryNeeds,
    });
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          What do you enjoy?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Select your interests and travel pace
        </p>
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <Label>Interests (select all that apply)</Label>
        <div className="grid grid-cols-2 gap-2">
          {PREFERENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => togglePreference(option.value)}
              className={`rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] ${
                preferences.includes(option.value)
                  ? "border-primary bg-primary/5 shadow-apple-sm"
                  : "border-border"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pace */}
      <div className="space-y-3">
        <Label>Travel pace</Label>
        <div className="grid grid-cols-3 gap-2">
          {PACE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setPace(option.value);
                setError("");
              }}
              className={`rounded-2xl border-2 p-4 text-center transition-all duration-200 hover:border-primary/40 hover:shadow-apple hover:scale-[1.02] active:scale-[0.98] ${
                pace === option.value
                  ? "border-primary bg-primary/5 shadow-apple"
                  : "border-border"
              }`}
            >
              <span className="block text-sm font-semibold">
                {option.label}
              </span>
              <span className="block text-xs text-muted-foreground mt-1">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dietary */}
      <div className="space-y-3">
        <Label>Dietary restrictions (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleDietary(option.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:border-primary/40 hover:scale-[1.05] active:scale-[0.95] ${
                dietaryNeeds.includes(option.value)
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1 h-12 text-base"
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1 h-12 text-base font-semibold shadow-apple-sm hover:shadow-apple"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
