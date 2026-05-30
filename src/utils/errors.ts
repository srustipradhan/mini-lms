import axios from 'axios';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    const status = error.response?.status;
    const apiMessage = data?.message?.toLowerCase() ?? '';

    // Normalize auth failures into one clear, user-friendly message.
    if (
      status === 401 ||
      status === 403 ||
      (status === 404 && apiMessage.includes('user does not exist')) ||
      apiMessage.includes('invalid credential') ||
      apiMessage.includes('invalid password')
    ) {
      return 'Invalid email or password. Please try again.';
    }

    return data?.message ?? error.message ?? 'Something went wrong';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return !error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK';
  }
  return false;
}
