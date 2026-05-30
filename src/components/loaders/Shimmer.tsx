import { memo } from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { cn } from '@/utils/cn';

interface ShimmerProps {
  width?: number | `${number}%`;
  height?: number;
  className?: string;
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
}

const radiusMap = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full',
} as const;

export const Shimmer = memo(function Shimmer({
  width = '100%',
  height = 16,
  className,
  rounded = '2xl',
}: ShimmerProps) {
  return (
    <View
      className={cn('overflow-hidden bg-slate-200/80 dark:bg-slate-800/80', radiusMap[rounded], className)}
      style={{ width, height }}
    >
      <MotiView
        from={{ translateX: -200, opacity: 0.3 }}
        animate={{ translateX: 200, opacity: 0.8 }}
        transition={{ type: 'timing', duration: 1200, loop: true }}
        className="h-full w-1/2 bg-white/60 dark:bg-white/10"
      />
    </View>
  );
});
