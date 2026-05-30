import '../../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ToastHost } from '@/components/common/ToastHost';
import { useAppBootstrap } from '@/hooks/useAppBootstrap';
import { useTheme } from '@/hooks/useTheme';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { isReady } = useAppBootstrap();
  const { isDark } = useTheme();

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <View className={isDark ? 'dark flex-1' : 'flex-1'}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
            <ToastHost />
          </View>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
