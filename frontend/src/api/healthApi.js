import api from './axios';

export const getHealthStatus = () => api.get('/api/v1/health');
