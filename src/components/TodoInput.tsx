"use client";

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showSuccess } from '@/utils/toast';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput = ({ onAdd }: TodoInputProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      showSuccess('Task added successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <Input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 rounded-xl border-2 border-indigo-100 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-12 text-lg px-4"
      />
      <Button 
        type="submit" 
        className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 shadow-lg shadow-indigo-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add
      </Button>
    </form>
  );
};

export default TodoInput;