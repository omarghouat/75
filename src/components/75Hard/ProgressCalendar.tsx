"use client";

import React, { useState, useRef } from 'react';
import { Camera, ChevronLeft, Edit3, X, User, Clock, Upload, Share2, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess, showError } from '@/utils/toast';
import { ChallengeState } from '@/types/challenge';

interface ProgressCalendarProps {
  currentDay: number;
  history: Record<number, any>;
  photos: Record<number, string>;
  profile: ChallengeState['profile'];
  onUpdateProfile: (profile: Partial<ChallengeState['profile']>) => void;
  onUpdatePhoto: (day: number, base64: string) => void;
}

const ProgressCalendar = ({ currentDay, history, photos, profile, onUpdateProfile, onUpdatePhoto }: ProgressCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempEndTime, setTempEndTime] = useState(profile.dayEndTime);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const replacePhotoInputRef = useRef<HTMLInputElement>(null);
  
  const days = Array.from({ length: 75 }, (_, i) => i + 1);

  const handleSaveSettings = () => {
    onUpdateProfile({
      name: tempName,
      dayEndTime: tempEndTime
    });
    setIsSettingsOpen(false);
    showSuccess("Settings updated");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ avatar: reader.result as string });
        showSuccess("Profile picture updated");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplacePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedDay) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePhoto(selectedDay, reader.result as string);
        showSuccess(`Photo for Day ${selectedDay} updated`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    if (!selectedDay || !photos[selectedDay]) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `75 HARD - Day ${selectedDay}`,
          text: `Check out my progress on Day ${selectedDay} of the 75 Hard challenge!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess("Link copied to clipboard!");
      }
    } catch (err) {
      // Ignore share cancellation
    }
  };

  if (isSettingsOpen) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 -ml-2 text-zinc-400 hover:text-white active:scale-90 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="font-impact text-2xl tracking-tight">SETTINGS</h3>
          <div className="w-10" />
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-zinc-900 overflow-hidden border-4 border-zinc-800 shadow-2xl">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="Profile" />
                )}
              </div>
              <button 
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-rose-600 rounded-full border-4 border-black shadow-lg active:scale-90 transition-transform"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500 ml-1">Profile Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 pl-12 h-14 rounded-2xl focus-visible:ring-rose-600 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500 ml-1">Day Ends At</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input 
                  value={tempEndTime}
                  onChange={(e) => setTempEndTime(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 pl-12 h-14 rounded-2xl focus-visible:ring-rose-600 text-base"
                />
              </div>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight px-1">Recommended: 2:00 AM</p>
            </div>
          </div>

          <Button 
            onClick={handleSaveSettings}
            className="w-full h-16 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl uppercase tracking-widest-custom mt-4 shadow-xl shadow-rose-900/20"
          >
            Save Changes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-900 overflow-hidden border-2 border-zinc-800 shadow-lg">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} alt="Profile" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl leading-tight">{profile.name}</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest-custom">Day Ends: {profile.dayEndTime}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 active:scale-90 transition-all"
        >
          <Settings2 className="w-6 h-6 text-zinc-400" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500">Progress Photos</span>
          <span className="text-[10px] font-black uppercase tracking-widest-custom text-rose-500">{Object.keys(photos).length} Captured</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x -mx-2 px-2">
          {Object.entries(photos).length > 0 ? (
            Object.entries(photos).map(([day, src]) => (
              <div 
                key={day} 
                onClick={() => setSelectedDay(Number(day))}
                className="shrink-0 w-36 aspect-[3/4] rounded-2xl overflow-hidden relative snap-center border border-zinc-800 shadow-xl active:scale-95 transition-transform"
              >
                <img src={src} className="w-full h-full object-cover" alt={`Day ${day}`} />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-[8px] font-black uppercase tracking-widest-custom text-zinc-400">75 HARD</p>
                  <p className="text-xs font-black">DAY {day}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-12 text-center border-2 border-dashed border-zinc-900 rounded-[2rem] text-zinc-700 font-black uppercase text-[10px] tracking-widest-custom">
              No progress photos yet
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500">Challenge Grid</span>
          <span className="text-[10px] font-black uppercase tracking-widest-custom text-zinc-500">{Math.round((currentDay/75)*100)}% Complete</span>
        </div>
        <div className="grid grid-cols-7 gap-y-5 gap-x-2">
          {days.map((day) => {
            const isCompleted = history[day] !== undefined || day < currentDay;
            const isCurrent = day === currentDay;
            return (
              <button
                key={day}
                onClick={() => photos[day] && setSelectedDay(day)}
                className={cn(
                  "text-center text-base font-black transition-all active:scale-90",
                  isCompleted ? "text-rose-600" : "text-zinc-800",
                  isCurrent && "text-white scale-125",
                  photos[day] && "underline decoration-rose-600 decoration-2 underline-offset-4"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-center text-zinc-600 text-[9px] font-black uppercase tracking-widest-custom pt-4">
        Tap any underlined day to view photo
      </div>

      <Dialog open={selectedDay !== null} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="bg-black border-zinc-800 text-white p-0 overflow-hidden w-[92vw] max-w-sm rounded-[2.5rem]">
          <div className="relative aspect-[3/4]">
            <img src={photos[selectedDay || 0]} className="w-full h-full object-cover" alt="Progress" />
            <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-b from-black/60 via-transparent to-black/90">
              <div className="flex justify-between items-start">
                <button 
                  onClick={() => setSelectedDay(null)} 
                  className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 active:scale-90 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={handleShare}
                    className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 active:scale-90 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => replacePhotoInputRef.current?.click()}
                    className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 active:scale-90 transition-all"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-6xl font-impact">DAY {selectedDay}</h2>
                <p className="text-xs font-bold leading-relaxed text-zinc-300 uppercase tracking-tight">
                  "Discipline is doing what needs to be done, even if you don't want to do it."
                </p>
              </div>
            </div>
          </div>
          <input 
            type="file" 
            ref={replacePhotoInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleReplacePhoto} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressCalendar;