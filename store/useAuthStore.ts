import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isLoggedIn: boolean;
  username: string;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      username: '',
      login: (username: string) => set({ isLoggedIn: true, username }),
      logout: () => set({ isLoggedIn: false, username: '' }),
    }),
    {
      name: 'fluentfinance-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
