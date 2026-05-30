import { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { CourseCard } from '@/components/cards/CourseCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCourses } from '@/hooks/useCourses';
import type { Course } from '@/types/course';

export default function BookmarksScreen() {
  const router = useRouter();
  const { bookmarkedCourses, bookmarkedIds } = useBookmarks();
  const { fetchCourses } = useCourses();

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  const handlePress = useCallback(
    (courseId: string) => router.push(`/course/${courseId}`),
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Course }) => <CourseCard course={item} onPress={handlePress} />,
    [handlePress],
  );

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="px-5 pb-4 pt-2">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white">Bookmarks</Text>
          <Text className="mt-1 text-base text-slate-500 dark:text-slate-300">
            {bookmarkedCourses.length} saved courses
          </Text>
        </View>

        <LegendList
          data={bookmarkedCourses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          estimatedItemSize={280}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
          extraData={bookmarkedIds}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title="No bookmarks yet"
              description="Save courses from the catalog to build your learning list."
              actionLabel="Browse courses"
              onAction={() => router.push('/(tabs)')}
            />
          }
          recycleItems
        />
      </SafeAreaView>
    </GradientBackground>
  );
}
