"use client";

import React, { useState, useEffect } from 'react';
import Setup from '@/components/75Hard/Setup';
import Confirmation from '@/components/75Hard/Confirmation';
import Dashboard from '@/components/75Hard/Dashboard';
import SuccessScreen from '@/components/75Hard/SuccessScreen';
import { Challenge, ChallengeState } from '@/types/challenge';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { cn } from "@/lib/utils";

const STORAGE_KEY = '75hard_state_v4';

const Index = () => {
  const [state, setState] = useState<ChallengeState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      status: 'setup',
      challenges: [],
      currentDay: 1,
      startDate: null,
      dailyProgress: {},
      history: {},
      photos: {},
      notes: '',
      profile: {
        name: 'User Progress',
        avatar: null,
        dayEndTime: '1:00 AM'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleSetupComplete = (challenges: Challenge[]) => {
    setState(prev => ({ ...prev, challenges, status: 'confirming' }));
  };

  const handleConfirm = (reorderedChallenges: Challenge[]) => {
    setState(prev => ({
      ...prev,
      challenges: reorderedChallenges,
      status: 'active',
      startDate: new Date().toISOString(),
      dailyProgress: reorderedChallenges.reduce((acc, c) => ({ ...acc, [c.id]: false }), {})
    }));
    showSuccess("Challenge Started! Day 1 begins now.");
  };

  const handleToggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      dailyProgress: { ...prev.dailyProgress, [id]: !prev.dailyProgress[id] }
    }));
  };

  const handlePhotoUpload = (day: number, base64: string) => {
    setState(prev => {
      const photoTask = prev.challenges.find(c =>
        c.text.toLowerCase().includes('photo') || c.text.toLowerCase().includes('picture')
      );
      const newProgress = { ...prev.dailyProgress };
      if (photoTask) newProgress[photoTask.id] = true;
      return {
        ...prev,
        photos: { ...prev.photos, [day]: base64 },
        dailyProgress: newProgress
      };
    });
  };

  const handleUpdateReminder = (id: string, time: string) => {
    setState(prev => ({
      ...prev,
      challenges: prev.challenges.map(c => c.id === id ? { ...c, reminderTime: time } : c)
    }));
  };

  const handleUpdateProfile = (profile: Partial<ChallengeState['profile']>) => {
    setState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));
  };

  const handleCompleteDay = () => {
    setState(prev => ({ ...prev, status: 'success' }));
  };

  const handleNextDay = () => {
    setState(prev => ({
      ...prev,
      status: 'active',
      currentDay: prev.currentDay + 1,
      history: { ...prev.history, [prev.currentDay]: { progress: prev.dailyProgress, notes: prev.notes } },
      dailyProgress: prev.challenges.reduce((acc, c) => ({ ...acc, [c.id]: false }), {}),
      notes: ''
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFail = () => {
    setState(prev => ({
      ...prev,
      currentDay: 1,
      dailyProgress: prev.challenges.reduce((acc, c) => ({ ...acc, [c.id]: false }), {}),
      history: {},
      photos: {},
      notes: ''
    }));
    showError("Challenge restarted. Day 1 starts again.");
  };

  return (
    <div className={cn(
      "bg-black text-white selection:bg-rose-500/30",
      state.status === 'active' || state.status === 'success' ? "h-[100dvh] overflow-hidden" : "min-h-[100dvh] mobile-scroll pb-10 flex flex-col"
    )}>
      {state.status === 'setup' && (
        <div className="flex-1 max-w-xl mx-auto px-6 py-20 w-full">
          <Setup onComplete={handleSetupComplete} />
        </div>
      )}

      {state.status === 'confirming' && (
        <div className="flex-1 max-w-xl mx-auto px-6 py-20 w-full">
          <Confirmation
            challenges={state.challenges}
            onBack={() => setState(prev => ({ ...prev, status: 'setup' }))}
            onConfirm={handleConfirm}
          />
        </div>
      )}

      {state.status === 'active' && (
        <Dashboard
          day={state.currentDay}
          challenges={state.challenges}
          progress={state.dailyProgress}
          history={state.history}
          photos={state.photos}
          notes={state.notes}
          profile={state.profile}
          onToggle={handleToggleTask}
          onFail={handleFail}
          onCompleteDay={handleCompleteDay}
          onPhotoUpload={handlePhotoUpload}
          onUpdateNotes={(notes) => setState(prev => ({ ...prev, notes }))}
          onUpdateReminder={handleUpdateReminder}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {state.status === 'success' && (
        <SuccessScreen
          day={state.currentDay}
          history={state.history}
          onClose={handleNextDay}
        />
      )}

      {state.status !== 'success' && (
        <footer className="pb-10 opacity-30">
          <MadeWithDyad />
        </footer>
      )}
    </div>
  );
};

export default Index;