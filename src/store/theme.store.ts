import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storage';
import { appStorage } from '@/services/storage/async.storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  hydrate: () => Promise<void>;
  setMode: (mode: ThemeMode) => Promise<void>;
  setResolved: (resolved: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  resolved: 'light',

  hydrate: async () => {
    const stored = await appStorage.get<ThemeMode>(STORAGE_KEYS.theme);
    if (stored) {
      set({ mode: stored });
    }
  },

  setMode: async (mode) => {
    await appStorage.set(STORAGE_KEYS.theme, mode);
    set({ mode });
  },

  setResolved: (resolved) => set({ resolved }),
}));
