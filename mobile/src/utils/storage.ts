import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/config';

let SecureStore: typeof import('expo-secure-store') | null = null;

if (Platform.OS !== 'web') {
  try {
    SecureStore = require('expo-secure-store');
  } catch {
    SecureStore = null;
  }
}

export const storage = {
  async getToken(key: string): Promise<string | null> {
    try {
      if (SecureStore) {
        const value = await SecureStore.getItemAsync(key);
        return value;
      }
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn('Storage read error:', key, error);
      return null;
    }
  },

  async setToken(key: string, value: string): Promise<void> {
    try {
      if (SecureStore) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Storage write error:', key, error);
    }
  },

  async removeToken(key: string): Promise<void> {
    try {
      if (SecureStore) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Storage delete error:', key, error);
    }
  },

  async getAccessToken(): Promise<string | null> {
    return this.getToken(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setAccessToken(token: string): Promise<void> {
    return this.setToken(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return this.getToken(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    return this.setToken(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async clearAuth(): Promise<void> {
    await this.removeToken(STORAGE_KEYS.ACCESS_TOKEN);
    await this.removeToken(STORAGE_KEYS.REFRESH_TOKEN);
    await this.removeToken(STORAGE_KEYS.USER_DATA);
    await this.removeToken(STORAGE_KEYS.ACTIVE_CHILD_ID);
  },
};

export default storage;
