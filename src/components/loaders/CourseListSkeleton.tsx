import { memo } from 'react';
import { View } from 'react-native';
import { Shimmer } from './Shimmer';

export const CourseListSkeleton = memo(function CourseListSkeleton() {
  return (
    <View className="gap-4 px-5">
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={`skeleton-${index}`} className="overflow-hidden rounded-3xl bg-white/50 p-4 dark:bg-slate-900/40">
          <Shimmer height={160} rounded="2xl" />
          <View className="mt-4 gap-2">
            <Shimmer height={18} width="70%" />
            <Shimmer height={14} width="45%" />
            <View className="mt-2 flex-row gap-2">
              <Shimmer height={28} width={80} rounded="full" />
              <Shimmer height={28} width={80} rounded="full" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
});
