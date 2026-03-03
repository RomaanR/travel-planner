"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { PREFERENCE_OPTIONS, DIETARY_OPTIONS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const PACE_OPTIONS = [
  { value: "relaxed", label: "Relaxed", description: "3-4 activities/day" },
  { value: "moderate", label: "Moderate", description: "4-5 activities/day" },
  { value: "packed", label: "Packed", description: "6-7 activities/day" },
] as const;

export function StepPreferences() {
  const { formData, updateFormData, nextStep, prevStep } = useOnboardingStore();
  const [preferences, setPreferences] = useState<string[]>(formData.preferences || []);
  const [pace, setPace] = useState(formData.pace || "");
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>(formData.dietaryNeeds || []);
  const [error, setError] = useState("");

  const togglePreference = (value: string) => { setPreferences((prev) => prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]); setError(""); };
  const toggleDietary = (value: string) => { if (value === "none") { setDietaryNeeds([]); return; } setDietaryNeeds((prev) => prev.includes(value) ? prev.filter((d) => d !== value) : [...prev.filter((d) => d !== "none"), value]); };

  const handleSubmit = () => {
    if (preferences.length === 0) { setError("Select at least one interest"); return; }
    if (!pace) { setError("Please select a pace"); return; }
    updateFormData({ preferences, pace: pace as "relaxed" | "moderate" | "packed", dietaryNeeds });
    nextStep();
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">What defines a good trip?</h2>
        <p className="mt-3 text-lg text-muted-foreground italic font-sans">Curate your experiences</p>
      </div>

      <div className="space-y-4">
        <Label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Interests</Label>
        <div className="flex flex-wrap gap-2">
          {PREFERENCE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => togglePreference(option.value)}
              className={`border px-5 py-3 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-none ${
                preferences.includes(option.value) ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Travel Pace</Label>
        <div className="grid grid-cols-3 gap-2">
          {PACE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => { setPace(option.value); setError(""); }}
              className={`rounded-none border p-4 text-center transition-all duration-300 ${
                pace === option.value ? "border-[#1A1A1A] bg-[#FAF7F2] text-[#1A1A1A]" : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-800"
              }`}
            >
              <span className="block text-sm font-bold font-sans uppercase tracking-widest">{option.label}</span>
              <span className="block text-[10px] text-gray-500 mt-2 font-sans">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Dietary Needs</Label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleDietary(option.value)}
              className={`border px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-none ${
                dietaryNeeds.includes(option.value) ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-800">{error}</p>}

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-none border-gray-300 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-gray-50 transition-all">Back</Button>
        <Button onClick={handleSubmit} className="flex-1 h-14 bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all text-[11px] tracking-[0.2em] uppercase font-bold">Next</Button>
      </div>
    </div>
  );
}