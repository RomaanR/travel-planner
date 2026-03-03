"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Compass, MapPin, Utensils, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="paper-texture min-h-screen text-[#1A1A1A]">
      {/* Editorial Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-black/5 relative z-10">
        <span className="font-serif text-2xl font-bold italic tracking-tighter">TripCraft.</span>
        <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
          <a href="#" className="hover:text-orange-700 transition-colors">The Process</a>
          <a href="#" className="hover:text-orange-700 transition-colors">Journal</a>
          <a href="#" className="hover:text-orange-700 transition-colors">Destinations</a>
        </div>
        <Button variant="outline" className="rounded-none border-black uppercase text-[10px] tracking-widest font-bold h-9">
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end gap-12 mb-20">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-serif text-7xl md:text-[10rem] leading-[0.8] tracking-tighter flex-1"
          >
            Seek <br /> 
            <span className="italic text-orange-700">Wander.</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-xs pb-6 border-l pl-8 border-orange-200"
          >
             <p className="text-sm leading-relaxed text-gray-500 uppercase tracking-wide mb-6">
              01 — The New Way to Travel
            </p>
            <p className="text-lg leading-relaxed italic font-serif">
              "We don't build itineraries. We curate experiences that feel like a well-worn passport."
            </p>
            <Button className="mt-8 rounded-none bg-black text-white hover:bg-orange-800 transition-all w-full md:w-auto">
              Start Your Story <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* The "Soul" Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
          
          {/* Main Large Visual */}
          <motion.div 
            whileHover={{ scale: 0.995 }}
            className="md:col-span-8 md:row-span-2 bg-emerald-950 relative overflow-hidden group border border-black/5"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
            <div className="relative h-full p-12 flex flex-col justify-between text-white">
              <span className="font-serif italic text-2xl tracking-widest uppercase">01. Hidden Gems</span>
              <div className="max-w-sm">
                <h2 className="font-serif text-5xl mb-4 italic">The Path Less Trodden</h2>
                <p className="text-emerald-100/70 text-sm">Our AI scans local travelogues and obscure logs to find spots that haven't been 'grammed to death.</p>
              </div>
            </div>
          </motion.div>

          {/* Icon Feature 1 */}
          <div className="md:col-span-4 bg-white p-10 flex flex-col justify-between border border-gray-100 shadow-sm relative overflow-hidden">
            <Compass className="w-12 h-12 stroke-[1px] text-orange-700" />
            <div className="relative z-10">
              <h3 className="font-serif text-3xl italic">Pace Control</h3>
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Slow Mornings vs. High Octane</p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-gray-50 font-serif text-9xl italic font-bold">02</div>
          </div>

          {/* Icon Feature 2 */}
          <div className="md:col-span-4 bg-[#F2EDE4] p-10 flex flex-col justify-between border border-black/5 relative overflow-hidden">
            <Utensils className="w-12 h-12 stroke-[1px] text-emerald-900" />
            <div>
              <h3 className="font-serif text-3xl italic">Palate First</h3>
              <p className="text-xs text-emerald-900/60 mt-2 uppercase tracking-widest">Reservations Hand-Picked by AI</p>
            </div>
          </div>

        </div>
      </section>

      {/* Editorial Quote Footer */}
      <footer className="py-24 border-t border-black/5 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="mb-8 flex justify-center space-x-2">
            {[1, 2, 3].map((i) => <div key={i} className="w-1 h-1 bg-black rounded-full" />)}
          </div>
          <p className="font-serif italic text-3xl">
            "To travel is to live twice."
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
            TripCraft — Est. 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
