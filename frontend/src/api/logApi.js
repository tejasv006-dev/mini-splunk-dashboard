import axios from 'axios';

// Utilizing Vite Proxy to connect to Backend Server
const API_URL = '/api/logs';

export const fetchLogs = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const fetchStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response.data;
};
