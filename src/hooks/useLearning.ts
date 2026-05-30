import { useCallback, useMemo } from 'react';
import { useLearningStore } from '@/store/learning.store';

export function useLearning() {
  const enrolledIds = useLearningStore((s) => s.enrolledIds);
  const progressByCourseId = useLearningStore((s) => s.progressByCourseId);
  const enrollCourse = useLearningStore((s) => s.enrollCourse);
  const isEnrolled = useLearningStore((s) => s.isEnrolled);
  const setProgress = useLearningStore((s) => s.setProgress);
  const getProgress = useLearningStore((s) => s.getProgress);

  const stats = useMemo(
    () => useLearningStore.getState().getStats(),
    [enrolledIds, progressByCourseId],
  );

  const getEnrolledCourses = useCallback(
    <T extends { id: string }>(courses: T[]): T[] => {
      const idSet = new Set(enrolledIds);
      return courses.filter((course) => idSet.has(course.id));
    },
    [enrolledIds],
  );

  return {
    enrolledIds,
    progressByCourseId,
    stats,
    enrollCourse,
    isEnrolled,
    setProgress,
    getProgress,
    getEnrolledCourses,
  };
}
