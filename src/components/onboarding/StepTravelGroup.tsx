"use client";

import { useState } from "react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GROUP_TYPES = [
  { value: "solo", label: "Solo", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" },
  { value: "couple", label: "Couple", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
  { value: "family", label: "Family", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
  { value: "friends", label: "Friends", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { value: "business", label: "Business", icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" },
] as const;

export function StepTravelGroup() {
  const { formData, updateFormData, nextStep, prevStep } = useOnboardingStore();
  const [groupType, setGroupType] = useState(formData.groupType || "");
  const [groupSize, setGroupSize] = useState(formData.groupSize || 1);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!groupType) { setError("Please select a group type"); return; }
    updateFormData({ groupType: groupType as "solo" | "couple" | "family" | "friends" | "business", groupSize: groupType === "solo" ? 1 : groupSize });
    nextStep();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Who is traveling?</h2>
        <p className="mt-3 text-lg text-muted-foreground italic font-sans">Tell us about your party</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GROUP_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => { setGroupType(type.value); setError(""); if (type.value === "solo") setGroupSize(1); if (type.value === "couple") setGroupSize(2); }}
            className={`flex flex-col items-center justify-center gap-3 rounded-none border p-6 transition-all duration-300 ${
              groupType === type.value
                ? "border-[#1A1A1A] bg-[#FAF7F2] text-[#1A1A1A]"
                : "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-800"
            }`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d={type.icon} />
            </svg>
            <span className="text-[10px] uppercase tracking-widest font-bold font-sans">{type.label}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-800">{error}</p>}

      {groupType && groupType !== "solo" && (
        <div className="space-y-2 border border-gray-200 p-6 bg-white">
          <Label htmlFor="group-size" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Number of travelers</Label>
          <Input id="group-size" type="number" min={2} max={20} value={groupSize} onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)} className="h-12 rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-800 shadow-none font-sans" />
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button variant="outline" onClick={prevStep} className="flex-1 h-14 rounded-none border-gray-300 text-[11px] tracking-[0.2em] uppercase font-bold hover:bg-gray-50 transition-all">Back</Button>
        <Button onClick={handleSubmit} className="flex-1 h-14 bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all text-[11px] tracking-[0.2em] uppercase font-bold">Next</Button>
      </div>
    </div>
  );
}