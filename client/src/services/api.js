import axios from 'axios';

const api = axios.create({
 baseURL: "http://localhost:5000/api",
});
export const login = (data) => api.post('/auth/login', data);
export const signup = (data) => api.post('/auth/signup', data);

export const getOrders = (params) => api.get('/orders', { params });
export const createOrder = (orderData) => api.post('/orders', orderData);
export const updateOrder = (id, orderData) => api.put(`/orders/${id}`, orderData);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export const getDashboardConfig = () => api.get('/dashboard');
export const saveDashboardConfig = (config) => api.post('/dashboard', config);

export const getAnalyticsStats = (params) => api.get('/analytics/stats', { params });
export const getAnalyticsQuery = (params) => api.get('/analytics/query', { params });

export const seedSystem = () => api.post('/seed');
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
