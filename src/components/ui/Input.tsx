import { forwardRef, memo } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
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
    return (
      <View className={cn('mb-4', containerClassName)}>
        <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</Text>
        <TextInput
          ref={ref}
          placeholderTextColor="#94A3B8"
          accessibilityLabel={label}
          className={cn(
            'rounded-2xl border border-slate-200 bg-white/80 px-4 py-3.5 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900/60 dark:text-white',
            error && 'border-red-400',
            className,
          )}
          {...props}
        />
        {error ? <Text className="mt-1.5 text-sm text-red-500">{error}</Text> : null}
      </View>
    );
  }),
);
