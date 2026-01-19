// API utility for making requests to backend
import axios from 'axios';

// Use environment variable or fallback to Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://techtalk-backend-kwg8.onrender.com';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('401 Unauthorized - Token:', localStorage.getItem('token') ? 'exists' : 'missing');
      console.error('Error details:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
