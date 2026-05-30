import { useCallback, useEffect } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { LegendList } from '@legendapp/list';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { CourseCard } from '@/components/cards/CourseCard';
import { CourseListSkeleton } from '@/components/loaders/CourseListSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { SearchBar } from '@/components/common/SearchBar';
import { RecommendationsSection } from '@/features/courses/components/RecommendationsSection';
import { useCourses } from '@/hooks/useCourses';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useNetworkStore } from '@/store/network.store';
import type { Course } from '@/types/course';

export default function CoursesScreen() {
  const router = useRouter();
  const isOnline = useNetworkStore((s) => s.isOnline);
  const {
    courses,
    allCourses,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    setSearchQuery,
    fetchCourses,
    refresh,
  } = useCourses();
  const { bookmarkedIds } = useBookmarks();

  useEffect(() => {
    void fetchCourses();
  }, [fetchCourses]);

  const handlePress = useCallback(
    (courseId: string) => {
      router.push(`/course/${courseId}`);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Course }) => <CourseCard course={item} onPress={handlePress} />,
    [handlePress],
  );

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="px-5 pt-2">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white">Discover</Text>
          <Text className="mt-1 text-base text-slate-500 dark:text-slate-300">
            Browse courses from the catalog
          </Text>
          <View className="mt-5">
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        </View>

        <OfflineBanner visible={!isOnline} />

        {isLoading ? (
          <CourseListSkeleton />
        ) : (
          <LegendList
            data={courses}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            estimatedItemSize={320}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 16 }}
            ListHeaderComponent={
              <>
                <RecommendationsSection courses={allCourses} />
                {error ? (
                  <Text className="mb-3 text-center text-sm text-amber-600 dark:text-amber-300">
                    {error} — showing cached data when available.
                  </Text>
                ) : null}
              </>
            }
            ListEmptyComponent={
              <EmptyState
                icon="school-outline"
                title="No courses found"
                description="Try adjusting your search or pull to refresh the catalog."
                actionLabel="Refresh"
                onAction={() => void refresh()}
              />
            }
            extraData={bookmarkedIds}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void refresh()} />}
            recycleItems
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}
