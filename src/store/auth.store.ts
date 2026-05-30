import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storage';
import { authApi } from '@/services/api/auth.api';
import { secureStorage } from '@/services/storage/secure.storage';
import { appStorage } from '@/services/storage/async.storage';
import type { AuthSession, AuthUser, LoginCredentials, RegisterPayload } from '@/types/auth';
import { useBookmarksStore } from '@/store/bookmarks.store';
import { useLearningStore } from '@/store/learning.store';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateAvatar: (localUri: string) => Promise<void>;
  logout: () => Promise<void>;
}

async function persistSession(session: AuthSession): Promise<void> {
  await secureStorage.set(STORAGE_KEYS.accessToken, session.tokens.accessToken);
  await secureStorage.set(STORAGE_KEYS.refreshToken, session.tokens.refreshToken);
  await appStorage.set(STORAGE_KEYS.user, session.user);
}

async function persistUser(user: AuthUser): Promise<void> {
  await appStorage.set(STORAGE_KEYS.user, user);
}

function mergeUserWithLocalAvatar(current: AuthUser | null, remote: AuthUser): AuthUser {
  const localPath = current?.avatar?.localPath;
  if (!localPath) return remote;

  return {
    ...remote,
    avatar: {
      ...remote.avatar,
      localPath,
    },
  };
}

async function syncUserScopedStores(userId: string): Promise<void> {
  useBookmarksStore.getState().setScope(userId);
  useLearningStore.getState().setScope(userId);
  await Promise.all([
    useBookmarksStore.getState().hydrate(),
    useLearningStore.getState().hydrate(),
  ]);
}

async function resetUserScopedStores(): Promise<void> {
  useBookmarksStore.getState().setScope(null);
  useLearningStore.getState().setScope(null);
  await Promise.all([
    useBookmarksStore.getState().hydrate(),
    useLearningStore.getState().hydrate(),
  ]);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const [accessToken, user] = await Promise.all([
        secureStorage.get(STORAGE_KEYS.accessToken),
        appStorage.get<AuthUser>(STORAGE_KEYS.user),
      ]);

      if (accessToken && user) {
        await syncUserScopedStores(user._id);
        set({ user, isAuthenticated: true, isHydrated: true });
        return;
      }

      await resetUserScopedStores();
      set({ user: null, isAuthenticated: false, isHydrated: true });
    } catch {
      await resetUserScopedStores();
      set({ user: null, isAuthenticated: false, isHydrated: true });
    }
  },

  login: async (credentials) => {
    const session = await authApi.login(credentials);
    await persistSession(session);
    await appStorage.set(STORAGE_KEYS.lastActiveAt, Date.now());
    await syncUserScopedStores(session.user._id);
    set({ user: session.user, isAuthenticated: true });
  },

  register: async (payload) => {
    const session = await authApi.register(payload);
    await persistSession(session);
    await appStorage.set(STORAGE_KEYS.lastActiveAt, Date.now());
    await syncUserScopedStores(session.user._id);
    set({ user: session.user, isAuthenticated: true });
  },

  refreshProfile: async () => {
    const current = get().user;
    if (!current) return;

    try {
      const remote = await authApi.getCurrentUser();
      const merged = mergeUserWithLocalAvatar(current, remote);
      await persistUser(merged);
      set({ user: merged });
    } catch {
      // Keep cached profile when offline or token refresh is in progress.
    }
  },

  updateAvatar: async (localUri) => {
    const current = get().user;
    if (!current) return;

    const updated: AuthUser = {
      ...current,
      avatar: {
        ...current.avatar,
        localPath: localUri,
      },
    };

    await persistUser(updated);
    set({ user: updated });
  },

  logout: async () => {
    useBookmarksStore.getState().clear();
    useLearningStore.getState().clear();
    await resetUserScopedStores();
    await secureStorage.multiRemove([STORAGE_KEYS.accessToken, STORAGE_KEYS.refreshToken]);
    await appStorage.remove(STORAGE_KEYS.user);
    set({ user: null, isAuthenticated: false });
  },
}));
