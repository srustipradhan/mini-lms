import { memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { MotiView } from 'moti';
import { cn } from '@/utils/cn';

interface GlassCardProps extends ViewProps {
  children: ReactNode;
  animated?: boolean;
  className?: string;
}

export const GlassCard = memo(function GlassCard({
  children,
  animated = false,
  className,
  ...props
}: GlassCardProps) {
  const content = (
    <View
      className={cn(
        'overflow-hidden rounded-3xl border border-white/30 bg-white/70 p-4 shadow-lg shadow-slate-900/5 dark:border-slate-700/40 dark:bg-slate-900/50',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );

  if (!animated) return content;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 450 }}
    >
      {content}
    </MotiView>
  );
});
