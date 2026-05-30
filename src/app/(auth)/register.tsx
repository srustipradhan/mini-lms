import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { RegisterForm } from '@/components/forms/RegisterForm';
import { useAuthStore } from '@/store/auth.store';
import { useAuthScreenSubmit } from '@/hooks/useAuthScreenSubmit';
import type { RegisterFormValues } from '@/features/auth/schemas/auth.schema';

export default function RegisterScreen() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

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
      <View className="flex-1 justify-center px-6">
        <Text className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Create account</Text>
        <Text className="mb-8 text-base text-slate-600 dark:text-slate-300">
          Create an account to save bookmarks and track courses
        </Text>

        <GlassCard animated>
          <RegisterForm loading={isSubmitting} onFieldChange={clearError} onSubmit={handleSubmit} />
          {error ? <Text className="text-center text-sm text-red-500">{error}</Text> : null}
        </GlassCard>

        <Text className="mt-6 text-center text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link href="/(auth)/login" className="font-semibold text-primary-600 dark:text-primary-300">
            Sign in
          </Link>
        </Text>
      </View>
    </GradientBackground>
  );
}
