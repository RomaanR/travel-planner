"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Compass, MapPin } from "lucide-react";

// Rock-solid high-res Unsplash URLs
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
  feature1: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop", // Paris
  feature2: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1983&auto=format&fit=crop", // Venice
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-serif selection:bg-orange-900 selection:text-white overflow-hidden">
      
      {/* 1. ULTRA-MINIMAL NAVIGATION */}
      <nav className="border-b border-gray-200 relative z-50 bg-[#FDFCFB]/80 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-6 max-w-[1400px] mx-auto font-sans">
          <div className="text-2xl font-bold tracking-tighter italic pe-8 border-r border-gray-200">
            TripCraft
          </div>
          <div className="hidden md:flex flex-1 items-center justify-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
            <Link href="#" className="hover:text-black transition-colors">Manifesto</Link>
            <Link href="#" className="hover:text-black transition-colors">The Archives</Link>
            <Link href="#" className="hover:text-black transition-colors">Curations</Link>
          </div>
          <Button asChild variant="outline" className="rounded-none border-black uppercase text-[10px] tracking-widest px-8 hover:bg-black hover:text-white transition-all duration-500">
            <Link href="/plan">Begin Journey</Link>
          </Button>
        </div>
      </nav>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative w-full max-w-[1400px] mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Typography Side */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 z-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-orange-800" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-orange-800 font-sans">
                Volume I — The Awakening
              </span>
            </div>
            
            <h1 className="text-[15vw] lg:text-[11vw] leading-[0.75] tracking-tighter font-medium mb-10">
              Seek <br />
              <span className="italic text-gray-400 pl-[1ch]">Wander.</span>
            </h1>

            <div className="pl-2 lg:pl-12 max-w-xl border-l border-gray-200">
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed italic mb-10">
                "We do not generate itineraries. We architect the chapters of your next great obsession."
              </p>
              <Button asChild className="group h-16 px-10 bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all duration-500 flex items-center gap-6 text-[11px] tracking-[0.2em] uppercase font-bold w-fit">
                <Link href="/plan">
                  Draft Your Story 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-500" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Image Side (Editorial Offset) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative mt-12 lg:mt-0"
          >
            <div className="absolute -inset-4 border border-gray-200 translate-x-4 translate-y-4" />
            <div className="relative h-[600px] w-full overflow-hidden bg-gray-100">
              <img 
                src={IMAGES.hero}
                alt="Vintage Travel Landscape"
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            
            {/* Elegant Floating Badge */}
            <div className="absolute -bottom-8 -left-8 bg-white border border-gray-200 p-6 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center font-sans">
              <MapPin className="w-5 h-5 mb-2 text-orange-800" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-500">Powered By</span>
              <span className="text-sm font-bold tracking-widest mt-1">CLAUDE 3.5</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. THE PHILOSOPHY (Full Width Banner) */}
      <section className="border-y border-gray-200 bg-[#FAF7F2] py-24">
        <div className="max-w-[1000px] mx-auto px-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-orange-800 mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8 leading-tight">
            Intelligence with a soul. <br/> Data with a pulse.
          </h2>
          <p className="text-lg text-gray-500 font-sans max-w-2xl mx-auto leading-relaxed">
            Standard travel planners cross-reference maps. TripCraft cross-references the human experience. Our engine understands the subtle difference between a "tourist destination" and a "hidden sanctuary."
          </p>
        </div>
      </section>

      {/* 4. EDITORIAL GALLERY */}
      <section className="max-w-[1400px] mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
          
          {/* Feature 1 */}
          <div className="group cursor-pointer">
            <div className="overflow-hidden relative h-[500px] mb-6 border border-gray-200">
              <img 
                src={IMAGES.feature1}
                alt="European Street"
                className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-xs font-sans font-bold text-gray-400 tracking-widest mt-2">01</span>
              <div>
                <h3 className="text-3xl font-medium mb-2">The Aesthetic Routing</h3>
                <p className="text-gray-500 italic">Curated paths that prioritize beauty over speed.</p>
              </div>
            </div>
          </div>

          {/* Feature 2 (Offset to create asymmetry) */}
          <div className="group cursor-pointer md:mt-32">
            <div className="overflow-hidden relative h-[500px] mb-6 border border-gray-200">
              <img 
                src={IMAGES.feature2}
                alt="Venice Canal"
                className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute top-6 left-6 bg-white px-4 py-2 text-[9px] uppercase tracking-[0.3em] font-sans font-bold">
                Live Data
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="text-xs font-sans font-bold text-gray-400 tracking-widest mt-2">02</span>
              <div>
                <h3 className="text-3xl font-medium mb-2">Verified Reality</h3>
                <p className="text-gray-500 italic">Cross-referenced with Google Places. Because a closed café ruins the vibe.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 py-16 text-center font-sans">
        <div className="text-3xl font-serif italic font-bold mb-6">TripCraft</div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">
          Engineered for the Modern Explorer © 2026
        </p>
      </footer>
    </div>
  );
}