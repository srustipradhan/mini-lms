import { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { useBookmarksStore } from '@/store/bookmarks.store';
import type { Course } from '@/types/course';

interface RecommendationsSectionProps {
  courses: Course[];
}

function getRecommendations(courses: Course[], bookmarkedIds: string[], limit = 5) {
  const bookmarkedCategories = new Set(
    courses.filter((c) => bookmarkedIds.includes(c.id)).map((c) => c.category),
  );

  return courses
    .map((course) => {
      const categoryBoost = bookmarkedCategories.has(course.category) ? 0.35 : 0;
      const ratingBoost = course.rating / 5;
      const priceBoost = course.price < 80 ? 0.1 : 0;
      const score = categoryBoost + ratingBoost + priceBoost;
      const reason =
        categoryBoost > 0
          ? `Because you bookmark ${course.category} courses`
          : course.rating >= 4.5
            ? 'Highly rated'
            : 'Popular in the catalog';

      return { course, score, reason };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function RecommendationsSection({ courses }: RecommendationsSectionProps) {
  const router = useRouter();
  const bookmarkedIds = useBookmarksStore((s) => s.bookmarkedIds);
  const recommendations = useMemo(
    () => getRecommendations(courses, bookmarkedIds),
    [courses, bookmarkedIds],
  );

  if (recommendations.length === 0) return null;

  return (
    <View className="mb-5">
      <Text className="mb-3 px-5 text-lg font-bold text-slate-900 dark:text-white">
        Recommended for you
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5 gap-3">
        {recommendations.map(({ course, reason }) => (
          <Pressable
            key={course.id}
            accessibilityRole="button"
            onPress={() => router.push(`/course/${course.id}`)}
          >
            <GlassCard className="w-64">
              <Text className="mt-1 text-base font-bold text-slate-900 dark:text-white" numberOfLines={2}>
                {course.title}
              </Text>
              <Text className="mt-2 text-sm text-slate-500 dark:text-slate-300">{reason}</Text>
            </GlassCard>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
