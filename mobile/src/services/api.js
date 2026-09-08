import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/constants/config';
import { storage } from '@/utils/storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let onAuthFailure = null;

export const setAuthFailureCallback = (callback) => {
  onAuthFailure = callback;
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  async (config) => {
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
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
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
        const refreshToken = await storage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const tokens = data.data || data;
        const newAccessToken = tokens.accessToken;
        const newRefreshToken = tokens.refreshToken || refreshToken;

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

    const errorData = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'An error occurred',
      data: error.response?.data,
    };
    return Promise.reject(errorData);
  }
);

const unwrap = (response) => response.data?.data ?? response.data;

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', {
      email,
      password,
      requestedRole: 'PARENT',
    });
    return data.data || data;
  },

  async register(userData) {
    const { data } = await api.post('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
    });
    return data.data || data;
  },

  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async refreshToken(refreshToken) {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data || data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Logout even if API fails
    }
  },
};

export const parentService = {
  async getProfile() {
    const response = await api.get('/parent/me');
    return unwrap(response);
  },

  async updateProfile(data) {
    const response = await api.put('/parent/me', data);
    return unwrap(response);
  },

  async getChildren() {
    const response = await api.get('/parent/children');
    return unwrap(response);
  },

  async getChild(studentId) {
    const response = await api.get(`/parent/children/${studentId}`);
    return unwrap(response);
  },

  async getDashboard(studentId) {
    const response = await api.get('/parent/dashboard', {
      params: { studentId },
    });
    return unwrap(response);
  },
};

export const attendanceService = {
  async getAttendance(studentId, params = {}) {
    const response = await api.get(`/parent/children/${studentId}/attendance`, { params });
    return unwrap(response);
  },

  async getAttendanceSummary(studentId) {
    const response = await api.get(`/parent/children/${studentId}/attendance/summary`);
    return unwrap(response);
  },
};

export const academicsService = {
  async getAcademics(studentId) {
    const response = await api.get(`/parent/children/${studentId}/academics`);
    return unwrap(response);
  },

  async getExams(studentId) {
    const response = await api.get(`/parent/children/${studentId}/academics/exams`);
    return unwrap(response);
  },

  async getSubjects(studentId) {
    const response = await api.get(`/parent/children/${studentId}/academics/subjects`);
    return unwrap(response);
  },
};

export const assignmentService = {
  async getAssignments(studentId, params = {}) {
    const response = await api.get(`/parent/children/${studentId}/assignments`, { params });
    return unwrap(response);
  },

  async getAssignment(studentId, assignmentId) {
    const response = await api.get(`/parent/children/${studentId}/assignments/${assignmentId}`);
    return unwrap(response);
  },
};

export const feeService = {
  async getFees(studentId) {
    const response = await api.get(`/parent/children/${studentId}/fees`);
    return unwrap(response);
  },

  async getPayments(studentId) {
    const response = await api.get(`/parent/children/${studentId}/payments`);
    return unwrap(response);
  },

  async getReceipts(studentId) {
    const response = await api.get(`/parent/children/${studentId}/receipts`);
    return unwrap(response);
  },
};

export const eventService = {
  async getEvents(params = {}) {
    const response = await api.get('/parent/events', { params });
    return unwrap(response);
  },

  async getEvent(eventId) {
    const response = await api.get(`/parent/events/${eventId}`);
    return unwrap(response);
  },
};

export const announcementService = {
  async getAnnouncements(params = {}) {
    const response = await api.get('/parent/announcements', { params });
    return unwrap(response);
  },

  async getAnnouncement(announcementId) {
    const response = await api.get(`/parent/announcements/${announcementId}`);
    return unwrap(response);
  },
};

export const notificationService = {
  async getNotifications(params = {}) {
    const response = await api.get('/parent/notifications', { params });
    return unwrap(response);
  },

  async markAsRead(notificationId) {
    const response = await api.patch(`/parent/notifications/${notificationId}/read`);
    return unwrap(response);
  },

  async markAllAsRead() {
    const response = await api.patch('/parent/notifications/read-all');
    return unwrap(response);
  },
};

export const messageService = {
  async getConversations() {
    const response = await api.get('/parent/conversations');
    return unwrap(response);
  },

  async getTeachers() {
    const response = await api.get('/parent/conversations/teachers');
    return unwrap(response);
  },

  async createConversation(data) {
    const response = await api.post('/parent/conversations', data);
    return unwrap(response);
  },

  async getMessages(conversationId, params = {}) {
    const response = await api.get(`/parent/conversations/${conversationId}/messages`, { params });
    return unwrap(response);
  },

  async sendMessage(conversationId, message) {
    const response = await api.post(`/parent/conversations/${conversationId}/messages`, { content: message });
    return unwrap(response);
  },
};

export default api;
