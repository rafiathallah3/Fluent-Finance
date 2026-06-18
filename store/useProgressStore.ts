import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lesson metadata for progress calculation (mirrors learn.tsx categories)
export const LESSON_CATEGORIES: Record<string, string[]> = {
  'Investing': ['1', '4', '6'],   // Compound Interest, Asset Allocation, Bull Market
  'Trading': ['2'],               // Understanding Candlesticks
  'Budgeting': ['3', '5', '7'],   // Emergency Funds, DTI Ratio, Credit Scores
};

// XP milestones for level progression
export const LEVELS = [
  { level: 1, title: 'Beginner', xpRequired: 0 },
  { level: 2, title: 'Learner', xpRequired: 100 },
  { level: 3, title: 'Explorer', xpRequired: 250 },
  { level: 4, title: 'Practitioner', xpRequired: 500 },
  { level: 5, title: 'Strategist', xpRequired: 800 },
  { level: 6, title: 'Expert', xpRequired: 1200 },
  { level: 7, title: 'Master', xpRequired: 1800 },
  { level: 8, title: 'Guru', xpRequired: 2500 },
];

interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDate: string; // ISO date string (YYYY-MM-DD)
  completedLessons: string[];

  // Actions
  addXP: (amount: number) => void;
  completeLesson: (lessonId: string) => boolean; // returns false if already completed
  updateStreak: () => void;
  resetProgress: () => void;
  getCurrentLevel: () => typeof LEVELS[number];
  getNextLevel: () => typeof LEVELS[number] | null;
  getLevelProgress: () => number; // 0-1 fraction toward next level
  getCategoryProgress: (category: string) => number; // 0-100 percentage
}

const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const getYesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateString(d);
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      lastActiveDate: '',
      completedLessons: [],

      addXP: (amount: number) => {
        set((state) => ({ xp: state.xp + amount }));
        // Also update streak when gaining XP
        get().updateStreak();
      },

      completeLesson: (lessonId: string) => {
        const { completedLessons } = get();
        if (completedLessons.includes(lessonId)) {
          return false; // Already completed
        }

        set((state) => ({
          completedLessons: [...state.completedLessons, lessonId],
          xp: state.xp + 50, // Bonus XP for lesson completion
        }));

        get().updateStreak();
        return true;
      },

      updateStreak: () => {
        const { lastActiveDate, streak } = get();
        const today = getDateString();

        if (lastActiveDate === today) {
          return; // Already active today
        }

        const yesterday = getYesterday();

        if (lastActiveDate === yesterday) {
          // Consecutive day — increment streak
          set({ streak: streak + 1, lastActiveDate: today });
        } else if (lastActiveDate === '') {
          // First time ever
          set({ streak: 1, lastActiveDate: today });
        } else {
          // Streak broken — reset to 1
          set({ streak: 1, lastActiveDate: today });
        }
      },

      resetProgress: () => {
        set({
          xp: 0,
          streak: 0,
          lastActiveDate: '',
          completedLessons: [],
        });
      },

      getCurrentLevel: () => {
        const { xp } = get();
        let current = LEVELS[0];
        for (const lvl of LEVELS) {
          if (xp >= lvl.xpRequired) {
            current = lvl;
          } else {
            break;
          }
        }
        return current;
      },

      getNextLevel: () => {
        const current = get().getCurrentLevel();
        const idx = LEVELS.findIndex((l) => l.level === current.level);
        return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
      },

      getLevelProgress: () => {
        const { xp } = get();
        const current = get().getCurrentLevel();
        const next = get().getNextLevel();
        if (!next) return 1; // Max level
        const range = next.xpRequired - current.xpRequired;
        const progress = xp - current.xpRequired;
        return Math.min(progress / range, 1);
      },

      getCategoryProgress: (category: string) => {
        const { completedLessons } = get();
        const lessonIds = LESSON_CATEGORIES[category] || [];
        if (lessonIds.length === 0) return 0;
        const completed = lessonIds.filter((id) => completedLessons.includes(id)).length;
        return Math.round((completed / lessonIds.length) * 100);
      },
    }),
    {
      name: 'fluentfinance-progress',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        xp: state.xp,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        completedLessons: state.completedLessons,
      }),
    }
  )
);
