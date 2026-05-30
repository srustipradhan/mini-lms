import { memo } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  labelClassName?: string;
}

function getContainerClass(
  variant: ButtonVariant,
  size: ButtonSize,
  isDark: boolean,
  disabled?: boolean | null,
  className?: string,
): string {
  return cn(
    'flex-row items-center justify-center rounded-2xl active:opacity-90',
    size === 'sm' ? 'py-2.5 px-4' : size === 'lg' ? 'py-4 px-6' : 'py-3.5 px-5',
    variant === 'primary' && (isDark ? 'bg-primary-500' : 'bg-primary-600'),
    variant === 'secondary' &&
      (isDark
        ? 'border border-indigo-300/40 bg-white/12'
        : 'border border-slate-200 bg-white'),
    variant === 'ghost' && 'bg-transparent',
    variant === 'danger' && 'bg-red-500',
    disabled && 'opacity-50',
    className,
  );
}

function getLabelClass(
  variant: ButtonVariant,
  size: ButtonSize,
  isDark: boolean,
  labelClassName?: string,
): string {
  return cn(
    'font-semibold',
    size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
    (variant === 'primary' || variant === 'danger') && 'text-white',
    variant === 'secondary' && (isDark ? 'text-white' : 'text-slate-900'),
    variant === 'ghost' && (isDark ? 'text-indigo-200' : 'text-primary-600'),
    labelClassName,
  );
}

export const Button = memo(function Button({
  label,
  loading = false,
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  labelClassName,
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      className={getContainerClass(variant, size, isDark, disabled, className)}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? (isDark ? '#FFFFFF' : '#6366F1') : '#FFFFFF'}
        />
      ) : (
        <Text className={getLabelClass(variant, size, isDark, labelClassName)}>{label}</Text>
      )}
    </Pressable>
  );
});
