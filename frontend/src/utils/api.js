import axios from 'axios';
import useAuthStore from '../stores/authStore';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper to get token from store or localStorage
const getToken = () => {
  // Try store first
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;
  
  // Fallback to localStorage
  try {
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.token;
    }
  } catch (e) {
    console.error('Error getting token from storage:', e);
  }
  
  return null;
};

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 for non-auth endpoints
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Don't logout during auth check or login/signup
      if (!url.includes('/auth/me') && !url.includes('/auth/login') && !url.includes('/auth/signup')) {
        localStorage.removeItem('auth-storage');
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;