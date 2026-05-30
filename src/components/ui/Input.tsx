import { forwardRef, memo } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
}

export const Input = memo(
  forwardRef<TextInput, InputProps>(function Input(
    { label, error, containerClassName, className, ...props },
    ref,
  ) {
    const { isDark } = useTheme();

    return (
      <View className={cn('mb-4', containerClassName)}>
        <Text
          className={cn(
            'mb-2 text-sm font-semibold',
            isDark ? 'text-slate-100' : 'text-slate-700',
          )}
        >
          {label}
        </Text>
        <TextInput
          ref={ref}
          placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
          accessibilityLabel={label}
          className={cn(
            'rounded-2xl border px-4 py-3.5 text-base',
            isDark
              ? 'border-slate-500/70 bg-slate-900/70 text-white'
              : 'border-slate-200 bg-white/80 text-slate-900',
            error && 'border-red-400',
            className,
          )}
          {...props}
        />
        {error ? <Text className="mt-1.5 text-sm text-red-400">{error}</Text> : null}
      </View>
    );
  }),
);
