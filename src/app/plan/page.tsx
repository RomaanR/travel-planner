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
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-[#FAF9F6] font-serif text-[#1A1A1A] flex flex-col">
      {/* MINIMALIST HEADER */}
      <header className="border-b border-gray-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tighter italic hover:text-orange-800 transition-colors">
            TripCraft
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
              Entry No. {currentStep + 1} / {STEPS.length}
            </span>
          </div>
        </div>
        {/* Custom thin progress bar */}
        <div className="h-[2px] bg-gray-100 w-full">
            <motion.div 
                className="h-full bg-orange-800"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* THE LUGGAGE TAG / DOCUMENT CONTAINER */}
          <motion.div 
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Aesthetic "Punch Hole" for the Luggage Tag look */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#FAF9F6] border-r border-gray-200 rounded-full z-10 hidden md:block" />
            
            <div className="p-8 md:p-12">
              <div className="mb-10">
                <h2 className="text-[10px] uppercase tracking-[0.3em] text-orange-800 font-bold mb-2">
                  Travel Manifest
                </h2>
                <div className="h-px bg-gray-100 w-full" />
              </div>

              {/* RENDER THE UNTOUCHED LOGIC COMPONENTS HERE */}
              <div className="min-h-[300px]">
                <StepComponent />
              </div>
            </div>

            {/* Subtle Texture/Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
          </motion.div>
          
          <p className="text-center mt-8 text-[10px] uppercase tracking-widest text-gray-400">
            All data is encrypted & stored in your secure journal.
          </p>
        </div>
      </main>
    </div>
  );
}