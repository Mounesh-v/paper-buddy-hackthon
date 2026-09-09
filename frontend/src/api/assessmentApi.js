import api from './axios';

// Assessments
export const getAssessments = (params) => api.get('/api/v1/assessments', { params });
export const searchAssessments = (params) => api.get('/api/v1/assessments/search', { params });
export const getAssessmentById = (id) => api.get(`/api/v1/assessments/${id}`);
export const createAssessment = (data) => api.post('/api/v1/assessments', data);
export const updateAssessment = (id, data) => api.put(`/api/v1/assessments/${id}`, data);
export const publishAssessment = (id) => api.patch(`/api/v1/assessments/${id}/publish`);
export const closeAssessment = (id) => api.patch(`/api/v1/assessments/${id}/close`);
export const cancelAssessment = (id) => api.patch(`/api/v1/assessments/${id}/cancel`);
export const deleteAssessment = (id) => api.delete(`/api/v1/assessments/${id}`);

// Questions
export const createQuestion = (data) => api.post('/api/v1/questions', data);
export const getQuestionById = (id) => api.get(`/api/v1/questions/${id}`);
export const getQuestionsByAssessment = (assessmentId, params) => api.get(`/api/v1/assessments/${assessmentId}/questions`, { params });
export const updateQuestion = (id, data) => api.put(`/api/v1/questions/${id}`, data);
export const deleteQuestion = (id) => api.delete(`/api/v1/questions/${id}`);
