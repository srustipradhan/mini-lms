import { STORAGE_KEYS } from '@/constants/storage';
import type { Course, Instructor } from '@/types/course';
import { appStorage } from './async.storage';

interface CacheEnvelope<T> {
  data: T;
  cachedAt: number;
}

const CACHE_TTL_MS = 1000 * 60 * 30;

export const cacheService = {
  async getCourses(): Promise<Course[] | null> {
    const envelope = await appStorage.get<CacheEnvelope<Course[]>>(STORAGE_KEYS.coursesCache);
    if (!envelope) return null;
    if (Date.now() - envelope.cachedAt > CACHE_TTL_MS) return null;
    return envelope.data;
  },

  async setCourses(courses: Course[]): Promise<void> {
    const envelope: CacheEnvelope<Course[]> = { data: courses, cachedAt: Date.now() };
    await appStorage.set(STORAGE_KEYS.coursesCache, envelope);
  },

  async getInstructors(): Promise<Instructor[] | null> {
    const envelope = await appStorage.get<CacheEnvelope<Instructor[]>>(STORAGE_KEYS.instructorsCache);
    if (!envelope) return null;
    if (Date.now() - envelope.cachedAt > CACHE_TTL_MS) return null;
    return envelope.data;
  },

  async setInstructors(instructors: Instructor[]): Promise<void> {
    const envelope: CacheEnvelope<Instructor[]> = { data: instructors, cachedAt: Date.now() };
    await appStorage.set(STORAGE_KEYS.instructorsCache, envelope);
  },
};
