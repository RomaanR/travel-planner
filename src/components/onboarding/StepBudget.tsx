"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { tripFormSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BUDGET_OPTIONS = [
  { value: "budget", label: "Essential", description: "Street food, transit, free culture", icon: "I" },
  { value: "moderate", label: "Balanced", description: "Mid-range dining, curated experiences", icon: "II" },
  { value: "luxury", label: "Unrestricted", description: "Fine dining, private access", icon: "III" },
] as const;

export function StepBudget() {
  const router = useRouter();
  const { formData, updateFormData, prevStep } = useOnboardingStore();
  const [budget, setBudget] = useState(formData.budget || "");
  const [notes, setNotes] = useState(formData.additionalNotes || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!budget) { setError("Please select a budget level"); return; }
    const finalData = { ...formData, budget, additionalNotes: notes || undefined };
    const parsed = tripFormSchema.safeParse(finalData);
    if (!parsed.success) { setError("Please go back and complete all required fields"); return; }
    setIsSubmitting(true);
    try {
      const tripRes = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, startDate: parsed.data.startDate.toISOString(), endDate: parsed.data.endDate.toISOString() }),
      });
      if (!tripRes.ok) throw new Error("Failed to create trip");
      const { tripId } = await tripRes.json();
      fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId }) });
      router.push(`/itinerary/${tripId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Set your parameters</h2>
        <p className="mt-3 text-lg text-muted-foreground italic font-sans">Define your budget expectations</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {BUDGET_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => { setBudget(option.value); setError(""); }}
            className={`rounded-none border p-5 text-center transition-all duration-300 ${
              budget === option.value ? "border-[#1A1A1A] bg-[#FAF7F2] text-[#1A1A1A]" : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-800"
            }`}
          >
            <span className="block text-2xl font-serif italic">{option.icon}</span>
            <span className="block text-[10px] uppercase tracking-widest font-bold font-sans mt-3">{option.label}</span>
            <span className="block text-[10px] text-gray-500 mt-2 font-sans leading-relaxed">{option.description}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2 border border-gray-200 p-6 bg-white">
        <Label htmlFor="notes" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Director's Notes (Optional)</Label>
        <Textarea id="notes" placeholder="e.g., We love hidden alleys, avoid tourist traps..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-800 shadow-none font-sans mt-2" />
      </div>

      {error && <p className="text-sm text-red-800">{error}</p>}

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-none border-gray-300 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-gray-50 transition-all" disabled={isSubmitting}>Back</Button>
        <Button onClick={handleSubmit} className="flex-1 h-14 bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all text-[11px] tracking-[0.2em] uppercase font-bold" disabled={isSubmitting}>
          {isSubmitting ? <span className="flex items-center gap-2 tracking-widest uppercase text-[10px]"><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Architecting...</span> : "Draft Itinerary"}
        </Button>
      </div>
    </div>
  );
}