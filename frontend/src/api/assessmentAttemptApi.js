import api from './axios';

export const startAssessmentAttempt = (data) => api.post('/api/v1/assessment-attempts/start', data);
export const saveStudentAnswer = (attemptId, data) => api.post(`/api/v1/assessment-attempts/${attemptId}/answers`, data);
export const updateStudentAnswer = (attemptId, questionId, data) => api.put(`/api/v1/assessment-attempts/${attemptId}/answers/${questionId}`, data);
export const submitAssessmentAttempt = (attemptId, data) => api.post(`/api/v1/assessment-attempts/${attemptId}/submit`, data);
export const getAttemptById = (id) => api.get(`/api/v1/assessment-attempts/${id}`);
export const getAttemptsByStudent = (studentId, params) => api.get(`/api/v1/assessment-attempts/student/${studentId}`, { params });
export const searchAttempts = (params) => api.get('/api/v1/assessment-attempts/search', { params });
export const getAttemptResult = (id) => api.get(`/api/v1/assessment-attempts/${id}/result`);
