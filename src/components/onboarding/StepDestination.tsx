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
        <p className="mt-3 text-lg text-muted-foreground">
          Enter a city, region, or country
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="e.g., Paris, France"
          className="h-14 text-lg rounded-xl shadow-apple-sm focus:shadow-apple"
          {...register("destination")}
        />
        {errors.destination && (
          <p className="text-sm text-destructive">
            {errors.destination.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold shadow-apple-sm hover:shadow-apple"
        size="lg"
      >
        Next
      </Button>
    </form>
  );
}
