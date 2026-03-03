"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { destinationSchema } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = z.infer<typeof destinationSchema>;

export function StepDestination() {
  const { formData, updateFormData, nextStep } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      destination: formData.destination || "",
    },
  });

  const onSubmit = (data: FormData) => {
    updateFormData(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Where are you going?
        </h2>
        <p className="mt-3 text-lg text-muted-foreground italic font-sans">
          Enter a city, region, or country
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination" className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Destination</Label>
        <Input
          id="destination"
          placeholder="e.g., Paris, France"
          className="h-14 text-lg rounded-none border-gray-300 focus-visible:ring-1 focus-visible:ring-orange-800 shadow-none"
          {...register("destination")}
        />
        {errors.destination && (
          <p className="text-sm text-red-800">
            {errors.destination.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-14 bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all text-[11px] tracking-[0.2em] uppercase font-bold"
      >
        Next
      </Button>
    </form>
  );
}