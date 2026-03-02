"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { differenceInDays, format } from "date-fns";

export function StepDates() {
  const { formData, updateFormData, nextStep, prevStep } =
    useOnboardingStore();

  const [startDate, setStartDate] = useState(
    formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : ""
  );
  const [endDate, setEndDate] = useState(
    formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : ""
  );
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setError("Please select both dates");
      return;
    }

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (end <= start) {
      setError("End date must be after start date");
      return;
    }

    const days = differenceInDays(end, start);
    if (days > 30) {
      setError("Maximum trip duration is 30 days");
      return;
    }

    updateFormData({ startDate: start, endDate: end });
    nextStep();
  };

  const numDays =
    startDate && endDate
      ? differenceInDays(
          new Date(endDate + "T00:00:00"),
          new Date(startDate + "T00:00:00")
        )
      : 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          When are you traveling?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Select your travel dates
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 rounded-2xl border p-4 shadow-apple-sm">
          <Label htmlFor="start-date">Start date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setError("");
            }}
          />
        </div>
        <div className="space-y-2 rounded-2xl border p-4 shadow-apple-sm">
          <Label htmlFor="end-date">End date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setError("");
            }}
          />
        </div>
      </div>

      {numDays > 0 && (
        <p className="text-center text-sm font-medium text-primary">
          {numDays} {numDays === 1 ? "day" : "days"} trip
        </p>
      )}

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
