"use client";

import React, { useState } from 'react';
import { Camera, ChevronLeft, Edit3, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProgressCalendarProps {
  currentDay: number;
  history: Record<number, any>;
  photos: Record<number, string>;
}

const ProgressCalendar = ({ currentDay, history, photos }: ProgressCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const days = Array.from({ length: 75 }, (_, i) => i + 1);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border-2 border-zinc-700">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Andy" alt="Profile" />
          </div>
          <div>
            <h3 className="font-bold text-lg">User Progress</h3>
            <p className="text-zinc-500 text-xs font-bold uppercase">Day Ends: 1:00am</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="text-xs font-bold uppercase">Settings</span>
          <Edit3 className="w-4 h-4" />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {Object.entries(photos).map(([day, src]) => (
          <div key={day} className="shrink-0 w-40 aspect-[3/4] rounded-2xl overflow-hidden relative snap-center border border-zinc-800">
            <img src={src} className="w-full h-full object-cover" alt={`Day ${day}`} />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-[10px] font-black uppercase">75 HARD</p>
              <p className="text-xs font-bold">DAY {day}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2 px-2">
        {days.map((day) => {
          const isCompleted = history[day] !== undefined || day < currentDay;
          return (
            <button
              key={day}
              onClick={() => photos[day] && setSelectedDay(day)}
              className={cn(
                "text-center text-lg font-black transition-colors",
                isCompleted ? "text-rose-600" : "text-zinc-800",
                photos[day] && "underline decoration-rose-600/50 underline-offset-4"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
        Tap any completed day to view details
      </div>

      <button className="w-full py-4 bg-zinc-900/50 rounded-xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest border border-zinc-800">
        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">i</div>
        75 Hard Program FAQ
      </button>

      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="bg-black border-zinc-800 text-white p-0 overflow-hidden max-w-sm rounded-3xl">
          <div className="relative aspect-[3/4]">
            <img src={photos[selectedDay || 0]} className="w-full h-full object-cover" alt="Progress" />
            <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-b from-black/40 via-transparent to-black/80">
              <div className="flex justify-between items-start">
                <button onClick={() => setSelectedDay(null)}><X className="w-8 h-8" /></button>
                <button className="text-sm font-bold uppercase">Share or Edit ></button>
              </div>
              <div>
                <h2 className="text-5xl font-impact mb-4">DAY {selectedDay}</h2>
                <p className="text-sm font-medium leading-relaxed text-zinc-200">
                  Learn how to deal with discomfort and it opens the door to everything. What can stop you if you willingly seek out all the things nobody else is willing to do?
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressCalendar;