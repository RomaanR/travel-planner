"use client";

import { Progress } from "@/components/ui/progress";

const STEP_LABELS = [
  "Destination",
  "Stay",
  "Dates",
  "Group",
  "Interests",
  "Budget",
];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl">
      <div className="mb-3 flex justify-between uppercase tracking-widest text-[9px] text-gray-500">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`transition-colors duration-300 ${
              i === currentStep
                ? "font-bold text-[#1A1A1A]"
                : i < currentStep
                  ? "text-[#1A1A1A]/60"
                  : ""
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <Progress value={percentage} />
      <p className="mt-3 text-center uppercase tracking-widest text-[9px] text-gray-500">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}
