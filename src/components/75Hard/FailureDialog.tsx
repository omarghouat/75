"use client";

import React, { useState } from 'react';
import { AlertOctagon, Skull } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface FailureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  onRestartWithChanges: () => void;
}

const FailureDialog = ({ isOpen, onClose, onConfirmReset, onRestartWithChanges }: FailureDialogProps) => {
  const [step, setStep] = useState(1);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleReset = () => {
    onConfirmReset();
    handleClose();
  };

  const handleRestartWithChanges = () => {
    onRestartWithChanges();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-black border-zinc-800 text-white max-w-sm rounded-3xl p-8">
        <DialogHeader className="items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-2">
            {step === 1 ? <Skull className="w-8 h-8" /> : <AlertOctagon className="w-8 h-8" />}
          </div>
          <DialogTitle className="text-3xl font-impact text-center leading-tight">
            {step === 1 ? "FAILURE DETECTED" : "ONE LAST CHANCE"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <p className="text-center text-zinc-400 font-medium text-lg leading-relaxed">
            {step === 1 
              ? "Only loosers who fail in challenges." 
              : "Will you be a looser if you retry?"}
          </p>

          <div className="flex flex-col gap-3 items-center justify-center">
            {step === 1 ? (
              <>
                <Button 
                  onClick={() => setStep(2)}
                  className="h-14 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg uppercase tracking-widest-custom"
                >
                  I AGREE
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleClose}
                  className="text-zinc-500 hover:text-white hover:bg-transparent font-bold uppercase tracking-widest-custom text-[10px]"
                >
                  Wait, I didn't fail
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleReset}
                  className="h-14 rounded-xl bg-white hover:bg-zinc-200 text-black font-black text-lg uppercase tracking-widest-custom"
                >
                  RESTART WITH SAME TASKS
                </Button>
                <Button 
                  onClick={handleRestartWithChanges}
                  className="h-14 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-black text-lg uppercase tracking-widest-custom"
                >
                  MAKE CHANGES FIRST
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleClose}
                  className="text-zinc-500 hover:text-white hover:bg-transparent font-bold uppercase tracking-widest-custom text-[10px]"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FailureDialog;