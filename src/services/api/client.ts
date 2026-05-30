import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/constants/api';
import { STORAGE_KEYS } from '@/constants/storage';
import { secureStorage } from '@/services/storage/secure.storage';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;
let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(handler: () => void): void {
  onSessionExpired = handler;
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await secureStorage.get(STORAGE_KEYS.refreshToken);
      if (!refreshToken) return null;

      try {
        const response = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
          `${API_BASE_URL}/api/v1/users/refresh-token`,
          { refreshToken },
          { timeout: API_TIMEOUT_MS },
        );

        const { accessToken, refreshToken: newRefresh } = response.data.data;
        await secureStorage.set(STORAGE_KEYS.accessToken, accessToken);
        await secureStorage.set(STORAGE_KEYS.refreshToken, newRefresh);
        return accessToken;
      } catch {
        await secureStorage.multiRemove([STORAGE_KEYS.accessToken, STORAGE_KEYS.refreshToken]);
        onSessionExpired?.();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await secureStorage.get(STORAGE_KEYS.accessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/users/login') &&
      !originalRequest.url?.includes('/users/register')
    ) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
