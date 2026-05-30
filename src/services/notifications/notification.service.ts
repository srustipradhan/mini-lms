import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';
import {
  BOOKMARK_MILESTONE_COUNT,
  REMINDER_DELAY_MINUTES,
} from '@/constants/notifications';

type NotificationsModule = typeof import('expo-notifications');

/** Remote/push APIs throw on import in Expo Go (Android) since SDK 53. */
export function areNotificationsAvailable(): boolean {
  return !(isRunningInExpoGo() && Platform.OS === 'android');
}

let notificationsModule: NotificationsModule | null | undefined;
let handlerConfigured = false;

async function loadNotifications(): Promise<NotificationsModule | null> {
  if (!areNotificationsAvailable()) {
    return null;
  }

  if (notificationsModule !== undefined) {
    return notificationsModule;
  }

  try {
    notificationsModule = await import('expo-notifications');

    if (!handlerConfigured) {
      notificationsModule.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      handlerConfigured = true;
    }

    return notificationsModule;
  } catch {
    notificationsModule = null;
    return null;
  }
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const Notifications = await loadNotifications();
    if (!Notifications) return false;

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async notifyBookmarkMilestone(count: number): Promise<void> {
    if (count < BOOKMARK_MILESTONE_COUNT) return;

    const Notifications = await loadNotifications();
    if (!Notifications) return;

    const granted = await this.requestPermissions();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Learning streak unlocked',
        body: `You've bookmarked ${count} courses. Keep building your learning path!`,
        sound: true,
      },
      trigger: null,
    });
  },

  async scheduleInactivityReminder(): Promise<void> {
    const Notifications = await loadNotifications();
    if (!Notifications) return;

    const granted = await this.requestPermissions();
    if (!granted) return;

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Continue your learning journey',
        body: 'You have courses waiting. Pick up where you left off today.',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: REMINDER_DELAY_MINUTES * 60,
        repeats: false,
      },
    });
  },

  async setupAndroidChannel(): Promise<void> {
    const Notifications = await loadNotifications();
    if (!Notifications || Platform.OS !== 'android') return;

    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  },
};
