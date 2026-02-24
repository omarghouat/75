"use client";

import React, { useRef, useState } from 'react';
import { CheckCircle2, Calendar, Clock, Camera, Spade, XCircle, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Challenge, DailyProgress } from '@/types/challenge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProgressCalendar from './ProgressCalendar';
import FailureDialog from './FailureDialog';

interface DashboardProps {
  day: number;
  challenges: Challenge[];
  progress: DailyProgress;
  history: Record<number, DailyProgress>;
  photos: Record<number, string>;
  onToggle: (id: string) => void;
  onFail: () => void;
  onCompleteDay: () => void;
  onPhotoUpload: (day: number, base64: string) => void;
}

const Dashboard = ({ day, challenges, progress, history, photos, onToggle, onFail, onCompleteDay, onPhotoUpload }: DashboardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = challenges.length;
  const today = new Date();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoUpload(day, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-md mx-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      {/* Header Section */}
      <header className="flex items-start justify-between pt-4">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <Spade className="w-14 h-14 fill-white text-white" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-black text-sm mt-[-2px]">75</span>
          </div>
          <span className="text-[10px] font-black tracking-[0.2em] mt-1">HARD</span>
        </div>

        <div className="text-center flex-1">
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-2">DAY {day}</h1>
          <p className="text-zinc-500 text-sm font-medium">{format(today, 'MMM d, yyyy')}</p>
        </div>

        <div className="pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <button className="hover:opacity-70 transition-opacity">
                <Calendar className="w-8 h-8 text-white opacity-80" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-black border-zinc-800 text-white max-w-[90vw] sm:max-w-md rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tighter uppercase text-center mb-4">
                  Progress Calendar
                </DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <ProgressCalendar currentDay={day} history={history} photos={photos} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Challenge List */}
      <div className="divide-y divide-zinc-800/50">
        {challenges.map((challenge) => {
          const isDone = progress[challenge.id];
          const isPhotoTask = challenge.text.toLowerCase().includes('photo') || challenge.text.toLowerCase().includes('picture');
          const hasPhoto = photos[day] !== undefined;
          
          return (
            <div
              key={challenge.id}
              className="flex items-center gap-5 py-6 group cursor-pointer"
              onClick={() => {
                if (isPhotoTask && !hasPhoto) {
                  fileInputRef.current?.click();
                } else {
                  onToggle(challenge.id);
                }
              }}
            >
              <div className="shrink-0">
                {isDone ? (
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-white">
                    <CheckCircle2 className="w-6 h-6 text-black" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-700 group-hover:border-zinc-500 transition-colors" />
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <h3 className={cn(
                  "text-xl font-medium transition-all",
                  isDone ? "text-zinc-500 line-through" : "text-white"
                )}>
                  {challenge.text}
                </h3>
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  {isPhotoTask && hasPhoto ? "Photo Captured" : "Add Reminder"}
                </div>
              </div>

              {isPhotoTask && (
                <div className={cn(
                  "shrink-0 transition-all",
                  hasPhoto ? "text-orange-500" : "opacity-80"
                )}>
                  {hasPhoto ? (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-700">
                      <img src={photos[day]} alt="Today's progress" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Camera className="w-7 h-7" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Section */}
      <div className="pt-8 space-y-6">
        {completedCount === totalCount ? (
          <Button 
            onClick={onCompleteDay}
            className="w-full h-16 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xl transition-all active:scale-[0.98]"
          >
            COMPLETE DAY {day}
            <Trophy className="ml-3 w-6 h-6" />
          </Button>
        ) : (
          <div className="text-center py-4">
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
              {totalCount - completedCount} TASKS REMAINING
            </p>
          </div>
        )}

        <button 
          onClick={() => setIsFailureModalOpen(true)}
          className="w-full py-4 text-zinc-600 hover:text-rose-500 text-xs font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          I Failed Today (Restart)
        </button>
      </div>

      <FailureDialog 
        isOpen={isFailureModalOpen} 
        onClose={() => setIsFailureModalOpen(false)} 
        onConfirmReset={onFail} 
      />
    </div>
  );
};

export default Dashboard;