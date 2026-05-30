import { COURSE_IMAGE_FALLBACK } from '@/constants/images';

export function isValidImageUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function resolveCourseImageUrl(
  candidates: Array<string | undefined | null>,
  courseId: string,
): string {
  for (const candidate of candidates) {
    if (isValidImageUrl(candidate)) return candidate.trim();
  }

  return COURSE_IMAGE_FALLBACK(courseId);
}
