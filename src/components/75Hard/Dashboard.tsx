"use client";

import React, { useRef, useState } from 'react';
import { CheckCircle2, Calendar, Clock, Camera, XCircle, Trophy, Bell } from 'lucide-react';
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
  onRestartWithChanges: () => void;
  onCompleteDay: () => void;
  onPhotoUpload: (day: number, base64: string) => void;
  onUpdateNotes: (notes: string) => void;
  onUpdateReminder: (id: string, time: string) => void;
  onUpdateProfile: (profile: Partial<ChallengeState['profile']>) => void;
}

const Dashboard = ({
  day, challenges, progress, history, photos, notes, profile,
  onToggle, onFail, onRestartWithChanges, onCompleteDay, onPhotoUpload, onUpdateNotes, onUpdateReminder, onUpdateProfile
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
    <div className="flex-1 min-h-0 flex flex-col w-full overflow-hidden bg-black text-white selection:bg-rose-500/30 animate-in fade-in duration-700">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Header - Fixed for mobile */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 pt-safe flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-75.png" alt="75 Hard Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-4xl font-impact text-rose-600">DAY {day}</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 active:scale-95 transition-transform touch-manipulation">
              <Calendar className="w-6 h-6 text-white" />
            </button>
          </DialogTrigger>
          <DialogContent className="bg-black border-zinc-800 text-white w-[92vw] max-w-md rounded-[2.5rem] p-6 overflow-y-auto max-h-[85vh] custom-scrollbar mobile-scroll">
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
      <main className="flex-1 min-h-0 w-full max-w-xl mx-auto px-6 pt-[100px] pb-[160px] space-y-1 overflow-y-auto custom-scrollbar mobile-scroll">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500">Daily Tasks</span>
          <span className="text-[10px] font-black uppercase tracking-widest-custom text-rose-500">{completedCount}/{totalCount} Done</span>
        </div>

        {challenges.map((challenge) => {
          const isDone = progress[challenge.id];
          const isPhotoTask = challenge.text.toLowerCase().includes('photo') || challenge.text.toLowerCase().includes('picture');
          const hasPhoto = photos[day] !== undefined;

          return (
            <div
              key={challenge.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] touch-manipulation",
                isDone ? "bg-zinc-900/30 border-zinc-900" : "bg-zinc-900/50 border-zinc-800"
              )}
              onClick={() => {
                if (isPhotoTask && !hasPhoto) fileInputRef.current?.click();
                else onToggle(challenge.id);
              }}
            >
              <div className="shrink-0">
                {isDone ? (
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-900/20">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                ) : isPhotoTask ? (
                  <div className="w-10 h-10 rounded-xl border-2 border-zinc-700 flex items-center justify-center text-zinc-500">
                    <Camera className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-zinc-700" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-base font-bold transition-all truncate",
                  isDone ? "text-zinc-600 line-through" : "text-zinc-100"
                )}>
                  {challenge.text}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setReminderTask({ id: challenge.id, name: challenge.text });
                  }}
                  className="flex items-center gap-1.5 text-zinc-500 text-[9px] font-black uppercase tracking-widest-custom mt-0.5"
                >
                  <Clock className="w-3 h-3" />
                  {challenge.reminderTime || "Set Reminder"}
                </button>
              </div>

              {isPhotoTask && hasPhoto && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 shadow-md">
                  <img src={photos[day]} alt="Progress" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          );
        })}

        {/* Notes Section */}
        <div className="mt-8 bg-white text-black rounded-[2rem] p-6 space-y-3 shadow-xl">
          <h2 className="text-xl font-impact tracking-tight">DAILY NOTES</h2>
          <textarea
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 p-0 text-sm font-medium leading-relaxed placeholder:text-zinc-400 resize-none"
          />
        </div>
      </main>

      {/* Footer Actions - Fixed at bottom for mobile */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 pb-safe space-y-3 bg-gradient-to-t from-black via-black to-transparent z-20 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center w-full max-w-xl mx-auto">
          {completedCount === totalCount && (
            <Button
              onClick={onCompleteDay}
              className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white font-black text-lg rounded-2xl transition-all active:scale-[0.97] uppercase tracking-widest-custom shadow-2xl shadow-rose-900/40"
            >
              COMPLETE DAY {day}
            </Button>
          )}

          <button
            onClick={() => setIsFailureModalOpen(true)}
            className="w-full py-3 text-zinc-600 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest-custom transition-colors"
          >
            I Failed Today (Restart)
          </button>
        </div>
      </footer>

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
        onRestartWithChanges={onRestartWithChanges}
      />
    </div>
  );
};

export default Dashboard;