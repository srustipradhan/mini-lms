import { useCallback, useMemo } from 'react';
import { useCoursesStore } from '@/store/courses.store';
import { useLearningStore } from '@/store/learning.store';
import { useNetworkStore } from '@/store/network.store';

export function useCourses() {
  const courses = useCoursesStore((s) => s.courses);
  const isLoading = useCoursesStore((s) => s.isLoading);
  const isRefreshing = useCoursesStore((s) => s.isRefreshing);
  const error = useCoursesStore((s) => s.error);
  const searchQuery = useCoursesStore((s) => s.searchQuery);
  const fetchCourses = useCoursesStore((s) => s.fetchCourses);
  const setSearchQuery = useCoursesStore((s) => s.setSearchQuery);
  const getCourseById = useCoursesStore((s) => s.getCourseById);
  const enrollCourse = useLearningStore((s) => s.enrollCourse);
  const isEnrolled = useLearningStore((s) => s.isEnrolled);
  const isOnline = useNetworkStore((s) => s.isOnline);

  const filteredCourses = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return courses;

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(normalized) ||
        course.description.toLowerCase().includes(normalized) ||
        course.category.toLowerCase().includes(normalized) ||
        course.instructorName.toLowerCase().includes(normalized),
    );
  }, [courses, searchQuery]);

  const refresh = useCallback(() => {
    return fetchCourses({ refresh: true, offline: !isOnline });
  }, [fetchCourses, isOnline]);

  const load = useCallback(() => {
    return fetchCourses({ offline: !isOnline });
  }, [fetchCourses, isOnline]);

  return {
    courses: filteredCourses,
    allCourses: courses,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    fetchCourses: load,
    refresh,
    getCourseById,
    enrollCourse,
    isEnrolled,
    isOnline,
  };
}
