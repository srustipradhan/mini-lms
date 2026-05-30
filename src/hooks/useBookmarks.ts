import { useMemo } from 'react';
import { useBookmarksStore } from '@/store/bookmarks.store';
import { useCoursesStore } from '@/store/courses.store';
import type { Course } from '@/types/course';

export function useBookmarks() {
  const bookmarkedIds = useBookmarksStore((s) => s.bookmarkedIds);
  const bookmarkedCoursesMap = useBookmarksStore((s) => s.bookmarkedCoursesMap);
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);
  const courses = useCoursesStore((s) => s.courses);

  const bookmarkedCourses = useMemo(() => {
    if (!bookmarkedIds.length) return [];

    const liveCoursesById = new Map(courses.map((course) => [course.id, course]));
    return bookmarkedIds
      .map((id) => liveCoursesById.get(id) ?? bookmarkedCoursesMap[id])
      .filter((course): course is Course => Boolean(course));
  }, [bookmarkedCoursesMap, bookmarkedIds, courses]);

  return {
    bookmarkedIds,
    bookmarkedCourses,
    toggle: toggleBookmark,
    isBookmarked: (courseId: string) => bookmarkedIds.includes(courseId),
    count: bookmarkedIds.length,
  };
}
