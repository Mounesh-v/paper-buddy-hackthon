import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/config';

let SecureStore = null;

if (Platform.OS !== 'web') {
  try {
    SecureStore = require('expo-secure-store');
  } catch {
    SecureStore = null;
  }
}

const memoryStore = {};

const webStorage = {
  async getItem(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
      return memoryStore[key] || null;
    } catch {
      return memoryStore[key] || null;
    }
  },
  async setItem(key, value) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, value);
      } else {
        memoryStore[key] = value;
      }
    } catch {
      memoryStore[key] = value;
    }
  },
  async removeItem(key) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      } else {
        delete memoryStore[key];
      }
    } catch {
      delete memoryStore[key];
    }
  },
};

export const storage = {
  async getToken(key) {
    try {
      if (SecureStore) {
        return await SecureStore.getItemAsync(key);
      }
      return await webStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setToken(key, value) {
    try {
      if (SecureStore) {
        await SecureStore.setItemAsync(key, value);
      } else {
        await webStorage.setItem(key, value);
      }
    } catch {
      // Silently fail
    }
  },

  async removeToken(key) {
    try {
      if (SecureStore) {
        await SecureStore.deleteItemAsync(key);
      } else {
        await webStorage.removeItem(key);
      }
    } catch {
      // Silently fail
    }
  },

  async getAccessToken() {
    return this.getToken(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async setAccessToken(token) {
    return this.setToken(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  async getRefreshToken() {
    return this.getToken(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async setRefreshToken(token) {
    return this.setToken(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  async clearAuth() {
    await this.removeToken(STORAGE_KEYS.ACCESS_TOKEN);
    await this.removeToken(STORAGE_KEYS.REFRESH_TOKEN);
    await this.removeToken(STORAGE_KEYS.USER_DATA);
    await this.removeToken(STORAGE_KEYS.ACTIVE_CHILD_ID);
  },
};

export default storage;
