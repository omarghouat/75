"use client";

import React, { useState } from 'react';
import { CheckCircle2, Circle, Camera, X } from 'lucide-react';
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
    <>
      <div className="grid grid-cols-5 gap-3 p-1">
        {days.map((day) => {
          const isCompleted = history[day] !== undefined || (day === currentDay && Object.values(history[day] || {}).every(Boolean) && Object.values(history[day] || {}).length > 0);
          // Note: history[day] is only set after day completion in current logic, 
          // but we can check if it's the current day and has a photo
          const hasPhoto = photos[day] !== undefined;
          const isCurrent = day === currentDay;
          const isFuture = day > currentDay;

          return (
            <button
              key={day}
              onClick={() => hasPhoto && setSelectedDay(day)}
              disabled={!hasPhoto}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all relative group",
                isCompleted 
                  ? "bg-white border-white text-black" 
                  : isCurrent 
                    ? "border-white bg-zinc-900 text-white" 
                    : "border-zinc-800 bg-zinc-950 text-zinc-600",
                hasPhoto && "cursor-pointer hover:scale-105 active:scale-95"
              )}
            >
              <span className="text-[10px] font-black mb-0.5">{day}</span>
              {hasPhoto ? (
                <Camera className={cn("w-4 h-4", isCompleted ? "text-black" : "text-white")} />
              ) : isCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : isFuture ? (
                <Circle className="w-4 h-4 opacity-20" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              )}
              
              {hasPhoto && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="bg-black border-zinc-800 text-white p-0 overflow-hidden max-w-sm rounded-3xl">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">
              Day {selectedDay} Progress
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedDay && photos[selectedDay] ? (
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img 
                  src={photos[selectedDay]} 
                  alt={`Day ${selectedDay} progress`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[3/4] flex items-center justify-center text-zinc-500 italic">
                No photo for this day
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProgressCalendar;