"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { differenceInDays, format } from "date-fns";

export function StepDates() {
  const { formData, updateFormData, nextStep, prevStep } = useOnboardingStore();
  const [startDate, setStartDate] = useState(formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : "");
  const [endDate, setEndDate] = useState(formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : "");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!startDate || !endDate) { setError("Please select both dates"); return; }
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    if (end <= start) { setError("End date must be after start date"); return; }
    if (differenceInDays(end, start) > 30) { setError("Maximum trip duration is 30 days"); return; }
    updateFormData({ startDate: start, endDate: end });
    nextStep();
  };

  const numDays = startDate && endDate ? differenceInDays(new Date(endDate + "T00:00:00"), new Date(startDate + "T00:00:00")) : 0;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">When are you traveling?</h2>
        <p className="mt-3 text-lg text-muted-foreground italic font-sans">Select your departure and return</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 border border-gray-200 p-6 bg-white">
          <Label htmlFor="start-date" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Departure</Label>
          <Input id="start-date" type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setError(""); }} className="h-12 rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-800 shadow-none font-sans" />
        </div>
        <div className="space-y-2 border border-gray-200 p-6 bg-white">
          <Label htmlFor="end-date" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Return</Label>
          <Input id="end-date" type="date" value={endDate} min={startDate} onChange={(e) => { setEndDate(e.target.value); setError(""); }} className="h-12 rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-800 shadow-none font-sans" />
        </div>
      </div>

      {numDays > 0 && (
        <p className="text-center text-[10px] uppercase tracking-[0.2em] font-bold text-orange-800">
          Duration: {numDays} {numDays === 1 ? "day" : "days"}
        </p>
      )}
      {error && <p className="text-sm text-red-800">{error}</p>}

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-none border-gray-300 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-gray-50 transition-all">Back</Button>
        <Button onClick={handleSubmit} className="flex-1 h-14 bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all text-[11px] tracking-[0.2em] uppercase font-bold">Next</Button>
      </div>
    </div>
  );
}