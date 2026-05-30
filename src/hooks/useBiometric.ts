import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/constants/storage';
import { appStorage } from '@/services/storage/async.storage';
import { useToastStore } from '@/store/toast.store';

export function useBiometric() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    void (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const enabled = await appStorage.get<boolean>(STORAGE_KEYS.biometricEnabled);
      setIsAvailable(compatible && enrolled);
      setIsEnabled(Boolean(enabled));
    })();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isAvailable || !isEnabled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Mini LMS',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  }, [isAvailable, isEnabled]);

  const toggleBiometric = useCallback(async (): Promise<void> => {
    if (!isAvailable) {
      showToast('Biometric authentication is not available on this device', 'error');
      return;
    }

    if (!isEnabled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable biometric login',
      });

      if (!result.success) return;
      await appStorage.set(STORAGE_KEYS.biometricEnabled, true);
      setIsEnabled(true);
      showToast('Biometric login enabled', 'success');
      return;
    }

    await appStorage.set(STORAGE_KEYS.biometricEnabled, false);
    setIsEnabled(false);
    showToast('Biometric login disabled', 'info');
  }, [isAvailable, isEnabled, showToast]);

  return { isAvailable, isEnabled, authenticate, toggleBiometric };
}
