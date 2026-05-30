import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '@/utils/format';
import { resolveAvatarUri } from '@/utils/avatar';
import type { AuthUser } from '@/types/auth';

interface ProfileAvatarProps {
  user: AuthUser | null;
  isUpdating?: boolean;
  onPress?: () => void;
}

export function ProfileAvatar({ user, isUpdating = false, onPress }: ProfileAvatarProps) {
  const avatarUri = resolveAvatarUri(user);
  const initials = getInitials(user?.username ?? 'User');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Change profile picture"
      disabled={isUpdating}
      onPress={onPress}
      className="relative"
    >
      <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary-500">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} contentFit="cover" style={{ width: 96, height: 96 }} />
        ) : (
          <Text className="text-3xl font-bold text-white">{initials}</Text>
        )}
      </View>

      <View className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary-600 p-1.5 dark:border-slate-900">
        {isUpdating ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        )}
      </View>
    </Pressable>
  );
}
