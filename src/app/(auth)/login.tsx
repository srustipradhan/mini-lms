import { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthScreenLayout } from '@/components/layout/AuthScreenLayout';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoginForm } from '@/components/forms/LoginForm';
import { useAuthStore } from '@/store/auth.store';
import { useBiometric } from '@/hooks/useBiometric';
import { useAuthScreenSubmit } from '@/hooks/useAuthScreenSubmit';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';
import type { LoginFormValues } from '@/features/auth/schemas/auth.schema';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const { isAvailable, isEnabled, authenticate } = useBiometric();
  const { isDark } = useTheme();

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
      <AuthScreenLayout>
        <Text
          className={cn('mb-2 text-3xl font-bold', isDark ? 'text-white' : 'text-slate-900')}
        >
          Welcome back
        </Text>
        <Text className={cn('mb-8 text-base', isDark ? 'text-slate-200' : 'text-slate-600')}>
          Sign in to continue your learning journey
        </Text>

        <GlassCard animated>
          <LoginForm loading={isSubmitting} onFieldChange={clearError} onSubmit={handleSubmit} />
          {error ? <Text className="mb-3 text-center text-sm text-red-400">{error}</Text> : null}

          {isAvailable && isEnabled ? (
            <Pressable accessibilityRole="button" onPress={handleBiometric} className="mt-2 py-2">
              <Text
                className={cn(
                  'text-center text-sm font-semibold',
                  isDark ? 'text-indigo-200' : 'text-primary-600',
                )}
              >
                Unlock with biometrics
              </Text>
            </Pressable>
          ) : null}
        </GlassCard>

        <Text className={cn('mt-6 text-center', isDark ? 'text-slate-200' : 'text-slate-600')}>
          New here?{' '}
          <Link
            href="/(auth)/register"
            className={cn('font-semibold', isDark ? 'text-indigo-200' : 'text-primary-600')}
          >
            Create account
          </Link>
        </Text>
      </AuthScreenLayout>
    </GradientBackground>
  );
}
