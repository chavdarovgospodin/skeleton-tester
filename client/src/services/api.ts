import axios from 'axios';
import { getProfileId } from './utils';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const profileId = getProfileId();
  if (profileId) {
    config.headers['profile_id'] = profileId;
  }
  return config;
});

export const getProfiles = async () => {
  const response = await api.get('/profiles');
  return response.data;
};

export const getJobsByContractorId = async (contractorId: number) => {
  const response = await api.get(`/jobs/${contractorId}`);
  return response.data;
};

export const payJob = async (jobId: number) => {
  const response = await api.post(`/jobs/${jobId}/pay`);
  return response.data;
};

export const depositBalance = async (userId: number, amount: number) => {
  const response = await api.post(`/balances/deposit/${userId}`, { amount });
  return response.data;
};

export default api;
