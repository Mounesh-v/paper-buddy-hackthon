import api from './axios';

export const generateAIAnalysis = (data) => api.post('/api/v1/analysis/generate', data);
export const getAIAnalysisByAttemptId = (attemptId) => api.get(`/api/v1/analysis/${attemptId}`);
export const getHomeworkRecommendationByAttemptId = (attemptId) => api.get(`/api/v1/recommendations/${attemptId}`);
export const getHomeworkRecommendations = () => api.get('/api/v1/recommendations');
