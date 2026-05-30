import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { CourseWebView } from '@/features/webview/components/CourseWebView';
import { useCourses } from '@/hooks/useCourses';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

export default function WebViewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getCourseById } = useCourses();
  const { isDark } = useTheme();

  const course = id ? getCourseById(id) : undefined;

  if (!course || !id) {
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
      <SafeAreaView className="flex-1 px-4" edges={['top']}>
        <View className="mb-3 flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className={cn('rounded-full p-2', isDark ? 'bg-white/12' : 'bg-white/70')}
          >
            <Ionicons name="arrow-back" size={22} color="#6366F1" />
          </Pressable>
          <View className="flex-1">
            <Text
              className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}
              numberOfLines={1}
            >
              {course.title}
            </Text>
            <Text className={cn('text-sm', isDark ? 'text-slate-300' : 'text-slate-500')}>
              Lesson viewer
            </Text>
          </View>
        </View>

        <View className="flex-1">
          <CourseWebView
            courseId={id}
            courseTitle={course.title}
            courseDescription={course.description}
            instructorName={course.instructorName}
            category={course.category}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
