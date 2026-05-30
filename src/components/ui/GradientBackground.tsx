import { memo, type ReactNode } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';

interface GradientBackgroundProps {
  children: ReactNode;
}

export const GradientBackground = memo(function GradientBackground({ children }: GradientBackgroundProps) {
  const { isDark } = useTheme();

  return (
    <View className="flex-1">
      <LinearGradient
        colors={
          isDark
            ? ['#0B1120', '#111827', '#1E1B4B']
            : ['#EEF2FF', '#F8FAFC', '#F5F3FF']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />
      {children}
    </View>
  );
});
