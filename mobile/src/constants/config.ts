import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra || Constants.manifest?.extra) as Record<string, string> | undefined;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  extra?.apiUrl ||
  'http://192.168.0.108:8080/api/v1';

export const API_TIMEOUT = 15000;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  ACTIVE_CHILD_ID: 'active_child_id',
} as const;

export const ROLES = {
  PARENT: 'PARENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
} as const;

export const NOTIFICATION_TYPES = {
  ATTENDANCE: 'ATTENDANCE',
  FEE: 'FEE',
  ACADEMIC: 'ACADEMIC',
  ASSIGNMENT: 'ASSIGNMENT',
  EVENT: 'EVENT',
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  MESSAGE: 'MESSAGE',
  SYSTEM: 'SYSTEM',
} as const;

export const ASSIGNMENT_STATUS = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  OVERDUE: 'OVERDUE',
  GRADED: 'GRADED',
} as const;

export const FEE_STATUS = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  OVERDUE: 'OVERDUE',
  PARTIAL: 'PARTIAL',
} as const;
