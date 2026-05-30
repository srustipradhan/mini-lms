import { memo } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas/auth.schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface RegisterFormProps {
  loading: boolean;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  onFieldChange?: () => void;
}

export const RegisterForm = memo(function RegisterForm({ loading, onSubmit, onFieldChange }: RegisterFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '' },
  });

  return (
    <View>
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Username"
            autoCapitalize="none"
            value={value}
            onBlur={onBlur}
            onChangeText={(text) => {
              onFieldChange?.();
              onChange(text);
            }}
            error={errors.username?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
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
            placeholder="Min. 6 characters"
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
      <Button label="Create account" loading={loading} onPress={handleSubmit(onSubmit)} />
    </View>
  );
});
