import api from './axios';

// Boards
export const getBoards = (params) => api.get('/api/v1/boards', { params });
export const getBoardById = (id) => api.get(`/api/v1/boards/${id}`);
export const createBoard = (data) => api.post('/api/v1/boards', data);
export const updateBoard = (id, data) => api.put(`/api/v1/boards/${id}`, data);
export const deleteBoard = (id) => api.delete(`/api/v1/boards/${id}`);

// Curricula
export const getCurricula = (params) => api.get('/api/v1/curricula', { params });
export const getCurriculumById = (id) => api.get(`/api/v1/curricula/${id}`);
export const getCurriculaByBoard = (boardId, params) => api.get(`/api/v1/curricula/board/${boardId}`, { params });
export const createCurriculum = (data) => api.post('/api/v1/curricula', data);
export const updateCurriculum = (id, data) => api.put(`/api/v1/curricula/${id}`, data);
export const deleteCurriculum = (id) => api.delete(`/api/v1/curricula/${id}`);

// Chapters
export const getChapters = (params) => api.get('/api/v1/chapters', { params });
export const getChapterById = (id) => api.get(`/api/v1/chapters/${id}`);
export const getChaptersByCurriculum = (curriculumId, params) => api.get(`/api/v1/chapters/curriculum/${curriculumId}`, { params });
export const createChapter = (data) => api.post('/api/v1/chapters', data);
export const updateChapter = (id, data) => api.put(`/api/v1/chapters/${id}`, data);
export const deleteChapter = (id) => api.delete(`/api/v1/chapters/${id}`);

// Topics
export const getTopics = (params) => api.get('/api/v1/topics', { params });
export const getTopicById = (id) => api.get(`/api/v1/topics/${id}`);
export const getTopicsByChapter = (chapterId, params) => api.get(`/api/v1/topics/chapter/${chapterId}`, { params });
export const createTopic = (data) => api.post('/api/v1/topics', data);
export const updateTopic = (id, data) => api.put(`/api/v1/topics/${id}`, data);
export const deleteTopic = (id) => api.delete(`/api/v1/topics/${id}`);
