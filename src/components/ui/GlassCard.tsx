import { memo, type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/hooks/useTheme';
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
  const { isDark } = useTheme();

  const content = (
    <View
      className={cn(
        'overflow-hidden rounded-3xl border p-4 shadow-lg',
        isDark
          ? 'border-indigo-400/25 bg-slate-800/90 shadow-black/25'
          : 'border-white/30 bg-white/70 shadow-slate-900/5',
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
