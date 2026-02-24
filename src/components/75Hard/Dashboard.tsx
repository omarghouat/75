"use client";

import React, { useRef, useState } from 'react';
import { CheckCircle2, Calendar, Clock, Camera, Spade, XCircle, Trophy, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Challenge, DailyProgress, ChallengeState } from '@/types/challenge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProgressCalendar from './ProgressCalendar';
import FailureDialog from './FailureDialog';
import ReminderModal from './ReminderModal';

interface DashboardProps {
  day: number;
  challenges: Challenge[];
  progress: DailyProgress;
  history: Record<number, any>;
  photos: Record<number, string>;
  notes: string;
  profile: ChallengeState['profile'];
  onToggle: (id: string) => void;
  onFail: () => void;
  onCompleteDay: () => void;
  onPhotoUpload: (day: number, base64: string) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateReminder: (id: string, time: string) => void;
  onUpdateProfile: (profile: Partial<ChallengeState['profile']>) => void;
}

const Dashboard = ({ 
  day, challenges, progress, history, photos, notes, profile,
  onToggle, onFail, onCompleteDay, onPhotoUpload, onUpdateNotes, onUpdateReminder, onUpdateProfile
}: DashboardProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false);
  const [reminderTask, setReminderTask] = useState<{ id: string, name: string } | null>(null);
  
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = challenges.length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onPhotoUpload(day, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-0 animate-in fade-in duration-700 max-w-md mx-auto bg-black min-h-screen pb-20">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Header */}
      <header className="flex items-center justify-between p-6 pt-12">
        <div className="flex flex-col items-center">
          <Spade className="w-12 h-12 fill-white text-white" />
          <span className="text-[8px] font-black tracking-widest-custom mt-1">HARD</span>
        </div>

        <h1 className="text-7xl font-impact text-rose-600">DAY {day}</h1>

        <Dialog>
          <DialogTrigger asChild>
            <button className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
              <Calendar className="w-6 h-6 text-white/80" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-black border-zinc-800 text-white max-w-[95vw] sm:max-w-md rounded-3xl p-6 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <ProgressCalendar 
              currentDay={day} 
              history={history} 
              photos={photos} 
              profile={profile}
              onUpdateProfile={onUpdateProfile}
              onUpdatePhoto={onPhotoUpload}
            />
          </DialogContent>
        </Dialog>
      </header>

      {/* Task List */}
      <div className="px-6 space-y-0 border-t border-zinc-900">
        {challenges.map((challenge) => {
          const isDone = progress[challenge.id];
          const isPhotoTask = challenge.text.toLowerCase().includes('photo') || challenge.text.toLowerCase().includes('picture');
          const hasPhoto = photos[day] !== undefined;
          
          return (
            <div
              key={challenge.id}
              className="flex items-center gap-4 py-5 border-b border-zinc-900 group"
            >
              <button 
                onClick={() => {
                  if (isPhotoTask && !hasPhoto) fileInputRef.current?.click();
                  else onToggle(challenge.id);
                }}
                className="shrink-0"
              >
                {isDone ? (
                  <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                ) : isPhotoTask ? (
                  <div className="w-8 h-8 rounded-lg border-2 border-zinc-800 flex items-center justify-center text-zinc-600">
                    <Camera className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-zinc-800 group-hover:border-zinc-600 transition-colors" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-lg font-bold transition-all truncate",
                  isDone ? "text-zinc-600 line-through" : "text-zinc-200"
                )}>
                  {challenge.text}
                </h3>
                <button 
                  onClick={() => setReminderTask({ id: challenge.id, name: challenge.text })}
                  className="flex items-center gap-1.5 text-zinc-600 text-[10px] font-black uppercase tracking-widest-custom hover:text-zinc-400"
                >
                  <Clock className="w-3 h-3" />
                  {challenge.reminderTime || "Add reminder"}
                </button>
              </div>

              {isPhotoTask && hasPhoto && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-800">
                  <img src={photos[day]} alt="Progress" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notes Section */}
      <div className="mt-8 bg-white text-black p-6 space-y-4">
        <h2 className="text-2xl font-impact tracking-tight">NOTES:</h2>
        <textarea
          value={notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
          placeholder="Make notes of any challenges, insights, or breakthroughs you achieve."
          className="w-full min-h-[120px] bg-transparent border-none focus:ring-0 p-0 text-base font-medium leading-relaxed placeholder:text-zinc-400 resize-none"
        />
      </div>

      {/* Footer Actions */}
      <div className="p-6 space-y-4">
        {completedCount === totalCount && (
          <Button 
            onClick={onCompleteDay}
            className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white font-black text-xl rounded-xl transition-all active:scale-[0.98] uppercase tracking-widest-custom"
          >
            COMPLETE DAY {day}
          </Button>
        )}

        <button 
          onClick={() => setIsFailureModalOpen(true)}
          className="w-full py-4 text-zinc-700 hover:text-rose-900 text-[10px] font-black uppercase tracking-widest-custom transition-colors"
        >
          I Failed Today (Restart)
        </button>
      </div>

      <ReminderModal 
        isOpen={reminderTask !== null}
        onClose={() => setReminderTask(null)}
        taskName={reminderTask?.name || ""}
        onSave={(time) => reminderTask && onUpdateReminder(reminderTask.id, time)}
      />

      <FailureDialog 
        isOpen={isFailureModalOpen} 
        onClose={() => setIsFailureModalOpen(false)} 
        onConfirmReset={onFail} 
      />
    </div>
  );
};

export default Dashboard;