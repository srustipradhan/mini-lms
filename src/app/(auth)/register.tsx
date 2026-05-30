import { useCallback } from 'react';
import { Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { AuthScreenLayout } from '@/components/layout/AuthScreenLayout';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { useAuthStore } from '@/store/auth.store';
import { useAuthScreenSubmit } from '@/hooks/useAuthScreenSubmit';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';
import type { RegisterFormValues } from '@/features/auth/schemas/auth.schema';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const { isDark } = useTheme();

  const submitRegister = useCallback(
    async (values: RegisterFormValues) => {
      await register({
        email: values.email.trim().toLowerCase(),
        username: values.username.trim(),
        password: values.password,
      });
    },
    [register],
  );

  const { error, isSubmitting, handleSubmit, clearError } = useAuthScreenSubmit(submitRegister, {
    successToast: 'Account created successfully',
    onSuccess: () => router.replace('/(tabs)'),
  });

  return (
    <GradientBackground>
      <AuthScreenLayout>
        <Text
          className={cn('mb-2 text-3xl font-bold', isDark ? 'text-white' : 'text-slate-900')}
        >
          Create account
        </Text>
        <Text className={cn('mb-8 text-base', isDark ? 'text-slate-200' : 'text-slate-600')}>
          Create an account to save bookmarks and track courses
        </Text>

        <GlassCard animated>
          <RegisterForm loading={isSubmitting} onFieldChange={clearError} onSubmit={handleSubmit} />
          {error ? <Text className="text-center text-sm text-red-400">{error}</Text> : null}
        </GlassCard>

        <Text className={cn('mt-6 text-center', isDark ? 'text-slate-200' : 'text-slate-600')}>
          Already have an account?{' '}
          <Link
            href="/(auth)/login"
            className={cn('font-semibold', isDark ? 'text-indigo-200' : 'text-primary-600')}
          >
            Sign in
          </Link>
        </Text>
      </AuthScreenLayout>
    </GradientBackground>
  );
}
