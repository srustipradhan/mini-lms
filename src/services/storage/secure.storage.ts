import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  async multiRemove(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
  },
};
