import { create } from 'zustand';
import { coursesApi } from '@/services/api/courses.api';
import { cacheService } from '@/services/storage/cache.service';
import type { Course, Instructor } from '@/types/course';
import { getErrorMessage } from '@/utils/errors';

interface CoursesState {
  courses: Course[];
  instructors: Instructor[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  fetchCourses: (options?: { refresh?: boolean; offline?: boolean }) => Promise<void>;
  setSearchQuery: (query: string) => void;
  getCourseById: (id: string) => Course | undefined;
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  instructors: [],
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',

  fetchCourses: async (options) => {
    const refresh = options?.refresh ?? false;
    const offline = options?.offline ?? false;

    set(refresh ? { isRefreshing: true, error: null } : { isLoading: true, error: null });

    try {
      if (offline) {
        const [cachedCourses, cachedInstructors] = await Promise.all([
          cacheService.getCourses(),
          cacheService.getInstructors(),
        ]);

        if (cachedCourses) {
          set({
            courses: cachedCourses,
            instructors: cachedInstructors ?? [],
            isLoading: false,
            isRefreshing: false,
          });
          return;
        }
      }

      const instructors = await coursesApi.fetchInstructors();
      const courses = await coursesApi.fetchCourses(instructors);

      await cacheService.setCourses(courses);
      await cacheService.setInstructors(instructors);

      set({ courses, instructors, isLoading: false, isRefreshing: false, error: null });
    } catch (error) {
      const cached = await cacheService.getCourses();
      if (cached) {
        set({
          courses: cached,
          isLoading: false,
          isRefreshing: false,
          error: getErrorMessage(error),
        });
        return;
      }

      set({
        isLoading: false,
        isRefreshing: false,
        error: getErrorMessage(error),
      });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  getCourseById: (id) => get().courses.find((course) => course.id === id),
}));
