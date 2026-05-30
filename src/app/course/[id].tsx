import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { CourseImage } from '@/components/ui/CourseImage';
import { useCourses } from '@/hooks/useCourses';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTheme } from '@/hooks/useTheme';
import { useToastStore } from '@/store/toast.store';
import { cn } from '@/utils/cn';
import { formatCurrency, formatRating } from '@/utils/format';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isDark } = useTheme();
  const { getCourseById, enrollCourse, isEnrolled } = useCourses();
  const { isBookmarked, toggle } = useBookmarks();
  const showToast = useToastStore((s) => s.show);

  const course = useMemo(() => (id ? getCourseById(id) : undefined), [getCourseById, id]);
  const enrolled = id ? isEnrolled(id) : false;
  const bookmarked = id ? isBookmarked(id) : false;

  const handleEnroll = useCallback(async () => {
    if (!id) return;
    await enrollCourse(id);
    showToast('Successfully enrolled', 'success');
  }, [enrollCourse, id, showToast]);

  const handleOpenViewer = useCallback(() => {
    if (!id) return;
    router.push(`/webview/${id}`);
  }, [id, router]);

  const handleBookmark = useCallback(async () => {
    if (!id || !course) return;
    await toggle(id, course);
    showToast(bookmarked ? 'Removed from bookmarks' : 'Added to bookmarks', 'info');
  }, [bookmarked, course, id, showToast, toggle]);

  if (!course) {
    return (
      <GradientBackground>
        <SafeAreaView className="flex-1 items-center justify-center px-6">
          <Text className={cn('text-lg font-semibold', isDark ? 'text-white' : 'text-slate-900')}>
            Course not found
          </Text>
          <Button label="Go back" className="mt-4 w-full" onPress={() => router.back()} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView contentContainerClassName="pb-8">
          <MotiView
            from={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <CourseImage uri={course.image} courseId={course.id} height={260} rounded="none" />
          </MotiView>

          <View className="px-5 pt-4">
            <View className="mb-3 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-slate-900')}>
                  {course.title}
                </Text>
                <Text className={cn('mt-1', isDark ? 'text-slate-300' : 'text-slate-500')}>
                  {course.instructorName} · {course.category}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                onPress={handleBookmark}
                className={cn(
                  'rounded-2xl p-3',
                  isDark ? 'bg-white/12' : 'bg-white/80',
                )}
              >
                <Ionicons
                  name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color="#6366F1"
                />
              </Pressable>
            </View>

            <GlassCard>
              <View className="mb-3 flex-row flex-wrap gap-2">
                <Badge label={`★ ${formatRating(course.rating)}`} isDark={isDark} />
                <Badge label={course.level} isDark={isDark} />
                <Badge label={`${course.lessonsCount} lessons`} isDark={isDark} />
                <Badge label={`${course.durationHours}h`} isDark={isDark} />
              </View>
              <Text className={cn('text-base leading-6', isDark ? 'text-slate-200' : 'text-slate-600')}>
                {course.description}
              </Text>
              <Text className={cn('mt-4 text-2xl font-bold', isDark ? 'text-indigo-200' : 'text-primary-600')}>
                {formatCurrency(course.price)}
              </Text>
            </GlassCard>

            <View className="mt-4 gap-3">
              <Button
                label={enrolled ? 'Continue learning' : 'Enroll now'}
                onPress={handleEnroll}
              />
              <Button
                label="Open lesson viewer"
                variant="secondary"
                onPress={handleOpenViewer}
              />
              <Button label="Back to catalog" variant="ghost" onPress={() => router.back()} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

function Badge({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <View
      className={cn(
        'rounded-full px-3 py-1',
        isDark ? 'bg-indigo-500/25' : 'bg-primary-50',
      )}
    >
      <Text
        className={cn(
          'text-xs font-semibold',
          isDark ? 'text-indigo-100' : 'text-primary-700',
        )}
      >
        {label}
      </Text>
    </View>
  );
}
