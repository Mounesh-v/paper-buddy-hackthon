import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/config';
import { storage } from '@/utils/storage';

interface ApiError {
  status?: number;
  message: string;
  data?: any;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];
let onAuthFailure: (() => void) | null = null;

export const setAuthFailureCallback = (callback: (() => void) | null): void => {
  onAuthFailure = callback;
};

const processQueue = (error: any, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshTokenValue = await storage.getRefreshToken();
        if (!refreshTokenValue) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken: refreshTokenValue,
        });

        const tokens: AuthTokens = data.data || data;
        const newAccessToken = tokens.accessToken;
        const newRefreshToken = tokens.refreshToken || refreshTokenValue;

        await storage.setAccessToken(newAccessToken);
        await storage.setRefreshToken(newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (onAuthFailure) onAuthFailure();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    let errorMessage = 'An error occurred';

    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (error.message?.includes('Network Error')) {
        errorMessage = `Network error. Cannot reach server at ${API_BASE_URL}`;
      } else {
        errorMessage = error.message || 'Network error. Please check your connection.';
      }
    } else {
      errorMessage = (error.response.data as any)?.message || error.message || 'An error occurred';
    }

    const errorData: ApiError = {
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data,
    };
    return Promise.reject(errorData);
  }
);

const unwrap = (response: any) => response.data?.data ?? response.data;

export const authService = {
  async login(email: string, password: string): Promise<any> {
    const { data } = await api.post('/auth/login', {
      email,
      password,
      requestedRole: 'PARENT',
    });
    return data.data || data;
  },

  async register(userData: { name: string; email: string; password: string; phoneNumber?: string }): Promise<any> {
    const { data } = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
    });
    return data.data || data;
  },

  async forgotPassword(email: string): Promise<any> {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async refreshToken(refreshToken: string): Promise<any> {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data || data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout even if API fails
    }
  },
};

export const parentService = {
  async getProfile(): Promise<any> {
    const response = await api.get('/parent/me');
    return unwrap(response);
  },

  async getChildren(): Promise<any> {
    const response = await api.get('/parent/children');
    return unwrap(response);
  },

  async getChild(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}`);
    return unwrap(response);
  },

  async getDashboard(studentId: string): Promise<any> {
    const response = await api.get('/parent/dashboard', {
      params: { studentId },
    });
    return unwrap(response);
  },
};

export const attendanceService = {
  async getAttendance(studentId: string, params: Record<string, any> = {}): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/attendance`, { params });
    return unwrap(response);
  },

  async getAttendanceSummary(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/attendance/summary`);
    return unwrap(response);
  },
};

export const academicsService = {
  async getAcademics(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/academics`);
    return unwrap(response);
  },

  async getExams(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/academics/exams`);
    return unwrap(response);
  },

  async getSubjects(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/academics/subjects`);
    return unwrap(response);
  },
};

export const assignmentService = {
  async getAssignments(studentId: string, params: Record<string, any> = {}): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/assignments`, { params });
    return unwrap(response);
  },

  async getAssignment(studentId: string, assignmentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/assignments/${assignmentId}`);
    return unwrap(response);
  },
};

export const feeService = {
  async getFees(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/fees`);
    return unwrap(response);
  },

  async getPayments(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/payments`);
    return unwrap(response);
  },

  async getReceipts(studentId: string): Promise<any> {
    const response = await api.get(`/parent/children/${studentId}/receipts`);
    return unwrap(response);
  },
};

export const eventService = {
  async getEvents(params: Record<string, any> = {}): Promise<any> {
    const response = await api.get('/parent/events', { params });
    return unwrap(response);
  },

  async getEvent(eventId: string): Promise<any> {
    const response = await api.get(`/parent/events/${eventId}`);
    return unwrap(response);
  },
};

export const announcementService = {
  async getAnnouncements(params: Record<string, any> = {}): Promise<any> {
    const response = await api.get('/parent/announcements', { params });
    return unwrap(response);
  },

  async getAnnouncement(announcementId: string): Promise<any> {
    const response = await api.get(`/parent/announcements/${announcementId}`);
    return unwrap(response);
  },
};

export const notificationService = {
  async getNotifications(params: Record<string, any> = {}): Promise<any> {
    const response = await api.get('/parent/notifications', { params });
    return unwrap(response);
  },

  async markAsRead(notificationId: string): Promise<any> {
    const response = await api.patch(`/parent/notifications/${notificationId}/read`);
    return unwrap(response);
  },

  async markAllAsRead(): Promise<any> {
    const response = await api.patch('/parent/notifications/read-all');
    return unwrap(response);
  },
};

export const messageService = {
  async getConversations(): Promise<any> {
    const response = await api.get('/parent/conversations');
    return unwrap(response);
  },

  async createConversation(data: { title?: string; participantIds?: string[] }): Promise<any> {
    const response = await api.post('/parent/conversations', data);
    return unwrap(response);
  },

  async getMessages(conversationId: string, params: Record<string, any> = {}): Promise<any> {
    const response = await api.get(`/parent/conversations/${conversationId}/messages`, { params });
    return unwrap(response);
  },

  async sendMessage(conversationId: string, message: string): Promise<any> {
    const response = await api.post(`/parent/conversations/${conversationId}/messages`, { content: message });
    return unwrap(response);
  },
};

export default api;
