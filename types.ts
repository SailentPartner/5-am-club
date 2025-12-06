export enum AppView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  WAKE_UP_FLOW = 'WAKE_UP_FLOW',
  DEEP_WORK = 'DEEP_WORK',
  NIGHT_ROUTINE = 'NIGHT_ROUTINE',
}

export enum WakeUpStep {
  ALARM = 'ALARM',
  STEPS = 'STEPS',
  WATER = 'WATER',
  MATH = 'MATH',
  QUOTE = 'QUOTE',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  time: string; // "HH:MM"
}

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  wakeUpTime: string; // "05:00"
  streak: number;
  deepWorkHours: number;
  lastWakeUp: string | null; // ISO Date string
  nextDayTasks: Task[];
  isAuthenticated: boolean;
  lifeMission: string;
  yearlyGoal: string;
  monthlyGoal: string;
}

export interface DailyLog {
  date: string;
  wokeUpOnTime: boolean;
  deepWorkMinutes: number;
  tasksCompleted: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  streak: number;
  deepWorkHours: number;
  avatar: string;
}