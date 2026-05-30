import { useEffect } from 'react';
import { STORAGE_KEYS } from '@/constants/storage';
import { appStorage } from '@/services/storage/async.storage';
import { setOnSessionExpired } from '@/services/api/client';
import { notificationService } from '@/services/notifications/notification.service';
import { useAuthStore } from '@/store/auth.store';
import { useBookmarksStore } from '@/store/bookmarks.store';
import { useLearningStore } from '@/store/learning.store';
import { useNetworkStore } from '@/store/network.store';
import { useThemeStore } from '@/store/theme.store';

export function useAppBootstrap(): { isReady: boolean } {
  const isAuthHydrated = useAuthStore((s) => s.isHydrated);
  const isBookmarksHydrated = useBookmarksStore((s) => s.isHydrated);
  const isLearningHydrated = useLearningStore((s) => s.isHydrated);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);
  const initializeNetwork = useNetworkStore((s) => s.initialize);

  useEffect(() => {
    setOnSessionExpired(() => {
      void useAuthStore.getState().logout();
    });

    void notificationService.setupAndroidChannel();
    void hydrateAuth();
    void hydrateTheme();

    const unsubscribe = initializeNetwork();

    void appStorage.set(STORAGE_KEYS.lastActiveAt, Date.now());
    void notificationService.scheduleInactivityReminder();

    return unsubscribe;
  }, [hydrateAuth, hydrateTheme, initializeNetwork]);

  const isReady = isAuthHydrated && isBookmarksHydrated && isLearningHydrated;

  return { isReady };
}
