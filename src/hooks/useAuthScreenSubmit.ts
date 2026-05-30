import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useToastStore } from '@/store/toast.store';
import { getErrorMessage } from '@/utils/errors';

interface UseAuthScreenSubmitOptions {
  successToast?: string;
  onSuccess?: () => void;
}

export function useAuthScreenSubmit<T>(
  submitFn: (values: T) => Promise<void>,
  options?: UseAuthScreenSubmitOptions,
) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToastStore((s) => s.show);
  const isActiveRef = useRef(true);
  const successToast = options?.successToast;
  const onSuccess = options?.onSuccess;

  useFocusEffect(
    useCallback(() => {
      isActiveRef.current = true;
      setError(null);
      setIsSubmitting(false);

      return () => {
        isActiveRef.current = false;
        setError(null);
        setIsSubmitting(false);
      };
    }, []),
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (values: T) => {
      if (!isActiveRef.current) return;

      setError(null);
      setIsSubmitting(true);

      try {
        await submitFn(values);
        if (!isActiveRef.current) return;

        onSuccess?.();
        if (successToast) {
          showToast(successToast, 'success');
        }
      } catch (err) {
        if (!isActiveRef.current) return;

        const message = getErrorMessage(err);
        setError(message);
        showToast(message, 'error');
      } finally {
        if (isActiveRef.current) {
          setIsSubmitting(false);
        }
      }
    },
    [submitFn, onSuccess, successToast, showToast],
  );

  return { error, isSubmitting, handleSubmit, clearError };
}
