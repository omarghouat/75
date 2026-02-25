"use client";

import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Challenge } from '@/types/challenge';

interface SetupProps {
  onComplete: (challenges: Challenge[]) => void;
}

const DEFAULT_CHALLENGES = [
  "45 Minute Workout",
  "45 Minute Outdoor Workout",
  "Take Progress Picture",
  "10 Pages of Reading",
  "Drink 1 Gallon of Water",
  "Follow a Diet",
  "No Cheat Meals or Alcohol"
];

const Setup = ({ onComplete }: SetupProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>(
    DEFAULT_CHALLENGES.map(text => ({ id: crypto.randomUUID(), text }))
  );
  const [newChallenge, setNewChallenge] = useState('');

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setChallenges([...challenges, { id: crypto.randomUUID(), text: newChallenge.trim() }]);
      setNewChallenge('');
    }
  };

  const removeChallenge = (id: string) => {
    setChallenges(challenges.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col min-h-[80vh] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <img src="/logo-75.png" alt="75 Hard Logo" className="w-32 h-32 object-contain" />
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] mt-2 text-zinc-500">HARD PROGRAM</span>
        </div>
        <h1 className="text-5xl font-impact text-white uppercase">YOUR RULES</h1>
        <p className="text-zinc-500 text-xs font-medium max-w-[280px] mx-auto">Customize your daily tasks. These will be your non-negotiables for the next 75 days.</p>
      </div>

      <div className="flex-1 space-y-2">
        <div className="bg-zinc-900/30 rounded-[2rem] border border-zinc-900 p-2">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center gap-4 p-4 border-b border-zinc-800/50 last:border-0 group">
              <div className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <div className="flex-1 text-base font-bold text-zinc-200">
                {challenge.text}
              </div>
              <button
                onClick={() => removeChallenge(challenge.id)}
                className="p-2 text-zinc-600 hover:text-rose-500 active:scale-90 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Input
            value={newChallenge}
            onChange={(e) => setNewChallenge(e.target.value)}
            placeholder="Add custom task..."
            className="bg-zinc-900 border-zinc-800 text-white h-14 rounded-2xl focus-visible:ring-rose-600 text-base"
            onKeyDown={(e) => e.key === 'Enter' && addChallenge()}
          />
          <Button 
            onClick={addChallenge}
            className="h-14 w-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white shrink-0 active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 justify-center text-zinc-600">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest-custom">7 tasks recommended</span>
        </div>
        <Button 
          onClick={() => onComplete(challenges)}
          disabled={challenges.length === 0}
          className="w-full h-16 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black text-xl transition-all active:scale-[0.97] shadow-xl shadow-white/5"
        >
          CONTINUE
          <ArrowRight className="ml-2 w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Setup;