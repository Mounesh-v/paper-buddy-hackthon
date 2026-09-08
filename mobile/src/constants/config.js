import Constants from 'expo-constants';

const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Derive the dev machine's host from the Metro/dev-server URI so physical
  // devices and emulators can reach the backend without hardcoding an IP.
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.expoGoConfig?.debuggerHost;

  const host = hostUri?.split(':')[0];
  if (host) {
    return `http://${host}:8080/api/v1`;
  }

  return 'http://localhost:8080/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_TIMEOUT = 15000;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ACTIVE_CHILD_ID: 'active_child_id',
};

export const ROLES = {
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
};

export const NOTIFICATION_TYPES = {
  ATTENDANCE: 'ATTENDANCE',
  FEE: 'FEE',
  ACADEMIC: 'ACADEMIC',
  ASSIGNMENT: 'ASSIGNMENT',
  EVENT: 'EVENT',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  MESSAGE: 'MESSAGE',
  SYSTEM: 'SYSTEM',
};

export const ASSIGNMENT_STATUS = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  OVERDUE: 'OVERDUE',
  GRADED: 'GRADED',
};

export const FEE_STATUS = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
  PARTIAL: 'PARTIAL',
};
