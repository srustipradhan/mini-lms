import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^\S+$/, 'Username cannot contain spaces')
    .regex(/^[a-z]/, 'Username must start with a lowercase letter')
    .regex(
      /^[a-z][a-z0-9._-]*$/,
      'Use lowercase letters, numbers, dot, underscore, or hyphen only',
    ),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters (API requirement)')
    .max(128, 'Password is too long'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
