import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { CourseImage } from '@/components/ui/CourseImage';
import { useBookmarksStore } from '@/store/bookmarks.store';
import type { Course } from '@/types/course';
import { formatCurrency, formatRating } from '@/utils/format';

interface CourseCardProps {
  course: Course;
  onPress: (courseId: string) => void;
}

export const CourseCard = memo(function CourseCard({ course, onPress }: CourseCardProps) {
  const isBookmarked = useBookmarksStore((s) => s.bookmarkedIds.includes(course.id));
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);

  return (
    <GlassCard className="p-0">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open course ${course.title}`}
        onPress={() => onPress(course.id)}
      >
        <CourseImage uri={course.image} courseId={course.id} height={168} rounded="top" />
      </Pressable>
      <View className="p-4">
        <View className="mb-2 flex-row items-start justify-between gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => onPress(course.id)}
            className="flex-1 pr-2"
          >
            <Text className="text-lg font-bold text-slate-900 dark:text-white" numberOfLines={2}>
              {course.title}
            </Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              {course.instructorName} · {course.category}
            </Text>
            <Text className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
              {course.description}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            onPress={() => void toggleBookmark(course.id, course)}
            hitSlop={12}
            className="rounded-full bg-primary-50 p-2 dark:bg-primary-500/20"
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked ? '#6366F1' : '#64748B'}
            />
          </Pressable>
        </View>

        <Pressable accessibilityRole="button" onPress={() => onPress(course.id)}>
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="rounded-full bg-amber-100 px-2.5 py-1 dark:bg-amber-500/20">
              <Text className="text-xs font-semibold text-amber-700 dark:text-amber-200">
                ★ {formatRating(course.rating)}
              </Text>
            </View>
            <View className="rounded-full bg-indigo-100 px-2.5 py-1 dark:bg-indigo-500/20">
              <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-200">{course.level}</Text>
            </View>
            {isBookmarked ? (
              <View className="rounded-full bg-emerald-100 px-2.5 py-1 dark:bg-emerald-500/20">
                <Text className="text-xs font-semibold text-emerald-700 dark:text-emerald-200">Saved</Text>
              </View>
            ) : null}
            <Text className="ml-auto text-base font-bold text-primary-600 dark:text-primary-300">
              {formatCurrency(course.price)}
            </Text>
          </View>
        </Pressable>
      </View>
    </GlassCard>
  );
});
