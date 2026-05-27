import axios from 'axios';

const API_URL = '/api/alerts';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const fetchRules = async () => {
  const response = await axios.get(`${API_URL}/rules`, getHeaders());
  return response.data;
};

export const createRule = async (ruleData) => {
  const response = await axios.post(`${API_URL}/rules`, ruleData, getHeaders());
  return response.data;
};

export const deleteRule = async (ruleId) => {
  const response = await axios.delete(`${API_URL}/rules/${ruleId}`, getHeaders());
  return response.data;
};

export const fetchIncidents = async () => {
  const response = await axios.get(`${API_URL}/incidents`, getHeaders());
  return response.data;
};

export const updateIncidentStatus = async (incidentId, status) => {
  const response = await axios.put(`${API_URL}/incidents/${incidentId}`, { status }, getHeaders());
  return response.data;
};
