import { useCallback, useEffect, type ReactNode } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { StatCard } from '@/components/profile/StatCard';
import { useAuthStore } from '@/store/auth.store';
import { useBiometric } from '@/hooks/useBiometric';
import { useTheme } from '@/hooks/useTheme';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useLearning } from '@/hooks/useLearning';
import { useProfileAvatar } from '@/hooks/useProfileAvatar';
import { formatMemberSince } from '@/utils/format';
import {
  areNotificationsAvailable,
  notificationService,
} from '@/services/notifications/notification.service';
import { useToastStore } from '@/store/toast.store';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const logout = useAuthStore((s) => s.logout);
  const { isAvailable, isEnabled, toggleBiometric } = useBiometric();
  const { mode, cycleTheme } = useTheme();
  const { count } = useBookmarks();
  const { stats } = useLearning();
  const { pickAvatar, isUpdating } = useProfileAvatar();
  const showToast = useToastStore((s) => s.show);
  const notificationsAvailable = areNotificationsAvailable();

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const handleLogout = useCallback(async () => {
    await logout();
    router.replace('/(auth)/login');
  }, [logout, router]);

  const handleEnableNotifications = useCallback(async () => {
    if (!notificationsAvailable) {
      showToast(
        'Local notifications need a development build on Android. Use Expo Go on iOS or run: npx expo run:android',
        'info',
      );
      return;
    }
    const granted = await notificationService.requestPermissions();
    showToast(
      granted ? 'Notifications enabled' : 'Notification permission denied',
      granted ? 'success' : 'error',
    );
  }, [notificationsAvailable, showToast]);

  const memberSince = formatMemberSince(user?.createdAt);

  return (
    <GradientBackground>
      <SafeAreaView className="flex-1 px-5" edges={['top']}>
        <Text className="pt-2 text-3xl font-bold text-slate-900 dark:text-white">Profile</Text>

        <GlassCard animated className="mt-6 items-center">
          <ProfileAvatar user={user} isUpdating={isUpdating} onPress={() => void pickAvatar()} />
          <Text className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            {user?.username ?? 'Learner'}
          </Text>
          <Text className="mt-1 text-slate-500 dark:text-slate-300">{user?.email}</Text>
          {user?.role ? (
            <Text className="mt-1 text-sm capitalize text-slate-500 dark:text-slate-300">
              {user.role}
            </Text>
          ) : null}
          {memberSince ? (
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Member since {memberSince}
            </Text>
          ) : null}
          <Text className="mt-2 text-xs text-slate-400 dark:text-slate-400">
            Tap photo to update (saved on this device)
          </Text>
        </GlassCard>

        <GlassCard className="mt-4">
          <Text className="mb-3 text-base font-semibold text-slate-900 dark:text-white">
            Learning stats
          </Text>
          <View className="flex-row gap-2">
            <StatCard icon="school-outline" label="Enrolled" value={String(stats.enrolledCount)} />
            <StatCard
              icon="checkmark-circle-outline"
              label="Completed"
              value={String(stats.completedCount)}
            />
            <StatCard
              icon="trending-up-outline"
              label="Avg progress"
              value={`${stats.averageProgress}%`}
            />
          </View>
          <Text className="mt-3 text-center text-sm text-primary-600 dark:text-primary-300">
            {count} bookmarked courses
          </Text>
        </GlassCard>

        <GlassCard className="mt-4">
          <SettingRow
            icon="moon-outline"
            label="Theme"
            value={mode}
            onPress={() => void cycleTheme()}
          />
          <SettingRow
            icon="finger-print-outline"
            label="Biometric login"
            trailing={
              <Switch
                value={isEnabled}
                disabled={!isAvailable}
                onValueChange={() => void toggleBiometric()}
              />
            }
          />
          <SettingRow
            icon="notifications-outline"
            label="Push notifications"
            onPress={() => void handleEnableNotifications()}
          />
        </GlassCard>

        <Button label="Sign out" variant="danger" onPress={handleLogout} className="mt-6" />
      </SafeAreaView>
    </GradientBackground>
  );
}

function SettingRow({
  icon,
  label,
  value,
  trailing,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={20} color="#6366F1" />
        <Text className="text-base font-medium text-slate-900 dark:text-white">{label}</Text>
      </View>
      {trailing ?? (
        <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
          <Text className="text-sm capitalize text-slate-500 dark:text-slate-300">{value}</Text>
        </Pressable>
      )}
    </View>
  );
}
