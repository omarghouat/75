"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  onSave: (time: string) => void;
}

const ReminderModal = ({ isOpen, onClose, taskName, onSave }: ReminderModalProps) => {
  const [time, setTime] = useState("06:00");
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden max-w-sm rounded-t-3xl sm:rounded-3xl border-none">
        <DialogHeader className="p-6 border-b border-gray-100">
          <DialogTitle className="text-center text-lg font-bold">
            Reminder: {taskName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <span className="font-medium">Every Day</span>
            <Switch defaultChecked className="data-[state=checked]:bg-rose-500" />
          </div>

          <div className="flex justify-between gap-2">
            {days.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-md font-bold text-sm",
                  "bg-zinc-900 text-white"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Time</span>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-xl font-bold focus:outline-none"
            />
          </div>

          <Button 
            onClick={() => {
              onSave(time);
              onClose();
            }}
            className="w-full h-14 bg-black hover:bg-zinc-800 text-white font-bold text-lg rounded-xl"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderModal;