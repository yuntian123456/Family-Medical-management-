import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Adjust if your backend is on a different port during development
});

// Optional: Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
