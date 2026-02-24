"use client";

import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Spade } from 'lucide-react';
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <Spade className="w-16 h-16 fill-white text-white" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-black text-lg mt-[-2px]">75</span>
          </div>
          <span className="text-xs font-black tracking-[0.3em] mt-2">HARD</span>
        </div>
        <h1 className="text-4xl font-impact text-white uppercase">Define Your Rules</h1>
      </div>

      <div className="space-y-1">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="flex items-center gap-4 py-4 border-b border-zinc-800 group">
            <div className="flex-1 text-lg font-medium text-zinc-200">
              {challenge.text}
            </div>
            <button
              onClick={() => removeChallenge(challenge.id)}
              className="text-zinc-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        <div className="flex gap-3 pt-6">
          <Input
            value={newChallenge}
            onChange={(e) => setNewChallenge(e.target.value)}
            placeholder="Add custom task..."
            className="bg-zinc-900 border-zinc-800 text-white h-14 rounded-xl focus-visible:ring-white"
            onKeyDown={(e) => e.key === 'Enter' && addChallenge()}
          />
          <Button 
            onClick={addChallenge}
            className="h-14 w-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <Button 
        onClick={() => onComplete(challenges)}
        disabled={challenges.length === 0}
        className="w-full h-16 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-xl transition-all active:scale-[0.98]"
      >
        CONTINUE
        <ArrowRight className="ml-2 w-6 h-6" />
      </Button>
    </div>
  );
};

export default Setup;