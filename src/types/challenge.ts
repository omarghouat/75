export interface Challenge {
  id: string;
  text: string;
}

export interface DailyProgress {
  [challengeId: string]: boolean;
}

export interface ChallengeState {
  status: 'setup' | 'confirming' | 'active';
  challenges: Challenge[];
  currentDay: number;
  startDate: string | null;
  dailyProgress: DailyProgress;
  history: Record<number, DailyProgress>;
}