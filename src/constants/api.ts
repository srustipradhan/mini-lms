export const API_BASE_URL = 'https://api.freeapi.app';

export const API_ENDPOINTS = {
  login: '/api/v1/users/login',
  register: '/api/v1/users/register',
  refreshToken: '/api/v1/users/refresh-token',
  currentUser: '/api/v1/users/current-user',
  randomProducts: '/api/v1/public/randomproducts',
  randomUsers: '/api/v1/public/randomusers',
} as const;

export const API_TIMEOUT_MS = 15_000;
export const API_MAX_RETRIES = 3;
export const API_RETRY_DELAY_MS = 1_000;
