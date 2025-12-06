import { UserProfile, DailyLog } from '../types';
import { DEFAULT_PROFILE } from '../constants';

const KEY_PROFILE = '5am_club_profile';
const KEY_LOGS = '5am_club_logs';

export const getProfile = (): UserProfile => {
  const data = localStorage.getItem(KEY_PROFILE);
  return data ? JSON.parse(data) : DEFAULT_PROFILE;
};

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
};

export const logout = () => {
  const profile = getProfile();
  profile.isAuthenticated = false;
  saveProfile(profile);
};

export const getLogs = (): DailyLog[] => {
  const data = localStorage.getItem(KEY_LOGS);
  return data ? JSON.parse(data) : [];
};

export const addLog = (log: DailyLog) => {
  const logs = getLogs();
  logs.push(log);
  localStorage.setItem(KEY_LOGS, JSON.stringify(logs));
};

// Mock function to update stats based on activity
export const updateStreak = () => {
  const profile = getProfile();
  const today = new Date().toDateString();
  const last = profile.lastWakeUp ? new Date(profile.lastWakeUp).toDateString() : null;

  if (last !== today) {
    // Basic streak logic: if last was yesterday, increment. If today, do nothing. Else reset.
    // For demo simplicity, we just increment.
    profile.streak += 1;
    profile.lastWakeUp = new Date().toISOString();
    saveProfile(profile);
  }
};

export const addDeepWorkTime = (minutes: number) => {
  const profile = getProfile();
  profile.deepWorkHours += Number((minutes / 60).toFixed(1));
  saveProfile(profile);
};