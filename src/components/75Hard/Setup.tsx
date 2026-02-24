"use client";

import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Challenge } from '@/types/challenge';

interface SetupProps {
  onComplete: (challenges: Challenge[]) => void;
}

const DEFAULT_CHALLENGES = [
  "Follow a diet",
  "Two 45-minute workouts (one outdoors)",
  "No alcohol or cheat meals",
  "Drink 1 gallon of water",
  "Read 10 pages of non-fiction",
  "Take a progress photo"
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 mb-2">
          <Flame className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-white">DEFINE YOUR RULES</h1>
        <p className="text-slate-400 max-w-md mx-auto">
          75 days. Zero compromises. List the daily tasks you will commit to.
        </p>
      </div>

      <Card className="bg-slate-900/50 border-slate-800 p-6 backdrop-blur-xl">
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center gap-3 group">
              <div className="flex-1 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200">
                {challenge.text}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeChallenge(challenge.id)}
                className="text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <Input
              value={newChallenge}
              onChange={(e) => setNewChallenge(e.target.value)}
              placeholder="Add custom challenge..."
              className="bg-slate-950 border-slate-800 text-white h-12 rounded-xl focus-visible:ring-orange-500"
              onKeyDown={(e) => e.key === 'Enter' && addChallenge()}
            />
            <Button 
              onClick={addChallenge}
              className="h-12 w-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Button 
          onClick={() => onComplete(challenges)}
          disabled={challenges.length === 0}
          className="w-full mt-8 h-14 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98]"
        >
          CONTINUE
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </Card>
    </div>
  );
};

export default Setup;