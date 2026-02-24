"use client";

import React from 'react';
import { CheckCircle2, Circle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressCalendarProps {
  currentDay: number;
  history: Record<number, any>;
}

const ProgressCalendar = ({ currentDay, history }: ProgressCalendarProps) => {
  const days = Array.from({ length: 75 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-5 gap-3 p-1">
      {days.map((day) => {
        const isCompleted = history[day] !== undefined;
        const isCurrent = day === currentDay;
        const isFuture = day > currentDay;

        return (
          <div
            key={day}
            className={cn(
              "aspect-square rounded-xl flex flex-col items-center justify-center border-2 transition-all",
              isCompleted 
                ? "bg-white border-white text-black" 
                : isCurrent 
                  ? "border-white bg-zinc-900 text-white" 
                  : "border-zinc-800 bg-zinc-950 text-zinc-600"
            )}
          >
            <span className="text-[10px] font-black mb-0.5">{day}</span>
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : isFuture ? (
              <Circle className="w-4 h-4 opacity-20" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressCalendar;