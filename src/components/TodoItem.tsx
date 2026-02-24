"use client";

import React from 'react';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <div className={cn(
      "group flex items-center justify-between p-4 mb-3 rounded-2xl transition-all duration-300 border border-transparent",
      todo.completed ? "bg-gray-50/50" : "bg-white shadow-sm hover:shadow-md hover:border-indigo-100"
    )}>
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => onToggle(todo.id)}
          className="focus:outline-none transition-transform active:scale-90"
        >
          {todo.completed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 group-hover:text-indigo-400" />
          )}
        </button>
        <span className={cn(
          "text-lg transition-all duration-300",
          todo.completed ? "text-gray-400 line-through" : "text-gray-700"
        )}>
          {todo.text}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default TodoItem;