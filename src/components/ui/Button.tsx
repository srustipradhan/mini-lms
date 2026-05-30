import { memo } from 'react';
import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-2xl px-5 py-3.5 active:opacity-90',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600',
        secondary: 'bg-slate-800/80 dark:bg-slate-200/10',
        ghost: 'bg-transparent',
        danger: 'bg-red-500',
      },
      size: {
        sm: 'py-2.5 px-4',
        md: 'py-3.5 px-5',
        lg: 'py-4 px-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

const labelVariants = cva('font-semibold', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-slate-900 dark:text-white',
      ghost: 'text-primary-600 dark:text-primary-300',
      danger: 'text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
  label: string;
  loading?: boolean;
  className?: string;
  labelClassName?: string;
}

export const Button = memo(function Button({
  label,
  loading = false,
  variant,
  size,
  disabled,
  className,
  labelClassName,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), disabled && 'opacity-50', className)}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#6366F1' : '#FFFFFF'} />
      ) : (
        <Text className={cn(labelVariants({ variant, size }), labelClassName)}>{label}</Text>
      )}
    </Pressable>
  );
});
