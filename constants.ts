import { LeaderboardEntry } from './types';

export const QUOTES = [
  "Own your morning. Elevate your life.",
  "The 5 AM Club is the place where history is made.",
  "Victory happens in the solitude of the early morning.",
  "Dream big. Start small. Act now.",
  "Discipline is doing what needs to be done, even if you don't want to do it.",
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Alice M.', streak: 42, deepWorkHours: 120, avatar: 'https://picsum.photos/100/100?random=1' },
  { id: '2', name: 'David K.', streak: 35, deepWorkHours: 98, avatar: 'https://picsum.photos/100/100?random=2' },
  { id: '3', name: 'Sarah J.', streak: 21, deepWorkHours: 85, avatar: 'https://picsum.photos/100/100?random=3' },
  { id: '4', name: 'You', streak: 5, deepWorkHours: 12, avatar: 'https://picsum.photos/100/100?random=4' },
];

export const DEFAULT_PROFILE = {
  name: '',
  email: '',
  mobile: '',
  wakeUpTime: '05:00',
  streak: 0,
  deepWorkHours: 0,
  lastWakeUp: null,
  nextDayTasks: [],
  isAuthenticated: false,
  lifeMission: '',
  yearlyGoal: '',
  monthlyGoal: '',
};