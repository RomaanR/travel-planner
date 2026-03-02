"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ACCOMMODATION_TYPES = [
  {
    value: "hotel",
    label: "Hotel",
    icon: "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z",
  },
  {
    value: "airbnb",
    label: "Airbnb / Rental",
    icon: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819",
  },
  {
    value: "hostel",
    label: "Hostel",
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  },
  {
    value: "resort",
    label: "Resort",
    icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z",
  },
  {
    value: "other",
    label: "Other",
    icon: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
] as const;

type TripAccommodation = "hotel" | "airbnb" | "hostel" | "resort" | "other";

export function StepAccommodation() {
  const { formData, updateFormData, nextStep, prevStep } =
    useOnboardingStore();
  const [selected, setSelected] = useState(
    formData.accommodation || ""
  );
  const [address, setAddress] = useState(
    formData.accommodationAddress || ""
  );
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!selected) {
      setError("Please select an accommodation type");
      return;
    }
    updateFormData({
      accommodation: selected as TripAccommodation,
      accommodationAddress: address || undefined,
    });
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Where are you staying?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Select your accommodation type
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ACCOMMODATION_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => {
              setSelected(type.value);
              setError("");
            }}
            className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-apple hover:scale-[1.02] active:scale-[0.98] ${
              selected === type.value
                ? "border-primary bg-primary/5 shadow-apple"
                : "border-border"
            }`}
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={type.icon}
              />
            </svg>
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="address">
          Hotel name or address (optional)
        </Label>
        <Input
          id="address"
          placeholder="e.g., Hotel Le Marais, 5th Arrondissement"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

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
