import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;

  return (
    <View className="mx-5 mb-3 flex-row items-center gap-2 rounded-2xl bg-amber-500/90 px-4 py-3">
      <Ionicons name="cloud-offline-outline" size={18} color="#FFFFFF" />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-white">You are offline</Text>
        <Text className="text-xs text-white/90">Showing cached courses when available.</Text>
      </View>
    </View>
  );
}
