import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instances
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const authAPI = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token being sent:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers
  });
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If the request contains FormData, remove Content-Type to let browser set it
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
const auth = {
  login: (credentials) => authAPI.post('/login', credentials),
  signup: (userData) => authAPI.post('/signup', userData),
  verifyToken: () => authAPI.get('/verify'),
  changePassword: (data) => api.put('/users/change-password', data),
  deleteAccount: () => api.delete('/users/delete')
};

// User API methods
const users = {
  getProfile: () => api.get('/users/profile'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserProjects: (userId) => api.get(`/projects/user/${userId}`),
  getProject: (projectId) => api.get(`/projects/${projectId}`),
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  updateProject: (projectId, data) => api.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => api.delete(`/projects/${projectId}`),
  // Friend-related methods
  getFriends: () => api.get('/users/friends'),
  getFriendRequests: () => api.get('/users/friend-requests'),
  sendFriendRequest: (userId) => api.post(`/users/friend-request/${userId}`),
  acceptFriendRequest: (userId) => api.post(`/users/friend-request/${userId}/accept`),
  rejectFriendRequest: (userId) => api.post(`/users/friend-request/${userId}/reject`),
  removeFriend: (userId) => api.delete(`/users/friends/${userId}`),
  // Search method
  searchUsers: (params) => api.get('/users/matches', { params })
};

// Profile API methods
const profiles = {
  getAll: () => api.get('/profiles'),
  getOne: (id) => api.get(`/profiles/${id}`),
  create: (data) => api.post('/profiles', data),
  update: (id, data) => api.put(`/profiles/${id}`, data),
  delete: (id) => api.delete(`/profiles/${id}`),
};

// Request API methods
const requests = {
  getAll: () => api.get('/requests'),
  getOne: (id) => api.get(`/requests/${id}`),
  create: (data) => api.post('/requests', data),
  update: (id, data) => api.put(`/requests/${id}`, data),
  delete: (id) => api.delete(`/requests/${id}`),
};

export { api as default, auth, users, users as userAPI, profiles, requests }; 