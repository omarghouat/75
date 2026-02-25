"use client";

import React from 'react';
import { X, Download, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuccessScreenProps {
  day: number;
  history: Record<number, any>;
  onClose: () => void;
}

const SuccessScreen = ({ day, history, onClose }: SuccessScreenProps) => {
  const days = Array.from({ length: 75 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-500">
      <header className="flex justify-between items-center p-6">
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X className="w-8 h-8" />
        </button>
        <button className="text-white/60 hover:text-white">
          <Download className="w-8 h-8" />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
        <div className="relative">
          <div className="flex flex-col items-center mb-2">
            <img src="/logo-75.png" alt="75 Hard Logo" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-8xl font-impact text-white">DAY {day}</h1>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 rotate-[-12deg] border-4 border-rose-600 px-6 py-2 rounded-lg bg-black/50 backdrop-blur-sm">
            <span className="text-rose-600 font-black text-3xl tracking-tighter uppercase">COMPLETED</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-x-4 gap-y-2 w-full max-w-xs">
          {days.map((d) => (
            <span 
              key={d} 
              className={cn(
                "text-center text-sm font-bold",
                d <= day ? "text-rose-600" : "text-zinc-800"
              )}
            >
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[10px] font-bold uppercase tracking-widest-custom text-zinc-400 w-full max-w-xs">
          <div className="flex items-center gap-2">Two 45 min workouts</div>
          <div className="flex items-center gap-2">One workout must be outdoors</div>
          <div className="flex items-center gap-2">Follow a diet</div>
          <div className="flex items-center gap-2">Take a progress pic</div>
          <div className="flex items-center gap-2">1 gallon of water</div>
          <div className="flex items-center gap-2">No alcohol or cheat meals</div>
          <div className="flex items-center gap-2">Read 10 pages</div>
        </div>

        <div className="text-zinc-600 font-black tracking-widest-custom text-sm">75HARD.COM</div>
      </div>

      <div className="p-8 bg-zinc-100">
        <Button className="w-full h-16 bg-black hover:bg-zinc-900 text-white rounded-none flex items-center justify-center gap-3 font-bold text-lg uppercase tracking-widest-custom">
          <Instagram className="w-6 h-6" />
          Create IG Story Post
        </Button>
      </div>
    </div>
  );
};

export default SuccessScreen;