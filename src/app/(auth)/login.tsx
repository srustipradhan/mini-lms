import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuthStore } from '@/store/auth.store';
import { useBiometric } from '@/hooks/useBiometric';
import { useAuthScreenSubmit } from '@/hooks/useAuthScreenSubmit';
import type { LoginFormValues } from '@/features/auth/schemas/auth.schema';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { isAvailable, isEnabled, authenticate } = useBiometric();

  const submitLogin = useCallback(
    async (values: LoginFormValues) => {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
    },
    [login],
  );

  const { error, isSubmitting, handleSubmit, clearError } = useAuthScreenSubmit(submitLogin, {
    onSuccess: () => router.replace('/(tabs)'),
  });

  const handleBiometric = useCallback(async () => {
    const success = await authenticate();
    const hasSession = useAuthStore.getState().isAuthenticated;
    if (success && hasSession) {
      router.replace('/(tabs)');
    }
  }, [authenticate, router]);

  return (
    <GradientBackground>
      <View className="flex-1 justify-center px-6">
        <Text className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Welcome back</Text>
        <Text className="mb-8 text-base text-slate-600 dark:text-slate-300">
          Sign in to continue your learning journey
        </Text>

        <GlassCard animated>
          <LoginForm loading={isSubmitting} onFieldChange={clearError} onSubmit={handleSubmit} />
          {error ? <Text className="mb-3 text-center text-sm text-red-500">{error}</Text> : null}

          {isAvailable && isEnabled ? (
            <Pressable accessibilityRole="button" onPress={handleBiometric} className="mt-2 py-2">
              <Text className="text-center text-sm font-semibold text-primary-600 dark:text-primary-300">
                Unlock with biometrics
              </Text>
            </Pressable>
          ) : null}
        </GlassCard>

        <Text className="mt-6 text-center text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link href="/(auth)/register" className="font-semibold text-primary-600 dark:text-primary-300">
            Create account
          </Link>
        </Text>
      </View>
    </GradientBackground>
  );
}
