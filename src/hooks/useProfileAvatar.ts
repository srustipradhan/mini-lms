import { useCallback, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/store/auth.store';
import { useToastStore } from '@/store/toast.store';

export function useProfileAvatar() {
  const updateAvatar = useAuthStore((s) => s.updateAvatar);
  const showToast = useToastStore((s) => s.show);
  const [isUpdating, setIsUpdating] = useState(false);

  const pickAvatar = useCallback(async () => {
    setIsUpdating(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast('Photo library permission is required', 'error');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]?.uri) return;

      await updateAvatar(result.assets[0].uri);
      showToast('Profile picture updated', 'success');
    } catch {
      showToast('Unable to update profile picture', 'error');
    } finally {
      setIsUpdating(false);
    }
  }, [showToast, updateAvatar]);

  return { pickAvatar, isUpdating };
}
