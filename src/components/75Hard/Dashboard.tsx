"use client";

import React from 'react';
import { CheckCircle2, Circle, Trophy, XCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Challenge, DailyProgress } from '@/types/challenge';
import { cn } from '@/lib/utils';
import { showSuccess, showError } from '@/utils/toast';

interface DashboardProps {
  day: number;
  challenges: Challenge[];
  progress: DailyProgress;
  onToggle: (id: string) => void;
  onFail: () => void;
  onCompleteDay: () => void;
}

const Dashboard = ({ day, challenges, progress, onToggle, onFail, onCompleteDay }: DashboardProps) => {
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalCount = challenges.length;
  const percentComplete = (day / 75) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-slate-400 font-bold tracking-widest text-xs uppercase">Current Progress</h2>
          <h1 className="text-5xl font-black text-white tracking-tighter">DAY {day}<span className="text-orange-500">/75</span></h1>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-orange-500">{Math.round(percentComplete)}%</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Journey</div>
        </div>
      </header>

      <Progress value={percentComplete} className="h-3 bg-slate-800" />

      <div className="grid gap-4">
        {challenges.map((challenge) => {
          const isDone = progress[challenge.id];
          return (
            <button
              key={challenge.id}
              onClick={() => onToggle(challenge.id)}
              className={cn(
                "flex items-center gap-4 p-5 rounded-[2rem] border-2 transition-all duration-300 text-left group",
                isDone 
                  ? "bg-orange-500/10 border-orange-500/50 text-white" 
                  : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700"
              )}
            >
              <div className={cn(
                "shrink-0 transition-transform duration-300 group-active:scale-90",
                isDone ? "text-orange-500" : "text-slate-700"
              )}>
                {isDone ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
              </div>
              <span className={cn(
                "text-lg font-bold leading-tight",
                isDone ? "text-white" : "text-slate-400"
              )}>
                {challenge.text}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-4 space-y-4">
        {completedCount === totalCount ? (
          <Button 
            onClick={onCompleteDay}
            className="w-full h-16 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xl shadow-xl shadow-emerald-900/20 animate-bounce"
          >
            COMPLETE DAY {day}
            <Trophy className="ml-3 w-6 h-6" />
          </Button>
        ) : (
          <div className="p-6 rounded-[2rem] bg-slate-900/50 border border-slate-800 text-center">
            <p className="text-slate-500 font-medium">
              Complete all {totalCount} tasks to finish the day.
            </p>
          </div>
        )}

        <Button 
          variant="ghost"
          onClick={onFail}
          className="w-full h-14 rounded-[2rem] text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/10 font-bold"
        >
          <XCircle className="mr-2 w-5 h-5" />
          I FAILED TODAY (RESTART)
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;