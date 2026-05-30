import { memo } from 'react';
import { Text, View } from 'react-native';
import { MotiView } from 'moti';
import { useToastStore } from '@/store/toast.store';
import { cn } from '@/utils/cn';

export const ToastHost = memo(function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <View pointerEvents="box-none" className="absolute inset-x-0 top-14 z-50 px-4">
      {toasts.map((toast) => (
        <MotiView
          key={toast.id}
          from={{ opacity: 0, translateY: -12 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          className="mb-2"
        >
          <View
            className={cn(
              'rounded-2xl px-4 py-3 shadow-lg',
              toast.type === 'success' && 'bg-emerald-600',
              toast.type === 'error' && 'bg-red-500',
              toast.type === 'info' && 'bg-slate-800',
            )}
          >
            <Text
              accessibilityRole="alert"
              className="text-center text-sm font-semibold text-white"
              onPress={() => dismiss(toast.id)}
            >
              {toast.message}
            </Text>
          </View>
        </MotiView>
      ))}
    </View>
  );
});
