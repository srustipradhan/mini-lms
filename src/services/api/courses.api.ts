import { API_ENDPOINTS } from '@/constants/api';
import type { ApiResponse } from '@/types/api';
import type { Course, Instructor } from '@/types/course';
import { resolveCourseImageUrl } from '@/utils/courseImage';
import { withRetry } from '@/utils/retry';
import { isNetworkError } from '@/utils/errors';
import { apiClient } from './client';

interface RandomProduct {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  rating?: number;
  images?: string[];
  image?: string;
  thumbnail?: string;
  category?: string;
  brand?: string;
}

interface RandomUser {
  id?: number;
  email?: string;
  name?: { first?: string; last?: string };
  picture?: { large?: string; medium?: string };
  login?: { uuid?: string };
}

interface PaginatedEnvelope<T> {
  data?: T[];
}

function hasDataArray<T>(value: unknown): value is PaginatedEnvelope<T> {
  return Boolean(value && typeof value === 'object' && Array.isArray((value as { data?: unknown }).data));
}

function hasUsersArray(value: unknown): value is { users?: RandomUser[] } {
  return Boolean(value && typeof value === 'object' && 'users' in value);
}

function hasProductsArray(value: unknown): value is { products?: RandomProduct[] } {
  return Boolean(value && typeof value === 'object' && 'products' in value);
}

const LEVELS: Array<Course['level']> = ['Beginner', 'Intermediate', 'Advanced'];
const CATEGORIES = ['Development', 'Design', 'Business', 'Marketing', 'Data Science', 'AI'];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function mapProductToCourse(product: RandomProduct, index: number, instructors: Instructor[]): Course {
  const id = String(product._id ?? product.id ?? `course-${index}`);
  const instructor = instructors[index % Math.max(instructors.length, 1)] ?? {
    id: 'default',
    name: 'Expert Instructor',
    avatar: 'https://i.pravatar.cc/150?img=12',
    title: 'Senior Educator',
  };

  const basePrice = Number(product.price ?? 49 + (index % 5) * 20);
  const seed = hashString(id);

  return {
    id,
    title: product.title ?? product.name ?? `Masterclass ${index + 1}`,
    description:
      product.description ??
      'A comprehensive course designed to help you master modern skills with hands-on projects and expert guidance.',
    price: basePrice,
    rating: Number(product.rating ?? 3.5 + (seed % 15) / 10),
    image: resolveCourseImageUrl(
      [product.thumbnail, product.images?.[0], product.image],
      id,
    ),
    category: product.category ?? product.brand ?? CATEGORIES[seed % CATEGORIES.length] ?? 'Development',
    instructorId: instructor.id,
    instructorName: instructor.name,
    lessonsCount: 8 + (seed % 12),
    durationHours: 4 + (seed % 20),
    level: LEVELS[seed % LEVELS.length] ?? 'Beginner',
    tags: [CATEGORIES[seed % CATEGORIES.length] ?? 'Development', instructor.title],
  };
}

function mapUserToInstructor(user: RandomUser, index: number): Instructor {
  const first = user.name?.first ?? 'Alex';
  const last = user.name?.last ?? 'Morgan';
  const name = `${first} ${last}`;
  const id = String(user.login?.uuid ?? user.id ?? `instructor-${index}`);

  return {
    id,
    name,
    avatar: user.picture?.large ?? user.picture?.medium ?? `https://i.pravatar.cc/150?u=${id}`,
    title: ['Lead Instructor', 'Course Creator', 'Industry Expert', 'Senior Mentor'][index % 4] ?? 'Instructor',
  };
}

export const coursesApi = {
  async fetchInstructors(): Promise<Instructor[]> {
    const response = await withRetry(
      () =>
        apiClient.get<ApiResponse<PaginatedEnvelope<RandomUser> | { users?: RandomUser[] } | RandomUser[]>>(
          API_ENDPOINTS.randomUsers,
        ),
      { shouldRetry: (error) => isNetworkError(error) },
    );

    const payload = response.data.data;
    const users = Array.isArray(payload)
      ? payload
      : hasDataArray<RandomUser>(payload)
        ? payload.data ?? []
        : hasUsersArray(payload)
          ? payload.users ?? []
          : [];
    return users.map(mapUserToInstructor);
  },

  async fetchCourses(instructors: Instructor[]): Promise<Course[]> {
    const response = await withRetry(
      () =>
        apiClient.get<
          ApiResponse<PaginatedEnvelope<RandomProduct> | { products?: RandomProduct[] } | RandomProduct[]>
        >(API_ENDPOINTS.randomProducts),
      { shouldRetry: (error) => isNetworkError(error) },
    );

    const payload = response.data.data;
    const products = Array.isArray(payload)
      ? payload
      : hasDataArray<RandomProduct>(payload)
        ? payload.data ?? []
        : hasProductsArray(payload)
          ? payload.products ?? []
          : [];
    return products.map((product: RandomProduct, index: number) =>
      mapProductToCourse(product, index, instructors),
    );
  },
};
