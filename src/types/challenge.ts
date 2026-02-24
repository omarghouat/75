export interface Challenge {
  id: string;
  text: string;
  reminderTime?: string;
}

export interface DailyProgress {
  [challengeId: string]: boolean;
}

export interface ChallengeState {
  status: 'setup' | 'confirming' | 'active' | 'success';
  challenges: Challenge[];
  currentDay: number;
  startDate: string | null;
  dailyProgress: DailyProgress;
  history: Record<number, { progress: DailyProgress; notes: string }>;
  photos: Record<number, string>;
  notes: string;
}