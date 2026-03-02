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
      <div className="mb-3 flex justify-between text-xs text-muted-foreground">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className={`transition-colors duration-300 ${
              i === currentStep
                ? "font-semibold text-primary"
                : i < currentStep
                  ? "text-primary/60"
                  : ""
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <Progress value={percentage} />
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Step {currentStep + 1} of {totalSteps}
      </p>
    </div>
  );
}
