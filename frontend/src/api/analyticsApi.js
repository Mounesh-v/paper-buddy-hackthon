import api from './axios';

export const getStudentDashboardAnalytics = (studentId) => api.get(`/api/v1/analytics/student/${studentId}`);
export const getClassAnalytics = (params) => api.get('/api/v1/analytics/class', { params });
export const getTopicAnalytics = (topicId, params) => api.get(`/api/v1/analytics/topic/${topicId}`, { params });
export const getTeacherInsights = (teacherId) => api.get(`/api/v1/analytics/teacher/${teacherId}`);
export const getConceptMasteryBreakdown = (studentId) => api.get(`/api/v1/analytics/mastery/${studentId}`);
