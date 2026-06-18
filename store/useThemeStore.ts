import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeConfig {
  primary: string;
  gradient: [string, string];
  name: string;
  label: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  cyan: {
    name: 'cyan',
    label: 'Ocean Cyan',
    primary: '#0ea5e9',
    gradient: ['#0284c7', '#0ea5e9'],
  },
  emerald: {
    name: 'emerald',
    label: 'Forest Emerald',
    primary: '#10b981',
    gradient: ['#047857', '#10b981'],
  },
  purple: {
    name: 'purple',
    label: 'Royal Purple',
    primary: '#a855f7',
    gradient: ['#7e22ce', '#a855f7'],
  },
  amber: {
    name: 'amber',
    label: 'Sunset Amber',
    primary: '#f59e0b',
    gradient: ['#b45309', '#f59e0b'],
  },
  rose: {
    name: 'rose',
    label: 'Crimson Rose',
    primary: '#f43f5e',
    gradient: ['#be123c', '#f43f5e'],
  },
};

interface ThemeState {
  currentTheme: ThemeConfig;
  setTheme: (themeKey: keyof typeof THEMES) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: THEMES.cyan,
      setTheme: (themeKey) => set({ currentTheme: THEMES[themeKey] }),
    }),
    {
      name: 'fluentfinance-theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
