import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getDashboard: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },
  getMonthlySales: async () => {
    const response = await apiClient.get('/monthly-sales');
    return response.data;
  },
  getTopProducts: async () => {
    const response = await apiClient.get('/top-products');
    return response.data;
  },
  getTopSellers: async () => {
    const response = await apiClient.get('/top-sellers');
    return response.data;
  },
  getPaymentMethods: async () => {
    const response = await apiClient.get('/payment-methods');
    return response.data;
  },
  getReviewDistribution: async () => {
    const response = await apiClient.get('/review-distribution');
    return response.data;
  },
  getSalesByState: async () => {
    const response = await apiClient.get('/sales-by-state');
    return response.data;
  },
  getReviewsList: async () => {
    const response = await apiClient.get('/reviews-list');
    return response.data;
  },
  getPaymentsList: async () => {
    const response = await apiClient.get('/payments-list');
    return response.data;
  },
  getCustomersList: async () => {
    const response = await apiClient.get('/customers-list');
    return response.data;
  },
  globalSearch: async (query) => {
    const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};

export default apiService;
