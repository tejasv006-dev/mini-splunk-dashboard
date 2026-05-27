import axios from 'axios';

const API_URL = '/api/logs';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const fetchLogs = async (params = {}) => {
  const headersObj = getHeaders();
  const response = await axios.get(API_URL, { 
    params,
    headers: headersObj.headers
  });
  return response.data;
};

export const fetchStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, getHeaders());
  return response.data;
};
