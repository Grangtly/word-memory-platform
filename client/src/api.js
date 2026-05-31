import axios from 'axios';

// 开发环境用 Vite 代理，生产环境需设置为后端实际地址
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function register(username, password) {
  return api.post('/auth/register', { username, password });
}

export function login(username, password) {
  return api.post('/auth/login', { username, password });
}

export function getTodayWords() {
  return api.get('/words/today');
}

export function submitReview(wordId, remembered) {
  return api.post(`/words/${wordId}/review`, { remembered });
}

export function getStats() {
  return api.get('/words/stats');
}

export function getWordList() {
  return api.get('/words/list');
}

export function getQuiz(count = 5) {
  return api.get(`/words/quiz?count=${count}`);
}

export function submitQuiz(answers) {
  return api.post('/words/quiz', { answers });
}
