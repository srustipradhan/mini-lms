import { memo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LoginFormProps {
  loading: boolean;
  onSubmit: (values: LoginFormValues) => Promise<void>;
  onFieldChange?: () => void;
}

export const LoginForm = memo(function LoginForm({ loading, onSubmit, onFieldChange }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onFieldChange?.();
              onChange(text);
            }}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            secureTextEntry
            autoComplete="password"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onFieldChange?.();
              onChange(text);
            }}
            error={errors.password?.message}
          />
        )}
      />
      <Button label="Sign in" loading={loading} onPress={handleSubmit(onSubmit)} />
    </View>
  );
});
