"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle2, GripVertical } from 'lucide-react';
import { Challenge } from '@/types/challenge';

interface SortableChallengeProps {
  challenge: Challenge;
}

const SortableChallenge = ({ challenge }: SortableChallengeProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: challenge.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center gap-3 text-zinc-300 py-3 px-2 border-b border-zinc-800/50 bg-zinc-900/20 rounded-xl transition-colors ${isDragging ? 'bg-zinc-800/50 border-rose-500/50' : ''}`}
    >
      <button 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:text-white transition-colors"
      >
        <GripVertical className="w-4 h-4 text-zinc-600" />
      </button>
      <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
      <span className="font-medium flex-1">{challenge.text}</span>
    </div>
  );
};

export default SortableChallenge;