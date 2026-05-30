export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  avatar?: {
    url?: string;
    localPath?: string;
  };
  role?: string;
  isEmailVerified?: boolean;
  loginType?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface AuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}
