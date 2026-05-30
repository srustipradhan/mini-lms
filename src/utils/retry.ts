export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delayMs?: number;
    shouldRetry?: (error: unknown, attempt: number) => boolean;
  } = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const delayMs = options.delayMs ?? 1_000;
  const shouldRetry = options.shouldRetry ?? (() => true);

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts || !shouldRetry(error, attempt)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}
