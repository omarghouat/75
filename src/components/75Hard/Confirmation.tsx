"use client";

import React, { useState } from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Challenge } from '@/types/challenge';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableChallenge from './SortableChallenge';

interface ConfirmationProps {
  challenges: Challenge[];
  onConfirm: (reorderedChallenges: Challenge[]) => void;
  onBack: () => void;
}

const Confirmation = ({ challenges: initialChallenges, onConfirm, onBack }: ConfirmationProps) => {
  const [step, setStep] = useState(1);
  const [challenges, setChallenges] = useState(initialChallenges);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setChallenges((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 mb-2">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-impact text-white">
          {step === 1 ? "ARE YOU SURE?" : "FINAL WARNING"}
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto font-medium">
          {step === 1 
            ? "Review your list carefully. Drag to reorder. Once you start, you cannot change these rules."
            : "If you fail even ONE task on ONE day, you must restart from Day 1. No excuses."}
        </p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 p-6 backdrop-blur-xl rounded-3xl">
        <div className="space-y-2 mb-8">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={challenges.map(c => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {challenges.map((c) => (
                <SortableChallenge key={c.id} challenge={c} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="ghost"
            onClick={onBack}
            className="h-14 rounded-2xl text-zinc-500 hover:text-white hover:bg-zinc-800"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            EDIT
          </Button>
          <Button 
            onClick={() => step === 1 ? setStep(2) : onConfirm(challenges)}
            className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-900/20"
          >
            {step === 1 ? "I'M READY" : "START DAY 1"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Confirmation;