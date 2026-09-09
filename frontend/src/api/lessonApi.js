import api from './axios';

export const getLessons = (params) => api.get('/api/v1/lessons', { params });
export const searchLessons = (params) => api.get('/api/v1/lessons/search', { params });
export const getLessonById = (id) => api.get(`/api/v1/lessons/${id}`);
export const createLesson = (data) => api.post('/api/v1/lessons', data);
export const updateLesson = (id, data) => api.put(`/api/v1/lessons/${id}`, data);
export const completeLesson = (id) => api.patch(`/api/v1/lessons/${id}/complete`);
export const cancelLesson = (id) => api.patch(`/api/v1/lessons/${id}/cancel`);
export const deleteLesson = (id) => api.delete(`/api/v1/lessons/${id}`);
