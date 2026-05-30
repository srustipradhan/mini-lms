import { API_ENDPOINTS } from '@/constants/api';
import type { ApiResponse } from '@/types/api';
import type { AuthSession, AuthTokens, AuthUser, LoginCredentials, RegisterPayload } from '@/types/auth';
import { AppError } from '@/utils/errors';
import { withRetry } from '@/utils/retry';
import { isNetworkError } from '@/utils/errors';
import { apiClient } from './client';

interface LoginResponseData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

interface RegisterResponseData {
  user: AuthUser;
}

function mapSession(payload: LoginResponseData): AuthSession {
  if (!payload.accessToken || !payload.refreshToken) {
    throw new AppError('Authentication tokens were not returned by the server', 'AUTH_NO_TOKENS');
  }

  return {
    user: payload.user,
    tokens: {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    },
  };
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await withRetry(
      () => apiClient.post<ApiResponse<LoginResponseData>>(API_ENDPOINTS.login, credentials),
      { shouldRetry: (error) => isNetworkError(error) },
    );
    return mapSession(response.data.data);
  },

  /**
   * FreeAPI register only returns the user object (no JWT).
   * We complete signup by logging in immediately with the same credentials.
   */
  async register(payload: RegisterPayload): Promise<AuthSession> {
    await withRetry(
      () => apiClient.post<ApiResponse<RegisterResponseData>>(API_ENDPOINTS.register, payload),
      { shouldRetry: (error) => isNetworkError(error) },
    );

    try {
      return await this.login({ email: payload.email, password: payload.password });
    } catch {
      throw new AppError(
        'Account was created but sign-in failed. Try logging in manually.',
        'REGISTER_LOGIN_FAILED',
      );
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>(API_ENDPOINTS.currentUser);
    return response.data.data;
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(API_ENDPOINTS.refreshToken, {
      refreshToken,
    });
    return response.data.data;
  },
};
