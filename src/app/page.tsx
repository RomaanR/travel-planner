import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI-Powered Planning",
    description:
      "Tell us your preferences and let AI craft the perfect day-by-day itinerary tailored to your interests, budget, and pace.",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Smart Routing",
    description:
      "Activities are geographically clustered to minimize travel time. See routes on an interactive map with transit details.",
    icon: "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Offline Export",
    description:
      "Download your complete itinerary as a PDF with all addresses, times, and details ready for offline use.",
    icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
    color: "bg-violet-50 text-violet-600",
  },
];

const steps = [
  {
    number: 1,
    title: "Tell Us About Your Trip",
    description:
      "Destination, dates, who you're traveling with, and what you love.",
  },
  {
    number: 2,
    title: "AI Generates Your Plan",
    description:
      "Our AI creates a day-by-day itinerary with smart routing and realistic timing.",
  },
  {
    number: 3,
    title: "Customize & Export",
    description:
      "Swap activities, explore on the map, and download your itinerary as a PDF.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-primary"
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
            <span className="text-xl font-bold tracking-tight">TripCraft</span>
          </div>
          <Link href="/plan">
            <Button size="sm" className="rounded-full px-5">
              Plan a Trip
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.25_264_/_8%),transparent)]" />

        <div className="mx-auto max-w-6xl px-4 py-32 text-center lg:py-40">
          <h1 className="animate-fade-in-up text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Your Perfect Trip,
            <br />
            <span className="text-gradient">Planned by AI</span>
          </h1>
          <p className="animate-fade-in-up delay-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Enter your destination, preferences, and budget. Get a complete
            day-by-day itinerary with smart routing, restaurant picks, and
            activity suggestions — all optimized for your travel style.
          </p>
          <div className="animate-fade-in-up delay-4 mt-10 flex justify-center gap-4">
            <Link href="/plan">
              <Button
                size="lg"
                className="rounded-full px-10 text-base shadow-apple hover:shadow-apple-lg hover:scale-[1.02]"
              >
                Plan Your Trip
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="animate-fade-in-up mb-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How It Works
        </h2>
        <p className="animate-fade-in-up delay-1 mb-16 text-center text-lg text-muted-foreground">
          Three simple steps to your perfect itinerary
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="animate-fade-in-up text-center"
              style={{ animationDelay: `${step.number * 100}ms` }}
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold shadow-apple">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="animate-fade-in-up group rounded-2xl bg-card p-6 shadow-apple-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-apple-lg"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16 text-center">
        <p className="text-xs text-muted-foreground">
          TripCraft — AI-powered travel planning
        </p>
      </footer>
    </div>
  );
}
