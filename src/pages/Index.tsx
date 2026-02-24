"use client";

import React, { useState, useEffect } from 'react';
import Setup from '@/components/75Hard/Setup';
import Confirmation from '@/components/75Hard/Confirmation';
import Dashboard from '@/components/75Hard/Dashboard';
import { Challenge, ChallengeState, DailyProgress } from '@/types/challenge';
import { showSuccess, showError } from '@/utils/toast';
import { MadeWithDyad } from "@/components/made-with-dyad";

const STORAGE_KEY = '75hard_state_v2';

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
      photos: {}
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleSetupComplete = (challenges: Challenge[]) => {
    setState(prev => ({ ...prev, challenges, status: 'confirming' }));
  };

  const handleConfirm = () => {
    setState(prev => ({ 
      ...prev, 
      status: 'active', 
      startDate: new Date().toISOString(),
      dailyProgress: prev.challenges.reduce((acc, c) => ({ ...acc, [c.id]: false }), {})
    }));
    showSuccess("Challenge Started! Day 1 begins now.");
  };

  const handleToggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      dailyProgress: {
        ...prev.dailyProgress,
        [id]: !prev.dailyProgress[id]
      }
    }));
  };

  const handlePhotoUpload = (day: number, base64: string) => {
    setState(prev => {
      const photoTask = prev.challenges.find(c => 
        c.text.toLowerCase().includes('photo') || c.text.toLowerCase().includes('picture')
      );
      
      const newProgress = { ...prev.dailyProgress };
      if (photoTask) {
        newProgress[photoTask.id] = true;
      }

      return {
        ...prev,
        photos: { ...prev.photos, [day]: base64 },
        dailyProgress: newProgress
      };
    });
    showSuccess("Photo captured!");
  };

  const handleCompleteDay = () => {
    if (state.currentDay >= 75) {
      showSuccess("CONGRATULATIONS! YOU FINISHED 75 HARD!");
      return;
    }

    setState(prev => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      history: { ...prev.history, [prev.currentDay]: prev.dailyProgress },
      dailyProgress: prev.challenges.reduce((acc, c) => ({ ...acc, [c.id]: false }), {})
    }));
    showSuccess(`Day ${state.currentDay} complete! Keep going.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFail = () => {
    setState(prev => ({
      ...prev,
      currentDay: 1,
      dailyProgress: prev.challenges.reduce((acc, c) => ({ ...acc, [c.id]: false }), {}),
      history: {},
      photos: {}
    }));
    showError("Challenge restarted. Day 1 starts again.");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-orange-500/30">
      <div className="max-w-xl mx-auto px-6 py-12 sm:py-20">
        {state.status === 'setup' && (
          <Setup onComplete={handleSetupComplete} />
        )}

        {state.status === 'confirming' && (
          <Confirmation 
            challenges={state.challenges} 
            onBack={() => setState(prev => ({ ...prev, status: 'setup' }))}
            onConfirm={handleConfirm}
          />
        )}

        {state.status === 'active' && (
          <Dashboard 
            day={state.currentDay}
            challenges={state.challenges}
            progress={state.dailyProgress}
            history={state.history}
            photos={state.photos}
            onToggle={handleToggleTask}
            onFail={handleFail}
            onCompleteDay={handleCompleteDay}
            onPhotoUpload={handlePhotoUpload}
          />
        )}

        <footer className="mt-20 opacity-50">
          <MadeWithDyad />
        </footer>
      </div>
    </div>
  );
};

export default Index;