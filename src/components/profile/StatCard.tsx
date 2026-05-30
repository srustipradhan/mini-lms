import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View className="min-w-[30%] flex-1 items-center rounded-2xl bg-primary-50 px-3 py-4 dark:bg-primary-500/10">
      <Ionicons name={icon} size={20} color="#6366F1" />
      <Text className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{value}</Text>
      <Text className="mt-1 text-center text-xs text-slate-500 dark:text-slate-300">{label}</Text>
    </View>
  );
}
