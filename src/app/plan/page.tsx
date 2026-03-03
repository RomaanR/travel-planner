"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Compass } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-serif selection:bg-orange-100">
      {/* NAVIGATION */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto font-sans">
        <div className="text-2xl font-bold tracking-tighter italic">TripCraft</div>
        <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400">
          <Link href="#" className="hover:text-black transition-colors">The Process</Link>
          <Link href="#" className="hover:text-black transition-colors">Journal</Link>
          <Link href="#" className="hover:text-black transition-colors">Destinations</Link>
        </div>
        {/* NEW BUTTON: Black, Sharp, Minimalist */}
        <Button asChild variant="outline" className="rounded-none border-black uppercase text-[10px] tracking-widest px-8 hover:bg-black hover:text-white transition-all duration-300">
          <Link href="/plan">Get Started</Link>
        </Button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end gap-16 mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[14vw] md:text-[9vw] leading-[0.8] tracking-tighter font-medium"
          >
            Seek <br /> <span className="ml-[1ch]">Wander.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-md pb-6"
          >
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed italic mb-10">
              "We don't just build itineraries; we curate the chapters of your next great story."
            </p>
            {/* THE PRIMARY BUTTON: No Blue. All Soul. */}
            <Button asChild className="group h-16 px-10 bg-[#1A1A1A] text-white rounded-none hover:bg-orange-950 transition-all flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase font-bold">
              <Link href="/plan" className="flex items-center gap-4">
                Start Your Story 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[500px]">
          <motion.div 
            whileHover={{ scale: 0.995 }}
            className="md:col-span-7 bg-gray-200 overflow-hidden relative group cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1493246507139-91e8bef99c1e?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Mountain View"
            />
            <div className="absolute bottom-8 left-8 text-white">
              <span className="text-[10px] uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20">Volume I</span>
              <h3 className="text-4xl mt-4 font-medium tracking-tight">The Alpine Escape</h3>
            </div>
          </motion.div>

          <div className="md:col-span-5 grid grid-rows-2 gap-6">
            <div className="bg-[#FAF7F2] p-10 flex flex-col justify-between border border-orange-100/50">
              <Sparkles className="text-orange-900 w-8 h-8 opacity-40" />
              <div>
                <h4 className="text-2xl font-medium mb-3 tracking-tight font-sans">AI with Soul</h4>
                <p className="text-gray-500 leading-relaxed text-sm italic">Our engine understands 'vibe' as much as 'coordinates'.</p>
              </div>
            </div>
            <div className="bg-white p-10 flex flex-col justify-between border border-gray-100 shadow-sm">
              <Compass className="text-gray-400 w-8 h-8 opacity-30" />
              <div>
                <h4 className="text-2xl font-medium mb-3 tracking-tight font-sans">Verified Truth</h4>
                <p className="text-gray-500 leading-relaxed text-sm italic">Cross-referenced with Google Places for real-world accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}