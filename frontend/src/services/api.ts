import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; password: string }) =>
    api.post('/auth/reset-password', data),
  verifyEmail: (token: string) => api.post('/auth/verify-email', { token }),
  resendVerification: () => api.post('/auth/resend-verification'),
};

export const expensesAPI = {
  getAll: (params?: any) => api.get('/expenses', { params }),
  getById: (id: string) => api.get(`/expenses/${id}`),
  create: (data: any) => api.post('/expenses', data),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getAnalytics: (params: any) => api.get('/expenses/analytics', { params }),
  processReceipt: (imageData: string) => api.post('/expenses/process-receipt', { imageData }),
  share: (id: string, shares: any[]) => api.post(`/expenses/${id}/share`, { shares }),
  getShared: () => api.get('/expenses/shared'),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updatePreferences: (data: any) => api.put('/users/preferences', data),
  getSubscription: () => api.get('/users/subscription'),
  upgrade: () => api.post('/users/upgrade'),
  getStats: () => api.get('/users/stats'),
};

export const plaidAPI = {
  createLinkToken: () => api.post('/plaid/create-link-token'),
  exchangeToken: (publicToken: string) => api.post('/plaid/exchange-token', { publicToken }),
  getAccounts: () => api.get('/plaid/accounts'),
  syncTransactions: () => api.post('/plaid/sync-transactions'),
  removeAccount: (accountId: string) => api.delete(`/plaid/accounts/${accountId}`),
  getInstitutions: () => api.get('/plaid/institutions'),
};

export const aiAPI = {
  categorize: (data: { description: string; amount: number; merchant?: string }) =>
    api.post('/ai/categorize', data),
  getInsights: (data: { period: string; expenses?: any[] }) =>
    api.post('/ai/insights', data),
  predict: (data: { months: number }) => api.post('/ai/predict', data),
  processReceipt: (imageData: string) => api.post('/ai/process-receipt', { imageData }),
  processVoice: (audioData: string) => api.post('/ai/process-voice', { audioData }),
  getSuggestions: (data: { description: string; amount: number }) =>
    api.post('/ai/suggestions', data),
  getPatterns: () => api.get('/ai/patterns'),
};

export default api; 