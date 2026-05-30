import { memo } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = memo(function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="mb-4 rounded-full bg-primary-100 p-5 dark:bg-primary-500/20">
        <Ionicons name={icon} size={36} color="#6366F1" />
      </View>
      <Text className="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">{title}</Text>
      <Text className="mb-6 text-center text-base text-slate-500 dark:text-slate-300">{description}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} className="w-full" /> : null}
    </View>
  );
});
