import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storage';
import { appStorage } from '@/services/storage/async.storage';

export interface LearningStats {
  enrolledCount: number;
  completedCount: number;
  averageProgress: number;
}

interface LearningState {
  scopeUserId: string | null;
  enrolledIds: string[];
  progressByCourseId: Record<string, number>;
  isHydrated: boolean;
  setScope: (userId: string | null) => void;
  hydrate: () => Promise<void>;
  clear: () => void;
  enrollCourse: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  setProgress: (courseId: string, progress: number) => Promise<void>;
  getProgress: (courseId: string) => number;
  getStats: () => LearningStats;
}

function getScopedStorageKey(baseKey: string, userId: string | null): string {
  return userId ? `${baseKey}.${userId}` : `${baseKey}.guest`;
}

function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeStats(enrolledIds: string[], progressByCourseId: Record<string, number>): LearningStats {
  const enrolledCount = enrolledIds.length;
  if (enrolledCount === 0) {
    return { enrolledCount: 0, completedCount: 0, averageProgress: 0 };
  }

  const progressValues = enrolledIds.map((id) => progressByCourseId[id] ?? 0);
  const completedCount = progressValues.filter((value) => value >= 100).length;
  const averageProgress = Math.round(
    progressValues.reduce((sum, value) => sum + value, 0) / enrolledCount,
  );

  return { enrolledCount, completedCount, averageProgress };
}

export const useLearningStore = create<LearningState>((set, get) => ({
  scopeUserId: null,
  enrolledIds: [],
  progressByCourseId: {},
  isHydrated: false,

  setScope: (userId) => {
    set({ scopeUserId: userId, isHydrated: false });
  },

  hydrate: async () => {
    const userId = get().scopeUserId;
    const [storedIds, storedProgress] = await Promise.all([
      appStorage.get<string[]>(getScopedStorageKey(STORAGE_KEYS.enrolledCourses, userId)),
      appStorage.get<Record<string, number>>(
        getScopedStorageKey(STORAGE_KEYS.courseProgress, userId),
      ),
    ]);

    set({
      enrolledIds: storedIds ?? [],
      progressByCourseId: storedProgress ?? {},
      isHydrated: true,
    });
  },

  clear: () => {
    set({
      enrolledIds: [],
      progressByCourseId: {},
      isHydrated: false,
    });
  },

  enrollCourse: async (courseId) => {
    const userId = get().scopeUserId;
    const currentIds = get().enrolledIds;
    if (currentIds.includes(courseId)) return;

    const nextIds = [...currentIds, courseId];
    set({ enrolledIds: nextIds });
    await appStorage.set(getScopedStorageKey(STORAGE_KEYS.enrolledCourses, userId), nextIds);
  },

  isEnrolled: (courseId) => get().enrolledIds.includes(courseId),

  setProgress: async (courseId, progress) => {
    const userId = get().scopeUserId;
    const normalized = clampProgress(progress);
    const nextProgress = { ...get().progressByCourseId, [courseId]: normalized };

    let nextIds = get().enrolledIds;
    if (!nextIds.includes(courseId)) {
      nextIds = [...nextIds, courseId];
    }

    set({ enrolledIds: nextIds, progressByCourseId: nextProgress });
    await Promise.all([
      appStorage.set(getScopedStorageKey(STORAGE_KEYS.enrolledCourses, userId), nextIds),
      appStorage.set(getScopedStorageKey(STORAGE_KEYS.courseProgress, userId), nextProgress),
    ]);
  },

  getProgress: (courseId) => get().progressByCourseId[courseId] ?? 0,

  getStats: () => computeStats(get().enrolledIds, get().progressByCourseId),
}));
