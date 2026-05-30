import { create } from 'zustand';
import { STORAGE_KEYS } from '@/constants/storage';
import { appStorage } from '@/services/storage/async.storage';
import { BOOKMARK_MILESTONE_COUNT } from '@/constants/notifications';
import type { Course } from '@/types/course';
import {
  areNotificationsAvailable,
  notificationService,
} from '@/services/notifications/notification.service';
import { useToastStore } from '@/store/toast.store';

interface BookmarksState {
  scopeUserId: string | null;
  bookmarkedIds: string[];
  bookmarkedCoursesMap: Record<string, Course>;
  isHydrated: boolean;
  setScope: (userId: string | null) => void;
  hydrate: () => Promise<void>;
  clear: () => void;
  toggleBookmark: (courseId: string, course?: Course) => Promise<void>;
  isBookmarked: (courseId: string) => boolean;
  getBookmarkedCourses: (courses: Course[]) => Course[];
}

function getScopedStorageKey(baseKey: string, userId: string | null): string {
  return userId ? `${baseKey}.${userId}` : `${baseKey}.guest`;
}

async function persistBookmarks(ids: string[], userId: string | null): Promise<void> {
  await appStorage.set(getScopedStorageKey(STORAGE_KEYS.bookmarks, userId), ids);
}

async function persistBookmarkedCourses(
  coursesMap: Record<string, Course>,
  userId: string | null,
): Promise<void> {
  await appStorage.set(getScopedStorageKey(STORAGE_KEYS.bookmarkedCourses, userId), coursesMap);
}

export const useBookmarksStore = create<BookmarksState>((set, get) => ({
  scopeUserId: null,
  bookmarkedIds: [],
  bookmarkedCoursesMap: {},
  isHydrated: false,

  setScope: (userId) => {
    set({ scopeUserId: userId, isHydrated: false });
  },

  hydrate: async () => {
    const userId = get().scopeUserId;
    const [storedIds, storedCoursesMap] = await Promise.all([
      appStorage.get<string[]>(getScopedStorageKey(STORAGE_KEYS.bookmarks, userId)),
      appStorage.get<Record<string, Course>>(getScopedStorageKey(STORAGE_KEYS.bookmarkedCourses, userId)),
    ]);
    set({
      bookmarkedIds: storedIds ?? [],
      bookmarkedCoursesMap: storedCoursesMap ?? {},
      isHydrated: true,
    });
  },

  clear: () => {
    set({
      bookmarkedIds: [],
      bookmarkedCoursesMap: {},
      isHydrated: false,
    });
  },

  toggleBookmark: async (courseId, course) => {
    const userId = get().scopeUserId;
    const currentIds = get().bookmarkedIds;
    const currentCoursesMap = { ...get().bookmarkedCoursesMap };
    const wasBookmarked = currentIds.includes(courseId);

    const nextIds = wasBookmarked
      ? currentIds.filter((id) => id !== courseId)
      : [...currentIds, courseId];

    if (wasBookmarked) {
      delete currentCoursesMap[courseId];
    } else if (course) {
      currentCoursesMap[courseId] = course;
    }

    set({ bookmarkedIds: nextIds, bookmarkedCoursesMap: currentCoursesMap });
    await Promise.all([
      persistBookmarks(nextIds, userId),
      persistBookmarkedCourses(currentCoursesMap, userId),
    ]);

    if (!wasBookmarked) {
      if (areNotificationsAvailable()) {
        await notificationService.notifyBookmarkMilestone(nextIds.length);
      } else if (nextIds.length >= BOOKMARK_MILESTONE_COUNT) {
        useToastStore
          .getState()
          .show(`You've bookmarked ${nextIds.length} courses!`, 'success');
      }
    }
  },

  isBookmarked: (courseId) => get().bookmarkedIds.includes(courseId),

  getBookmarkedCourses: (courses) => {
    const ids = get().bookmarkedIds;
    const snapshots = get().bookmarkedCoursesMap;
    const liveCoursesById = new Map(courses.map((course) => [course.id, course]));

    return ids
      .map((id) => liveCoursesById.get(id) ?? snapshots[id])
      .filter((course): course is Course => Boolean(course));
  },
}));
