"use client";

import { create } from "zustand";
import type { TripFormData } from "@/lib/types";

interface OnboardingState {
  currentStep: number;
  direction: "forward" | "backward";
  formData: Partial<TripFormData>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<TripFormData>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 0,
  direction: "forward",
  formData: {
    groupSize: 1,
    preferences: [],
    dietaryNeeds: [],
  },
  setStep: (step) => set({ currentStep: step }),
  nextStep: () =>
    set((state) => ({
      currentStep: state.currentStep + 1,
      direction: "forward",
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
      direction: "backward",
    })),
  updateFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),
  reset: () =>
    set({
      currentStep: 0,
      direction: "forward",
      formData: { groupSize: 1, preferences: [], dietaryNeeds: [] },
    }),
}));
