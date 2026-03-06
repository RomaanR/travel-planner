"use client";

import { useOnboardingStore } from "@/stores/onboarding-store";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { StepDestination } from "@/components/onboarding/StepDestination";
import { StepAccommodation } from "@/components/onboarding/StepAccommodation";
import { StepDates } from "@/components/onboarding/StepDates";
import { StepTravelGroup } from "@/components/onboarding/StepTravelGroup";
import { StepPreferences } from "@/components/onboarding/StepPreferences";
import { StepBudget } from "@/components/onboarding/StepBudget";
import Link from "next/link";

const STEPS = [
  StepDestination,
  StepAccommodation,
  StepDates,
  StepTravelGroup,
  StepPreferences,
  StepBudget,
];

export default function PlanPage() {
  const { currentStep, direction } = useOnboardingStore();
  const StepComponent = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <span className="font-bold tracking-tight">TripCraft</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />
        <div
          key={currentStep}
          className={`mt-8 w-full max-w-xl ${
            direction === "forward"
              ? "animate-slide-in-right"
              : "animate-slide-in-left"
          }`}
        >
          <StepComponent />
        </div>
      </main>
    </div>
  );
}
