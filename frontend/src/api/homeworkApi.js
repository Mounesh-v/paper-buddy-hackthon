import api from './axios';

export const generateAIHomework = (data) => api.post('/api/v1/homework/generate', data);
export const createHomework = (data) => api.post('/api/v1/homework', data);
export const getHomeworkById = (id) => api.get(`/api/v1/homework/${id}`);
export const getHomeworkByStudent = (studentId, params) => api.get(`/api/v1/homework/student/${studentId}`, { params });
export const getHomeworkByTeacher = (teacherId, params) => api.get(`/api/v1/homework/teacher/${teacherId}`, { params });
export const searchHomework = (params) => api.get('/api/v1/homework/search', { params });
export const updateHomework = (id, data) => api.put(`/api/v1/homework/${id}`, data);
export const publishHomework = (id) => api.patch(`/api/v1/homework/${id}/publish`);
export const submitHomework = (id, data) => api.post(`/api/v1/homework/${id}/submit`, data);
export const getSubmissionByHomeworkId = (id) => api.get(`/api/v1/homework/${id}/submission`);
export const getFeedbackByHomeworkId = (id) => api.get(`/api/v1/homework/${id}/feedback`);
export const deleteHomework = (id) => api.delete(`/api/v1/homework/${id}`);
