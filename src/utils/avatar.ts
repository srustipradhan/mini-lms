import type { AuthUser } from '@/types/auth';

export function resolveAvatarUri(user: AuthUser | null | undefined): string | null {
  if (!user?.avatar) return null;
  return user.avatar.localPath ?? user.avatar.url ?? null;
}
