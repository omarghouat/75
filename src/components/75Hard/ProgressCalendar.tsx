"use client";

import React, { useState } from 'react';
import { Camera, ChevronLeft, Edit3, X, Check, User, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess } from '@/utils/toast';

interface ProgressCalendarProps {
  currentDay: number;
  history: Record<number, any>;
  photos: Record<number, string>;
}

const ProgressCalendar = ({ currentDay, history, photos }: ProgressCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userName, setUserName] = useState("User Progress");
  const [dayEndTime, setDayEndTime] = useState("1:00 AM");
  
  const days = Array.from({ length: 75 }, (_, i) => i + 1);

  const handleSaveSettings = () => {
    setIsSettingsOpen(false);
    showSuccess("Settings updated successfully");
  };

  if (isSettingsOpen) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Back</span>
          </button>
          <h3 className="font-impact text-xl tracking-tight">SETTINGS</h3>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="space-y-6 px-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500">Profile Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 pl-12 h-14 rounded-xl focus-visible:ring-rose-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500">Day Ends At</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                value={dayEndTime}
                onChange={(e) => setDayEndTime(e.target.value)}
                className="bg-zinc-900 border-zinc-800 pl-12 h-14 rounded-xl focus-visible:ring-rose-600"
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">Most people set this to 1:00 AM or 2:00 AM to account for late workouts.</p>
          </div>

          <Button 
            onClick={handleSaveSettings}
            className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl uppercase tracking-widest-custom mt-4"
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border-2 border-zinc-700">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Profile" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{userName}</h3>
            <p className="text-zinc-500 text-xs font-bold uppercase">Day Ends: {dayEndTime}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <span className="text-xs font-bold uppercase">Settings</span>
          <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {Object.entries(photos).length > 0 ? (
          Object.entries(photos).map(([day, src]) => (
            <div key={day} className="shrink-0 w-40 aspect-[3/4] rounded-2xl overflow-hidden relative snap-center border border-zinc-800">
              <img src={src} className="w-full h-full object-cover" alt={`Day ${day}`} />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-[10px] font-black uppercase">75 HARD</p>
                <p className="text-xs font-bold">DAY {day}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-10 text-center border-2 border-dashed border-zinc-900 rounded-3xl text-zinc-700 font-bold uppercase text-xs tracking-widest">
            No progress photos yet
          </div>
        )}
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

      <button className="w-full py-4 bg-zinc-900/50 rounded-xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest border border-zinc-800 hover:bg-zinc-900 transition-colors">
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