export const NOTIFICATION_CHANNELS = {
  default: 'default',
  reminders: 'reminders',
  achievements: 'achievements',
} as const;

export const BOOKMARK_MILESTONE_COUNT = 5;

/** Inactivity reminder delay in minutes (24 hours). */
export const REMINDER_DELAY_MINUTES = 24 * 60;
