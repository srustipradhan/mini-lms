import { useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { useThemeStore, type ThemeMode } from '@/store/theme.store';

export function useTheme() {
  const systemScheme = useColorScheme();
  const mode = useThemeStore((s) => s.mode);
  const resolved = useThemeStore((s) => s.resolved);
  const setMode = useThemeStore((s) => s.setMode);
  const setResolved = useThemeStore((s) => s.setResolved);

  useEffect(() => {
    if (mode === 'system') {
      setResolved(systemScheme === 'dark' ? 'dark' : 'light');
    } else {
      setResolved(mode);
    }
  }, [mode, systemScheme, setResolved]);

  const isDark = resolved === 'dark';

  const cycleTheme = async (): Promise<void> => {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = order.indexOf(mode);
    const next = order[(currentIndex + 1) % order.length] ?? 'system';
    await setMode(next);
  };

  return { mode, resolved, isDark, setMode, cycleTheme };
}
