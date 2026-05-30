import { memo, type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useOrientation } from '@/hooks/useOrientation';
import { cn } from '@/utils/cn';

interface AuthScreenLayoutProps {
  children: ReactNode;
}

export const AuthScreenLayout = memo(function AuthScreenLayout({ children }: AuthScreenLayoutProps) {
  const { isLandscape } = useOrientation();

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName={cn(
        'flex-grow justify-center px-6 py-8',
        isLandscape && 'items-center',
      )}
    >
      <View className={cn('w-full', isLandscape ? 'max-w-md' : undefined)}>{children}</View>
    </ScrollView>
  );
});
